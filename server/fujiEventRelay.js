require("dotenv").config();
const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");
const { ethers } = require("ethers");

const WS_PORT = Number(process.env.EVENT_SERVER_PORT || 8787);
const FUJI_WS_URL = process.env.FUJI_WS_URL;
const BTCI_REGISTRY_ADDRESS = process.env.BTCI_REGISTRY_ADDRESS;
const GOVERNANCE_ADDRESS = process.env.GOVERNANCE_ADDRESS;
const STAKING_ADDRESS = process.env.STAKING_ADDRESS;

if (!FUJI_WS_URL || !BTCI_REGISTRY_ADDRESS || !GOVERNANCE_ADDRESS || !STAKING_ADDRESS) {
  throw new Error("Missing required env vars: FUJI_WS_URL, BTCI_REGISTRY_ADDRESS, GOVERNANCE_ADDRESS, STAKING_ADDRESS");
}

const registryAbi = ["event ScoreUpdated(address indexed subject,uint16 score,address indexed updater,uint256 timestamp)"];
const stakingAbi = [
  "event StakeCreated(address indexed staker,uint256 indexed nftId,uint256 amount,uint256 durationDays)",
  "event ProofMinted(address indexed staker,uint256 indexed nftId,string metadataURI)"
];
const governanceAbi = [
  "event VoteCast(address indexed voter,uint256 indexed proposalId,bool support,uint256 weight)",
  "event TreasuryAllocated(address indexed target,uint256 amount,uint256 indexed proposalId)"
];

const state = {
  stakes: [],
  proofs: [],
  votes: [],
  treasuryAllocations: [],
  scoreUpdates: []
};

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.get("/health", (_req, res) => res.json({ ok: true, clients: wss.clients.size }));
app.get("/state", (_req, res) => res.json(state));

function broadcast(type, payload) {
  const message = JSON.stringify({ type, payload, state });
  for (const client of wss.clients) {
    if (client.readyState === 1) {
      client.send(message);
    }
  }
}

const provider = new ethers.WebSocketProvider(FUJI_WS_URL);
const registry = new ethers.Contract(BTCI_REGISTRY_ADDRESS, registryAbi, provider);
const staking = new ethers.Contract(STAKING_ADDRESS, stakingAbi, provider);
const governance = new ethers.Contract(GOVERNANCE_ADDRESS, governanceAbi, provider);

staking.on("StakeCreated", (staker, nftId, amount, durationDays, event) => {
  const payload = {
    staker,
    nftId: nftId.toString(),
    amount: amount.toString(),
    durationDays: durationDays.toString(),
    txHash: event.log.transactionHash
  };
  state.stakes.unshift(payload);
  broadcast("StakeCreated", payload);
});

staking.on("ProofMinted", (staker, nftId, metadataURI, event) => {
  const payload = {
    staker,
    nftId: nftId.toString(),
    metadataURI,
    txHash: event.log.transactionHash
  };
  state.proofs.unshift(payload);
  broadcast("ProofMinted", payload);
});

governance.on("VoteCast", (voter, proposalId, support, weight, event) => {
  const payload = {
    voter,
    proposalId: proposalId.toString(),
    support,
    weight: weight.toString(),
    txHash: event.log.transactionHash
  };
  state.votes.unshift(payload);
  broadcast("VoteCast", payload);
});

governance.on("TreasuryAllocated", (target, amount, proposalId, event) => {
  const payload = {
    target,
    amount: amount.toString(),
    proposalId: proposalId.toString(),
    txHash: event.log.transactionHash
  };
  state.treasuryAllocations.unshift(payload);
  broadcast("TreasuryAllocated", payload);
});

registry.on("ScoreUpdated", (subject, score, updater, timestamp, event) => {
  const payload = {
    subject,
    score: Number(score),
    updater,
    timestamp: Number(timestamp),
    txHash: event.log.transactionHash
  };
  state.scoreUpdates.unshift(payload);
  broadcast("ScoreUpdated", payload);
});

wss.on("connection", (socket) => {
  socket.send(JSON.stringify({ type: "bootstrap", payload: state }));
});

server.listen(WS_PORT, () => {
  console.log(`Fuji event relay listening on http://localhost:${WS_PORT}`);
});
