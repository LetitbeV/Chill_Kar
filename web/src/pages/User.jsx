import React, { useEffect, useState } from "react";
import getEvents from "../contractLogic/getEvents";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../../contractDetails";
import { getImageFromPinata } from "../contractLogic/pinataUtils";
import getDataByAddr from "../contractLogic/getDataByAddr";

const User = () => {
  const [ownedTokens, setOwnedTokens] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokens = async () => {
      const events = await getEvents();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const currentUser = accounts[0];
      setUserAddress(currentUser);

      const tokens = [];

      for (const event of events) {
        const tokenIds = event.args[9];
        const bandOwner = event.args[1];
        const ipfsCid = event.CID;

        let metadata = await getDataByAddr(bandOwner);

        console.log("metadata: ", metadata);
        metadata = metadata.events.find(
          (e) => e.eventId == event.args.eventId.toString()
        );

        const image = await getImageFromPinata(ipfsCid);

        for (const tokenId of tokenIds) {
          const balance = await contract.balanceOf(
            currentUser,
            tokenId.toString()
          );
          if (balance.gt(0)) {
            // Fetch loyalty token balance
            const loyalty = await contract.getLoyaltyBalance(
              currentUser,
              bandOwner
            );

            tokens.push({
              tokenId: tokenId.toString(),
              balance: balance.toString(),
              image,
              bandOwner,
              loyalty: loyalty.toString(),
              metadata,
            });
          }
        }
      }

      setOwnedTokens(tokens);
      setLoading(false);
    };

    fetchTokens();
  }, [userAddress]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">User: {userAddress}</h1>
      {loading ? (
        <p>Loading token holdings...</p>
      ) : ownedTokens.length > 0 ? (
        <div className="space-y-4">
          {ownedTokens.map((token) => (
            <div key={token.tokenId} className="border p-4 rounded shadow-md">
              <p>
                <strong>🎫 Token ID:</strong> {token.tokenId}
              </p>
              <p>
                <strong>🎟️ Ticket Balance:</strong> {token.balance}
              </p>
              <p>
                <strong>🧾 Band Owner:</strong> {token.bandOwner}
              </p>
              <p>
                <strong>💰 Loyalty Balance:</strong> {token.loyalty}
              </p>

              {token.metadata || token.image ? (
                <>
                  <p>
                    <strong>🎤 Event:</strong> {token.metadata.title}
                  </p>
                  <p>
                    <strong>📍 Venue:</strong> {token.metadata.venue}
                  </p>
                  <p>
                    <strong>📝 Description:</strong>{" "}
                    {token.metadata.description}
                  </p>
                  <img
                    src={token.image}
                    alt="Poster"
                    className="w-64 mt-2 rounded"
                  />
                </>
              ) : (
                <p>Metadata unavailable.</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>You don't own any tokens yet.</p>
      )}
    </div>
  );
};

export default User;
