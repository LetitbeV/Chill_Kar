import  { contractAddress, contractABI } from "../../contractDetails";
import {ethers} from "ethers";

const createEvent = async ({ data }) => {
  const { ethereum } = window;

  if (ethereum){
    try {
      const provider = new ethers.provider.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const result = await contract.createEvent(...data);
      
    } catch (e) {
      console.log("Error interacting with the contract: ", e);
      throw new Error("Contract interaction failed");
    }
  } else {
    console.log("Ethereum object not found");
  }
}

export default createEvent;