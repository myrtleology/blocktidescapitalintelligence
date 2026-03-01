**Block Tides Capital Intelligence (BTCI)** — Open-core capital coherence protocol. Public smart contracts anchor ecosystem risk scores while proprietary Krystalah engine computes deterministic capital intelligence.

# Block Tides Capital Intelligence (BTCI)

**BTCI** is an open-core capital coherence protocol.

Public smart contracts anchor ecosystem-level risk scores on-chain, while the proprietary Krystalah engine computes deterministic capital intelligence off-chain.

---

## Core Components

- On-chain score registry
- Role-based oracle governance
- Versioned score anchoring
- Composable risk primitive

---

## Architecture Model

BTCI follows an open-core architecture:

- Smart contracts are public and verifiable.
- The Krystalah scoring engine operates off-chain.
- Scores are signed and anchored on-chain via authorized oracle governance.

---

## Scoring Framework

Score Range: 0–1000

Tier Bands:
- Tier 1 — Structural Integrity (800–1000)
- Tier 2 — Stable but Volatile (600–799)
- Tier 3 — Risk Emerging (400–599)
- Tier 4 — Structural Instability (<400)

---

## Governance Model (v0.1)

- ORACLE_ROLE controlled by 2-of-3 multisig
- Block Tides operators + independent advisor
- Version-controlled score updates
- Upgrade path defined

---

## Minimal Fuji Deployment Setup (Hardhat + TypeScript)

### Project Structure

- `hardhat.config.ts`
- `contracts/BTCIRegistry.sol`
- `scripts/deploy.ts`
- `scripts/updateScore.ts`
- `scripts/simulateStableFlow.ts`
- `.env.example`

### Install

```bash
npm install
cp .env.example .env
```

### Configure `.env`

- `FUJI_RPC_URL` → QuickNode Avalanche Fuji endpoint
- `DEPLOYER_PRIVATE_KEY` → MetaMask private key
- `ORACLE_ADDRESS` optional (defaults to deployer)

### Deployment + Validation Steps

1. Fund the MetaMask wallet using the QuickNode faucet.
2. Deploy the registry:

```bash
npm run deploy:fuji
```

3. If additional gas is needed, use the Chainlink faucet for AVAX.
4. Use Circle faucet for Fuji USDC.
5. Set `BTCI_REGISTRY_ADDRESS` and `SUBJECT_ADDRESS` in `.env`.
6. Update/query score:

```bash
npm run update-score:fuji
```

7. Simulate stablecoin flow + score bump (capped at 1000):

```bash
npm run simulate-flow:fuji
```

### Optional: Snowtrace Verification

```bash
npm run verify:fuji
```

### Example Output

```text
BTCIRegistry deployed to: 0x1234...abcd
Deployment tx hash: 0x9fa9...3c2

Score update tx hash: 0x12ab...77ef
Updated score for 0xabc...def: 750

Stable flow transfer tx hash: 0x85aa...9901
Oracle score update tx hash: 0x66bc...82ff
Final capped score for 0xabc...def: 1000
```

---

## Roadmap

Phase 1 — Avalanche ecosystem anchoring
Phase 2 — Subnet-level scoring
Phase 3 — Cross-chain coherence layer

---

## License

Apache 2.0

---

## UI Components (React + Tailwind Glassmorphism)

- `src/components/BTCIDashboardOverview.tsx`
- `src/components/StakeCapitalModal.tsx`
- `src/styles/glassmorphism.css`

Both components use hardcoded sample data, semantic sectioning, and reusable glassmorphism utility classes.
