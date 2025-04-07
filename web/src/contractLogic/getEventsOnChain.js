import { ethers } from "ethers";
import { contractAddress, contractABI } from "../../contractDetails";

const getEventOnChain = async (eventId) => {
  const { ethereum } = window;

  if (ethereum) {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      console.log("Getting events: ");
      const event = await contract.events(eventId);
      console.log("eventOnChain: ", event);
      return event;
    } catch (error) {
      console.log("Error interacting with the contract: ", error);
      throw new Error("Contract interaction failed");
    }
  } else {
    console.log("Ethereum object not found");
    throw new Error("MetaMask not detected");
  }
};

export default getEventOnChain;
