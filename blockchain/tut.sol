// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
// import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract TicketMarketplace is ERC1155, ReentrancyGuard {
    // AggregatorV3Interface internal dataFeed;
    address public immutable owner;
    uint256 public constant marketplaceFeePercent = 2;

    constructor() ERC1155("ipfs://<CID>/{id}.json") {
        owner = msg.sender;
        // dataFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306); // Sepolia feed
        // 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419 : for mainnet
    }

    enum TokenType { TICKET, LOYALTY }
    enum TicketType { GENERAL, VIP }
    // enum EventCategory { MOVIES, SPORTS, CONCERTS, OTHERS }

    struct EventDetails {
        address bandOwner;
        uint64 eventNumber;
        uint64[2] maxTickets;
        uint64[2] ticketPrice;
        uint64[2] ticketSold;
        uint256 eventStartTime;
        uint256 ticketSellStartTime;
        // EventCategory eventCategory;
    }

    struct Resell {
        uint256 tokenId;
        uint256 price;
        address seller;
    }

    struct TicketDetails {
        address bandOwner;
        uint64 eventNumber;
        uint64 seatNumber;
        bool used;
        TicketType ticketType;
    }

    event EventCreated(uint256 indexed eventId, address bandOwner, uint256 eventNumber, uint64[2] maxTickets, uint64[2] ticketPrice, uint256 eventStartTime, uint256 ticketSellStartTime, uint256[] tokenIds);
    event TicketListed(uint256 indexed tokenId, uint256 price, address seller);
    event TicketSold(uint256 indexed tokenId, address buyer, uint256 price);
    event TicketValidated(uint256 indexed tokenId, address validator);

    uint256 public totalEvents;

    mapping(address => uint256) public bandEventCounts;
    mapping(uint256 => EventDetails) public events;
    mapping(uint256 => Resell) public resellListings;
    mapping(uint256 => bool) public isTicketUsed;
    mapping(uint256 => TicketDetails) public ticketDetails;
    mapping(uint256 => address) public eventCreators;
    mapping(uint256 => address) public ticketOwner;
    // Loyalty points
    mapping(address => mapping(uint256 => uint256)) public loyaltyBalances;
    // Current acitve tickets held by the owner for each event
    mapping(address => mapping(uint256 => uint256)) public ticketsBought;
    // Storing a mapping from the bandOwner to the CID of ipfs
    mapping(address => string) public bandMetaDataCID;

    // --- Chainlink Price Feed ---
    // function getLatestPrice() public view returns (int) {
    //     (, int answer, , , ) = dataFeed.latestRoundData();
    //     return answer;
    // }

    // --- Event & Ticket Creation ---
    function createEvent(
        uint64[2] calldata maxTickets,
        uint64[2] calldata ticketPrice,
        uint256 eventStartTime,
        uint256 ticketSellStartTime
        // EventCategory eventCategory
    ) public {
        address bandOwner = msg.sender;
        totalEvents++;
        uint256 newEventNum = ++bandEventCounts[bandOwner];
        events[totalEvents] = EventDetails(bandOwner, uint64(newEventNum), maxTickets, ticketPrice, [uint64(0),uint64(0)], eventStartTime, ticketSellStartTime);
        eventCreators[totalEvents] = msg.sender;

        uint256 totalTickets = maxTickets[0]+maxTickets[1];
        uint256[] memory tokenIds = new uint256[](totalTickets);
        uint256[] memory amounts = new uint256[](totalTickets);

        for (uint256 i = 0; i < maxTickets[0]; i++) {
            uint256 tokenId = _encodeTokenId(bandOwner, newEventNum, i+1);
            tokenIds[i] = tokenId;
            amounts[i] = 1;
            ticketDetails[tokenId] = TicketDetails(bandOwner, uint64(newEventNum), uint64(i+1), false, TicketType.GENERAL);
            ticketOwner[tokenId] = msg.sender;
        }

        for (uint256 i = maxTickets[0]; i < totalTickets; i++) {
            uint256 tokenId = _encodeTokenId(bandOwner, newEventNum, i+1);
            tokenIds[i] = tokenId;
            amounts[i] = 1;
            ticketDetails[tokenId] = TicketDetails(bandOwner, uint64(newEventNum), uint64(i+1), false, TicketType.VIP);
            ticketOwner[tokenId] = msg.sender;
        }

        _mintBatch(msg.sender, tokenIds, amounts, "");

        emit EventCreated(totalEvents, bandOwner, newEventNum, maxTickets, ticketPrice, eventStartTime, ticketSellStartTime ,tokenIds);
    }

    // Buy Ticket
    function buyTicket(uint256 tokenId) public payable nonReentrant {
        address seller = ticketOwner[tokenId];
        require(seller != msg.sender, "You already own this ticket");

        uint256 eventId = _getEventIdFromTicket(tokenId);
        require(ticketsBought[msg.sender][eventId] < 3, "Max ticket limit reached");

        // Check if user is eligible to buy at this time (regular or early access)
        require(_canUserBuyNow(msg.sender, eventId), "You cannot buy ticket at this time");

        require(msg.value == events[eventId].ticketPrice[0] || msg.value == events[eventId].ticketPrice[1], "Incorrect price");
        require(isApprovedForAll(seller, address(this)), "Seller hasn't approved marketplace");

        _safeTransferFrom(seller, msg.sender, tokenId, 1, "");
        payable(seller).transfer(msg.value);

        ticketOwner[tokenId] = msg.sender;
        ticketsBought[msg.sender][eventId]++;

        // Mint loyalty token
        address bandOwner = ticketDetails[tokenId].bandOwner;
        uint256 loyaltyId = _getLoyaltyTokenId(bandOwner);
        _mint(msg.sender, loyaltyId, 10, "");
        loyaltyBalances[msg.sender][loyaltyId] += 10;

        emit TicketSold(tokenId, msg.sender, msg.value);
    }

    function _canUserBuyNow(address user, uint256 eventId) internal view returns (bool) {
        EventDetails memory evt = events[eventId];
        uint256 currentTime = block.timestamp;

        if (currentTime >= evt.eventStartTime) {
            return false; // Can't buy after event starts
        }
        if (currentTime >= evt.ticketSellStartTime) {
            return true; // Public sale open
        }

        uint256 loyaltyBalance = loyaltyBalances[user][_getLoyaltyTokenId(evt.bandOwner)];

        if (loyaltyBalance >= 100 && currentTime >= (evt.ticketSellStartTime - 1 hours)) {
            return true;
        }
        if (loyaltyBalance >= 50 && currentTime >= (evt.ticketSellStartTime - 30 minutes)) {
            return true;
        }
        return false; // Not allowed to buy yet
    }

    // --- Resell Tickets ---
    function resellTicket(uint256 tokenId, uint256 resalePrice) public nonReentrant {
        uint256 eventId = _getEventIdFromTicket(tokenId);
        require(events[eventId].eventStartTime > block.timestamp && block.timestamp > events[eventId].ticketSellStartTime, "Not in the required time slot to resell");
        require(ticketOwner[tokenId] == msg.sender, "Not your ticket");
        require(!isTicketUsed[tokenId], "Used ticket");
        uint64[2] memory original = events[_getEventIdFromTicket(tokenId)].ticketPrice;

        //TODO
        require((resalePrice <= original[0] + (original[0] * 10 / 100)) || (resalePrice <= original[1] + (original[1] * 10 / 100)), "Exceeds resale cap");

        _safeTransferFrom(msg.sender, address(this), tokenId, 1, "");
        resellListings[tokenId] = Resell(tokenId, resalePrice, msg.sender);
        ticketOwner[tokenId] = address(this);

        emit TicketListed(tokenId, resalePrice, msg.sender);
    }

    function buyResellTicket(uint256 tokenId) public payable nonReentrant {
        uint256 eventId = _getEventIdFromTicket(tokenId);
        require(events[eventId].eventStartTime > block.timestamp && block.timestamp > events[eventId].ticketSellStartTime, "Not in the required time slot to resell");
        Resell memory info = resellListings[tokenId];
        require(info.seller != address(0), "Not listed");
        require(info.seller != msg.sender, "Self-buying");
        require(ticketsBought[msg.sender][eventId] < 3, "Maximum Ticket buying limit reached");
        require(msg.value == info.price, "Incorrect price");

        _safeTransferFrom(address(this), msg.sender, tokenId, 1, "");
        uint256 fee = (msg.value * marketplaceFeePercent) / 100;
        payable(info.seller).transfer(msg.value - fee);
        payable(owner).transfer(fee);

        ticketOwner[tokenId] = msg.sender;
        ticketsBought[msg.sender][eventId]++;
        delete resellListings[tokenId];

        emit TicketSold(tokenId, msg.sender, msg.value);
    }

    // --- Validation ---
    function validateTicket(uint256 tokenId) public {
        TicketDetails memory t = ticketDetails[tokenId];

        // Check if the ticket exists (assuming seatNumber 0 means non-existent)
        require(t.seatNumber != 0, "Ticket does not exist");

        uint256 eventId = _getEventIdFromTicket(tokenId);
        require(msg.sender == eventCreators[eventId], "Not authorized");
        require(!isTicketUsed[tokenId], "Already used");

        isTicketUsed[tokenId] = true;

        emit TicketValidated(tokenId, msg.sender);
    }

    // --- Utility ---
    function _getEventIdFromTicket(uint256 tokenId) internal view returns (uint256) {
        TicketDetails memory t = ticketDetails[tokenId];
        for (uint256 i = 1; i <= totalEvents; i++) {
            if (
                events[i].bandOwner == t.bandOwner &&
                events[i].eventNumber == t.eventNumber
            ) return i;
        }
        revert("Event not found");
    }

    //Ticket ID Generation
    function _encodeTokenId(address bandOwner, uint256 eventId, uint256 seatNumber) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(bandOwner, eventId, seatNumber)));
    }

    //Loyalty token ID (per band)
    function _getLoyaltyTokenId(address bandOwner) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked("LOYALTY", bandOwner)));
    }

    // --- Getter Functions ---
    function getLoyaltyBalance(address addr, address bandOwner) public view returns(uint256) {
        return loyaltyBalances[addr][_getLoyaltyTokenId(bandOwner)];
    }

    function getTicketDetails(uint256 tokenId) public view returns (TicketDetails memory) {
        TicketDetails memory t = ticketDetails[tokenId];
        t.used = isTicketUsed[tokenId];
        return t;
    }

    // MetaData IPFS
    function setBandMetadataCID(string memory cid) external {
        bandMetaDataCID[msg.sender] = cid;
    }

    // --- Required for ERC-1155 receiver compliance ---
    function onERC1155Received(address, address, uint256, uint256, bytes memory) public pure returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] memory, uint256[] memory, bytes memory) public pure returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}
