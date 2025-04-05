import { contractAddress, contractABI } from "../../contractDetails";
import { ethers } from "ethers";

const createEvent = async (eventData) => {
  const { ethereum } = window;

  if (!ethereum) {
    console.log("Ethereum object not found");
    throw new Error("MetaMask not detected");
  }

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

      const {
        generalTickets,
        vipTickets,
        generalPrice,
        vipPrice,
        eventStartTime,
        sellStartTime,
      } = eventData;

      console.log("event data", eventData);

      const eventTime = Math.floor(new Date(eventStartTime).getTime() / 1000);
      const sellTime = Math.floor(new Date(sellStartTime).getTime() / 1000);

      const tx = await contract.createEvent(
        generalTickets,
        vipTickets,
        generalPrice,
        vipPrice,
        eventTime,
        sellTime
      );

      await tx.wait();
      console.log("Event created successfully:", tx.hash);
    } catch (e) {
      console.log("Error interacting with the contract: ", e);
      throw new Error("Contract interaction failed");
    }
  } else {
    console.log("Ethereum object not found");
  }
};

export default createEvent;
