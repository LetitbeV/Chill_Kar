# `blockchain/` - Smart Contracts

## Overview

This folder contains the Solidity smart contracts and blockchain integration logic. It handles:

Minting NFT-based tickets.

Secure transfer & resale mechanisms.

IPFS storage for ticket metadata.

Event organizer ticket issuance.

## Setup

cd blockchain
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network rinkeby

## Dependencies

Solidity

Hardhat

Ether.js

IPFS