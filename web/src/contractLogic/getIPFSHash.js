import { contractAddress, contractABI } from "../../contractDetails";
import { ethers } from "ethers";
import { getFromPinata } from "./pinataUtils";

const getDataByAddr = async (addr, movie) => {
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

      const cid = await contract.bandMetaDataCID(addr);
      const bandData = await getFromPinata(cid);

      const matchedEvent = bandData.events.find(
        (event) => event.eventTime === movie.args[7]
      );

      return matchedEvent || null;
    } catch (e) {
      console.log("error: ", e);
    }
  }
};

export default getDataByAddr;
