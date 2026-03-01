# Block Tides Capital Intelligence (BTCI)

Complete Hardhat + Next.js TypeScript scaffold for BTCI protocol development on Avalanche Fuji.

## Stack

- Hardhat (TypeScript)
- Solidity `0.8.20`
- Ethers.js + `@nomicfoundation/hardhat-toolbox`
- Next.js TypeScript frontend scaffold

## Contracts

- `contracts/ProofOfStakeNFT.sol` (ERC721 proof-of-stake NFT)
- `contracts/BTCIStakingVault.sol` (stake + withdraw AVAX against NFT position)
- `contracts/TreasuryPool.sol` (treasury deposit/owner-withdraw)
- `contracts/BTCIRegistry.sol` (oracle score registry, capped at 1000)

## Project Structure

- `hardhat.config.ts`
- `scripts/deploy.ts`
- `test/stakingVault.ts`
- `pages/index.tsx`
- `pages/_app.tsx`
- `contracts/*.sol`

## Setup

```bash
npm install
cp .env.example .env
```

Fill `.env`:

```env
FUJI_RPC_URL=https://your-quicknode-fuji-endpoint
PRIVATE_KEY=your_wallet_private_key
```

## Compile

```bash
npm run compile
```

## Run Tests

```bash
npm test
```

## Deploy to Avalanche Fuji

```bash
npm run deploy:fuji
```

The deploy script performs:

1. Deploy `ProofOfStakeNFT`
2. Deploy `BTCIStakingVault` with NFT address
3. Deploy `TreasuryPool`
4. Deploy `BTCIRegistry`
5. Set vault in NFT contract
6. Print all deployed addresses

## Start Frontend Scaffold

```bash
npm run dev
```

`pages/index.tsx` is intentionally minimal as a clean integration starting point.
