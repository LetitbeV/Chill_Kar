import React from 'react'
import nft from '../SampleData/NFTData.json'

const NFTCard = ({ data, isVIP, image, price, total, tokenIds }) => {
    const idx = Math.floor(Math.random()*9);
    if(!data) data = nft.nfts[idx];
    
  return (
    <div
      className={`max-w-sm rounded-xl overflow-hidden transition-shadow duration-300
      ${
        isVIP
          ? "bg-gradient-to-br from-amber-100 to-yellow-100 shadow-lg shadow-amber-200 hover:shadow-xl hover:shadow-amber-300"
          : "bg-white shadow-lg hover:shadow-xl"
      }`}
    >
      {/* NFT Image */}
      <div className="relative">
        {isVIP && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
            VIP
          </div>
        )}
        <img
          src={image}
          alt="NFT"
          className={`w-full h-64 object-cover ${
            isVIP ? "border-b-2 border-amber-200" : ""
          }`}
        />
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Price and Remaining */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <svg
              className={`w-4 h-4 mr-1`}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 12L12 22L22 12L12 2Z"
                fill={isVIP ? "#B45309" : "#6B7280"}
              />
            </svg>
            <span
              className={`font-bold ${
                isVIP ? "text-amber-700" : "text-gray-800"
              }`}
            >
              {price} micro ETH
            </span>
          </div>
          <span
            className={`text-sm ${isVIP ? "text-amber-700" : "text-gray-600"}`}
          >
            {total} total tickets
          </span>
        </div>

        {/* NFT Hash/ID */}
        <div
          className={`rounded-md p-2 ${isVIP ? "bg-amber-50" : "bg-gray-100"}`}
        >
          {tokenIds.map((token) => (
            <p
              className={`text-xs font-mono break-all ${
                isVIP ? "text-amber-700" : "text-gray-600"
              }`}
            >
              ID: {token.toString().slice(0, 16)}...
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NFTCard