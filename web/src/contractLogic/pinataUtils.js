import { contractAddress, contractABI } from "../../contractDetails";
import { ethers } from "ethers";

const PINATA_API_KEY = import.meta.env.VITE_APP_PINATA_KEY;
const PINATA_SECRET_KEY = import.meta.env.VITE_APP_PINATA_SECRET_KEY;

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        body: formData,
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Upload failed");
    }
    return result.IpfsHash;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const uploadJsonToIPFS = async (jsonData) => {
  try {
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        body: JSON.stringify(jsonData),
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Upload failed");
    }
    return result.IpfsHash;
  } catch (error) {
    console.error("Error uploading JSON:", error);
    throw error;
  }
};

export const getFromPinata = async (ipfsHash) => {
  try {
    const response = await fetch(
      `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      { method: "GET" }
    );
    return response.json();
  } catch (error) {
    console.error("Error fetching from Pinata:", error);
    throw error;
  }
};

export const saveMetaData = async (Metadata, creatorAddr) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    let prevMetaData = await contract.bandMetaDataCID(creatorAddr);
    let data;
    if (!prevMetaData) {
      data = {
        creatorAddr: creatorAddr,
        events: [Metadata],
      };
    } else {
      data = await getFromPinata(prevMetaData);
      console.log("prev data: ", data);
      data.events.push(Metadata);
    }
    console.log("data: ", data);

    const ipfsHash = await uploadJsonToIPFS(data);
    if (prevMetaData) {
      await deleteData(prevMetaData);
    }

    return ipfsHash;
  } catch (error) {
    console.log("Error saving the meta data: ", error);
  }
};

const deleteData = async (ipfsHash) => {
  try {
    const response = await fetch(
      `https://api.pinata.cloud/pinning/unpin/${ipfsHash}`,
      {
        method: "DELETE",
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(`Failed to delete: ${errorMsg}`);
    }

    console.log("deleted the data successfully");
    return true;
  } catch (e) {
    console.log("Error deleting data: ", e);
    return false;
  }
};
