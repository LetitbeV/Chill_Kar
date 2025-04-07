import { ethers } from "ethers";
import { contractABI, contractAddress } from "../../contractDetails";

export async function buyTicket(tokenId, price) {
  try {
    // 1. Check if Ethereum provider is available
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    // 2. Connect to provider and signer
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // 3. Create contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // 5. Call the buyTicket function
    const tokenIdBN = ethers.BigNumber.from(tokenId.toString());
    console.log("token, price: ", tokenIdBN, "  ", price);
    const tx = await contract.buyTicket(tokenIdBN, {
      value: price, // send price in wei
    });

    console.log("Transaction submitted. Waiting for confirmation...");

    const receipt = await tx.wait();
    console.log("Ticket purchased!", receipt);

    return receipt;
  } catch (error) {
    console.error("Error buying ticket:", error);
    throw error;
  }
}
