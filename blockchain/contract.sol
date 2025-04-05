// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TicketMarketplace is ERC1155, ReentrancyGuard {
    address public immutable owner;
    uint256 public constant MARKETPLACE_FEE_PERCENT = 2;
    uint256 public constant MAX_RESALE_PREMIUM_PERCENT = 10;
    uint256 public constant MAX_TICKETS_PER_USER = 3;
    uint256 public constant LOYALTY_POINTS_PER_PURCHASE = 10;
    uint256 public constant LOYALTY_POINTS_TIER1 = 50;
    uint256 public constant LOYALTY_POINTS_TIER2 = 100;
    uint256 public constant TIER1_EARLY_ACCESS_MINUTES = 30;
    uint256 public constant TIER2_EARLY_ACCESS_MINUTES = 60;

    uint256 public totalEvents;

    enum TokenType {
        TICKET,
        LOYALTY
    }

    // Optimized structs for better storage packing
    struct EventDetails {
        address bandOwner;
        uint64 eventNumber;
        uint64 generalMaxTickets;
        uint64 vipMaxTickets;
        uint64 generalTicketPrice;
        uint64 vipTicketPrice;
        uint64 generalTicketSold;
        uint64 vipTicketSold;
        uint40 eventStartTime; // Timestamps as uint40 (valid until year 36812)
        uint40 ticketSellStartTime;
    }

    struct TicketDetails {
        address bandOwner;
        uint64 eventNumber;
        uint64 seatNumber;
        bool used;
        bool isVip;
    }

    struct Resell {
        uint256 price;
        address seller;
        bool isListed;
    }

    // Events
    event EventCreated(
        uint256 indexed eventId,
        address bandOwner,
        uint64 eventNumber,
        uint64 generalMaxTickets,
        uint64 vipMaxTickets,
        uint64 generalTicketPrice,
        uint64 vipTicketPrice,
        uint40 eventStartTime,
        uint40 ticketSellStartTime,
        uint256[] tokenIds
    );
    event TicketListed(uint256 indexed tokenId, uint256 price, address seller);
    event TicketSold(uint256 indexed tokenId, address buyer, uint256 price);
    event TicketValidated(uint256 indexed tokenId, address validator);

    // Storage mappings
    mapping(address => uint64) public bandEventCounts;
    mapping(uint256 => EventDetails) public events;
    mapping(uint256 => Resell) public resellListings;
    mapping(uint256 => TicketDetails) public ticketDetails;
    mapping(uint256 => address) public eventCreators;
    mapping(address => mapping(uint256 => uint256)) public ticketsBought;
    mapping(address => mapping(uint256 => uint256)) public loyaltyBalances;
    mapping(address => string) public bandMetaDataCID;
    // New mapping to avoid expensive searches
    mapping(address => mapping(uint64 => uint256)) private bandEventToId;

    constructor() ERC1155("ipfs://<CID>/{id}.json") {
        owner = msg.sender;
    }

    // --- Event & Ticket Creation ---
    function createEvent(
        uint64 generalMaxTickets,
        uint64 vipMaxTickets,
        uint64 generalTicketPrice,
        uint64 vipTicketPrice,
        uint40 eventStartTime,
        uint40 ticketSellStartTime
    ) public {
        // Input validation
        require(
            block.timestamp < eventStartTime,
            "Event must be in the future"
        );
        require(
            ticketSellStartTime < eventStartTime,
            "Ticket sale must end before event starts"
        );
        require(
            generalMaxTickets > 0 || vipMaxTickets > 0,
            "Must create at least some tickets"
        );
        require(
            generalTicketPrice > 0 || vipTicketPrice > 0,
            "Tickets must have a price"
        );

        address bandOwner = msg.sender;
        uint64 newEventNum = ++bandEventCounts[bandOwner];
        totalEvents++;

        // Create event with optimized storage
        events[totalEvents] = EventDetails(
            bandOwner,
            newEventNum,
            generalMaxTickets,
            vipMaxTickets,
            generalTicketPrice,
            vipTicketPrice,
            0, // generalTicketSold
            0, // vipTicketSold
            eventStartTime,
            ticketSellStartTime
        );

        // Set the faster lookup mapping
        bandEventToId[bandOwner][newEventNum] = totalEvents;
        eventCreators[totalEvents] = msg.sender;

        uint256 totalTickets = generalMaxTickets + vipMaxTickets;
        uint256[] memory tokenIds = new uint256[](totalTickets);
        uint256[] memory amounts = new uint256[](totalTickets);

        // Single loop for minting all tickets
        for (uint256 i = 0; i < totalTickets; i++) {
            bool isVip = i >= generalMaxTickets;
            uint256 tokenId = _generateTokenId(
                TokenType.TICKET,
                bandOwner,
                newEventNum,
                uint64(i + 1)
            );
            tokenIds[i] = tokenId;
            amounts[i] = 1;

            ticketDetails[tokenId] = TicketDetails(
                bandOwner,
                newEventNum,
                uint64(i + 1),
                false, // not used
                isVip
            );
        }

        // Batch mint all tickets at once
        _mintBatch(msg.sender, tokenIds, amounts, "");

        emit EventCreated(
            totalEvents,
            bandOwner,
            newEventNum,
            generalMaxTickets,
            vipMaxTickets,
            generalTicketPrice,
            vipTicketPrice,
            eventStartTime,
            ticketSellStartTime,
            tokenIds
        );
    }

    // Buy Ticket
    function buyTicket(uint256 tokenId) public payable nonReentrant {
        // Validate ticket exists
        TicketDetails storage ticket = ticketDetails[tokenId];
        require(ticket.seatNumber != 0, "Invalid ticket");
        require(!ticket.used, "Ticket already used");

        // Get current balances
        uint256 currentBalance = balanceOf(msg.sender, tokenId);
        require(currentBalance == 0, "You already own this ticket");

        // Get seller - must be the only one with balance
        address seller;
        uint256 sellerBalance = 0;
        address[] memory potentialSellers = new address[](3);
        potentialSellers[0] = ticket.bandOwner;
        potentialSellers[1] = address(this);
        potentialSellers[2] = eventCreators[_getEventIdFromTicket(tokenId)];

        for (uint8 i = 0; i < potentialSellers.length; i++) {
            uint256 balance = balanceOf(potentialSellers[i], tokenId);
            if (balance > 0) {
                seller = potentialSellers[i];
                sellerBalance = balance;
                break;
            }
        }

        require(sellerBalance > 0, "Ticket not available for purchase");
        require(seller != msg.sender, "You already own this ticket");

        // Get event details
        uint256 eventId = _getEventIdFromTicket(tokenId);
        require(
            ticketsBought[msg.sender][eventId] < MAX_TICKETS_PER_USER,
            "Max ticket limit reached"
        );

        // Check eligibility
        require(
            _canUserBuyNow(msg.sender, eventId),
            "You cannot buy ticket at this time"
        );

        // Validate price
        EventDetails storage eventDetails = events[eventId];
        uint256 price = ticket.isVip
            ? eventDetails.vipTicketPrice
            : eventDetails.generalTicketPrice;
        require(msg.value == price, "Incorrect price");

        // Verify approval
        require(
            isApprovedForAll(seller, address(this)),
            "Seller hasn't approved marketplace"
        );

        // Transfer ticket
        _safeTransferFrom(seller, msg.sender, tokenId, 1, "");
        payable(seller).transfer(msg.value);

        // Update stats
        ticketsBought[msg.sender][eventId]++;
        if (ticket.isVip) {
            eventDetails.vipTicketSold++;
        } else {
            eventDetails.generalTicketSold++;
        }

        // Mint loyalty token
        uint256 loyaltyId = _generateTokenId(
            TokenType.LOYALTY,
            ticket.bandOwner,
            0,
            0
        );
        _mint(msg.sender, loyaltyId, LOYALTY_POINTS_PER_PURCHASE, "");
        loyaltyBalances[msg.sender][loyaltyId] += LOYALTY_POINTS_PER_PURCHASE;

        emit TicketSold(tokenId, msg.sender, msg.value);
    }

    // --- Resell Tickets ---
    function resellTicket(
        uint256 tokenId,
        uint256 resalePrice
    ) public nonReentrant {
        // Validate ticket
        TicketDetails storage ticket = ticketDetails[tokenId];
        require(ticket.seatNumber != 0, "Invalid ticket");
        require(!ticket.used, "Ticket already used");
        require(balanceOf(msg.sender, tokenId) > 0, "Not your ticket");

        // Time validation
        uint256 eventId = _getEventIdFromTicket(tokenId);
        EventDetails storage eventDetails = events[eventId];
        uint40 currentTime = uint40(block.timestamp);
        require(
            eventDetails.eventStartTime > currentTime &&
                currentTime > eventDetails.ticketSellStartTime,
            "Not in the resale window"
        );

        // Price cap validation
        uint256 originalPrice = ticket.isVip
            ? eventDetails.vipTicketPrice
            : eventDetails.generalTicketPrice;
        uint256 maxPrice = originalPrice +
            ((originalPrice * MAX_RESALE_PREMIUM_PERCENT) / 100);
        require(resalePrice <= maxPrice, "Exceeds resale cap");

        // Transfer to marketplace
        _safeTransferFrom(msg.sender, address(this), tokenId, 1, "");

        // Create listing
        resellListings[tokenId] = Resell(resalePrice, msg.sender, true);

        emit TicketListed(tokenId, resalePrice, msg.sender);
    }

    function buyResellTicket(uint256 tokenId) public payable nonReentrant {
        // Validate listing
        Resell storage listing = resellListings[tokenId];
        require(listing.isListed, "Not listed for resale");
        require(listing.seller != msg.sender, "Self-buying not allowed");
        require(msg.value == listing.price, "Incorrect price");

        // Ticket validation
        TicketDetails storage ticket = ticketDetails[tokenId];
        require(!ticket.used, "Ticket already used");

        // User limit validation
        uint256 eventId = _getEventIdFromTicket(tokenId);
        require(
            ticketsBought[msg.sender][eventId] < MAX_TICKETS_PER_USER,
            "Maximum ticket buying limit reached"
        );

        // Time validation
        EventDetails storage eventDetails = events[eventId];
        uint40 currentTime = uint40(block.timestamp);
        require(
            eventDetails.eventStartTime > currentTime &&
                currentTime > eventDetails.ticketSellStartTime,
            "Not in the resale window"
        );

        // Process transfer
        _safeTransferFrom(address(this), msg.sender, tokenId, 1, "");

        // Handle payment with fee
        uint256 fee = (msg.value * MARKETPLACE_FEE_PERCENT) / 100;
        payable(listing.seller).transfer(msg.value - fee);
        payable(owner).transfer(fee);

        // Update counters
        ticketsBought[msg.sender][eventId]++;

        // Clear listing
        delete resellListings[tokenId];

        emit TicketSold(tokenId, msg.sender, msg.value);
    }

    // --- Validation ---
    function validateTicket(uint256 tokenId) public nonReentrant {
        TicketDetails storage ticket = ticketDetails[tokenId];
        require(ticket.seatNumber != 0, "Ticket does not exist");
        require(!ticket.used, "Already used");

        uint256 eventId = _getEventIdFromTicket(tokenId);
        require(msg.sender == eventCreators[eventId], "Not authorized");

        // Mark as used
        ticket.used = true;

        emit TicketValidated(tokenId, msg.sender);
    }

    // --- Internal Functions ---
    function _canUserBuyNow(
        address user,
        uint256 eventId
    ) internal view returns (bool) {
        EventDetails storage evt = events[eventId];
        uint40 currentTime = uint40(block.timestamp);

        if (currentTime >= evt.eventStartTime) {
            return false; // Can't buy after event starts
        }
        if (currentTime >= evt.ticketSellStartTime) {
            return true; // Public sale open
        }

        uint256 loyaltyId = _generateTokenId(
            TokenType.LOYALTY,
            evt.bandOwner,
            0,
            0
        );
        uint256 loyaltyBalance = loyaltyBalances[user][loyaltyId];

        if (
            loyaltyBalance >= LOYALTY_POINTS_TIER2 &&
            currentTime >=
            (evt.ticketSellStartTime - TIER2_EARLY_ACCESS_MINUTES * 60)
        ) {
            return true;
        }
        if (
            loyaltyBalance >= LOYALTY_POINTS_TIER1 &&
            currentTime >=
            (evt.ticketSellStartTime - TIER1_EARLY_ACCESS_MINUTES * 60)
        ) {
            return true;
        }
        return false; // Not allowed to buy yet
    }

    function _getEventIdFromTicket(
        uint256 tokenId
    ) internal view returns (uint256) {
        TicketDetails storage t = ticketDetails[tokenId];
        uint256 eventId = bandEventToId[t.bandOwner][t.eventNumber];
        require(eventId != 0, "Event not found");
        return eventId;
    }

    // Token ID Generation with type safety
    function _generateTokenId(
        TokenType tokenType,
        address bandOwner,
        uint64 eventNum,
        uint64 seatNumber
    ) internal pure returns (uint256) {
        if (tokenType == TokenType.LOYALTY) {
            return uint256(keccak256(abi.encodePacked("LOYALTY", bandOwner)));
        } else {
            return
                uint256(
                    keccak256(
                        abi.encodePacked(
                            tokenType,
                            bandOwner,
                            eventNum,
                            seatNumber
                        )
                    )
                );
        }
    }

    // --- Getter Functions ---
    function getLoyaltyBalance(
        address user,
        address bandOwner
    ) public view returns (uint256) {
        uint256 loyaltyId = _generateTokenId(
            TokenType.LOYALTY,
            bandOwner,
            0,
            0
        );
        return loyaltyBalances[user][loyaltyId];
    }

    function getTicketDetails(
        uint256 tokenId
    ) public view returns (TicketDetails memory) {
        return ticketDetails[tokenId];
    }

    // Band metadata management
    function setBandMetadataCID(string calldata cid) external {
        bandMetaDataCID[msg.sender] = cid;
    }

    // --- Required for ERC-1155 receiver compliance ---
    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public pure returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public pure returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}
