import { contractAddress, contractABI } from "../../contractDetails";
import { ethers } from "ethers";
import { saveMetaData } from "./pinataUtils";

const createEvent = async (eventData) => {
  const { ethereum } = window;

  console.log("data: ", eventData);

  if (ethereum) {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      let creatorAddr = await ethereum.request({
        method: "eth_requestAccounts",
      });

      creatorAddr = creatorAddr[0];

      const {
        title,
        poster,
        eventType,
        generalTickets,
        generalPrice,
        vipTickets,
        vipPrice,
        genres,
        eventStartTime,
        sellStartTime,
        venue,
        description,
      } = eventData;

      console.log("event data", eventData);

      const eventTime = Math.floor(new Date(eventStartTime).getTime() / 1000);
      const sellTime = Math.floor(new Date(sellStartTime).getTime() / 1000);

      const metaData = {
        title,
        eventTime,
        poster,
        eventType,
        genres,
        venue,
        description,
      };

      const tx = await contract.createEvent(
        generalTickets,
        vipTickets,
        generalPrice,
        vipPrice,
        eventTime,
        sellTime
      );

      await tx.wait();

      const ipfsHash = await saveMetaData(metaData, creatorAddr);
      await contract.setBandMetadataCID(ipfsHash);
      console.log("Event created successfully:", tx.hash);
    } catch (e) {
      console.log("Error interacting with the contract: ", e);
      throw new Error("Contract interaction failed");
    }
  } else {
    console.log("Ethereum object not found");
    throw new Error("MetaMask not detected");
  }
};

export default createEvent;
