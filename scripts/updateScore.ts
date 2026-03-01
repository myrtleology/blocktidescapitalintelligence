import { ethers } from "hardhat";

async function main() {
  const contractAddress = process.env.BTCI_REGISTRY_ADDRESS;
  const subject = process.env.SUBJECT_ADDRESS;
  const scoreInput = process.env.NEW_SCORE || "750";

  if (!contractAddress || !subject) {
    throw new Error("Set BTCI_REGISTRY_ADDRESS and SUBJECT_ADDRESS in .env");
  }

  const score = Number(scoreInput);
  if (!Number.isInteger(score) || score < 0 || score > 1000) {
    throw new Error("NEW_SCORE must be an integer between 0 and 1000");
  }

  const registry = await ethers.getContractAt("BTCIRegistry", contractAddress);

  const tx = await registry.updateScore(subject, score);
  const receipt = await tx.wait();

  const updatedScore = await registry.getScore(subject);

  console.log(`Score update tx hash: ${tx.hash}`);
  console.log(`Score update status: ${receipt?.status === 1 ? "success" : "failed"}`);
  console.log(`Updated score for ${subject}: ${updatedScore}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
