import { ethers } from "ethers";
import { contractAddress, contractABI } from "../../contractDetails";

const getEventsByEventId = async (eventId) => {
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

      const filter = contract.filters.EventCreated(eventId);
      const event = await contract.queryFilter(filter);
      console.log(event);
      return event;
    }catch (error){
      console.log("error:" , error);
    }
  }
}

export default getEventsByEventId;
