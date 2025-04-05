const PINATA_API_KEY = import.meta.env.VITE_APP_PINATA_KEY;
const PINATA_SECRET_KEY = import.meta.env.VITE_APP_PINATA_SECRET_KEY;

export const uploadPicture = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("file", imageFile);

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
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};
