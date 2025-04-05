import { ethers } from "ethers";
import { contractAddress, contractABI } from "../../contractDetails";
import { getFromPinata } from "./pinataUtils";

const getEvents = async () => {
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
      const events = await contract.queryFilter("EventCreated");
      console.log("events: ", events);
      for (let i = 0; i < events.length; i++) {
        const dataCID = await contract.bandMetaDataCID(events[i].args[1]);
        const bandData = await getFromPinata(dataCID);

        for (let e in bandData.events) {
          if (e.eventStartTime == events[i].eventStartTime) {
            events[i].CID = e.poster;
          }
        }
      }
      return events;
    } catch (e) {
      console.log("Error interacting with the contract: ", e);
      throw new Error("Contract interaction failed");
    }
  } else {
    console.log("Ethereum object not found");
    throw new Error("MetaMask not detected");
  }
};

export default getEvents;
