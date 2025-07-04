# HealthChain MVP - Blockchain Healthcare Data Access Control

A decentralized healthcare data management system that gives patients full control over their medical records using blockchain technology and IPFS storage.

## 🎯 MVP Features

- **Patient Dashboard**: Upload health records securely to IPFS
- **Provider Dashboard**: Request access to patient records
- **Blockchain Access Control**: Smart contracts manage permissions
- **Decentralized Storage**: Files stored on IPFS, metadata on blockchain
- **Encryption**: Client-side encryption before IPFS upload

## 🏗️ Architecture

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Smart Contract │    │      IPFS       │
│                 │    │   (Ethereum)    │    │   (Storage)     │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • Patient UI    │◄──►│ • Access Control│    │ • Encrypted     │
│ • Provider UI   │    │ • Metadata      │◄──►│   Files         │
│ • File Upload   │    │ • Permissions   │    │ • File Hashes   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
\`\`\`

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MetaMask browser extension
- Git

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd healthchain-mvp
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up local blockchain**
   \`\`\`bash
   # Terminal 1: Start Hardhat node
   npx hardhat node
   
   # Terminal 2: Deploy contracts
   npm run compile
   npm run deploy
   \`\`\`

4. **Configure MetaMask**
   - Add local network: RPC URL `http://127.0.0.1:8545`, Chain ID `31337`
   - Import test accounts from Hardhat node output

5. **Start the application**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open browser**
   - Navigate to `http://localhost:3000`
   - Connect MetaMask wallet

## 📋 Usage Guide

### For Patients

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Upload Records**: 
   - Go to "Upload Records" tab
   - Select a health record file (PDF, image, etc.)
   - Click "Upload to Blockchain" - file is encrypted and stored on IPFS
3. **Manage Access**:
   - Review access requests in "Access Requests" tab
   - Approve/deny provider requests
   - Monitor active permissions in "Active Permissions" tab

### For Healthcare Providers

1. **Switch to Provider Mode**: Toggle to "Provider" in the header
2. **Request Access**:
   - Enter patient's wallet address
   - Provide detailed reason for access
   - Submit request
3. **View Records**: Once approved, access patient records in "Patient Records" tab

## 🔧 Technical Details

### Smart Contract Functions

```solidity
// Store health record metadata
function storeRecord(string memory _ipfsHash, string memory _fileName)

// Request access to patient records  
function requestAccess(address _patient, string memory _reason)

// Grant access to provider
function grantAccess(address _provider)

// Revoke provider access
function revokeAccess(address _provider)

// Check if provider has access
function checkAccess(address _patient, address _provider) returns (bool)
