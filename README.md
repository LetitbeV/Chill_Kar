# Blockchain-Integrated Ticketing System

## Overview

This project is a blockchain-powered ticketing platform designed for both web and mobile applications. It ensures secure, transparent, and transferable event tickets by utilizing NFT technology. The system eliminates fraud, enhances ticket resale, and provides real-time analytics for event organizers.

## Features

**NFT-Based Ticketing**: Each ticket is minted as an NFT, ensuring authenticity and security.

**Seamless Transfers**: Users can buy, sell, and transfer tickets securely on the blockchain.

**Decentralized Storage**: Ticket metadata and ownership records are stored on IPFS.

**Event Analytics**: Organizers gain valuable insights into ticket sales and attendance.

**Wallet Authentication**: MetaMask integration for secure login and transactions.

## Tech Stack

Frontend: React (Web), Kotlin (Mobile), TailwindCSS (UI Styling)

Backend: Node.js (API & Business Logic), MongoDB (Database)

Blockchain Integration: Solidity (Smart Contracts), Ether.js (Blockchain Interactions), MetaMask (Wallet Integration)

Storage: IPFS (Decentralized File Storage)

## Usage

User Flow: Connect MetaMask → Buy NFT Ticket → Transfer or Resell → Scan QR for Event Entry

Organizer Flow: Generate Event Tickets → Monitor Sales & Transfers → Analyze Event Data

## Project Structure

The repository consists of three main folders:

`app/` – Mobile application (Android) built with Kotlin.

`web/` – Web application built with React & TailwindCSS.

`blockchain/` – Smart contract logic using Solidity, Ether.js, and IPFS.