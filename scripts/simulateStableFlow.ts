import { ethers } from "hardhat";

const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address,uint256) returns (bool)"
];

async function main() {
  const registryAddress = process.env.BTCI_REGISTRY_ADDRESS;
  const subject = process.env.SUBJECT_ADDRESS;
  const usdcAddress =
    process.env.USDC_ADDRESS || "0x5425890298aed601595a70AB815c96711a31Bc65";
  const usdcAmountInput = process.env.USDC_FLOW_AMOUNT || "5";

  if (!registryAddress || !subject) {
    throw new Error("Set BTCI_REGISTRY_ADDRESS and SUBJECT_ADDRESS in .env");
  }

  const [signer] = await ethers.getSigners();
  const registry = await ethers.getContractAt("BTCIRegistry", registryAddress);
  const usdc = new ethers.Contract(usdcAddress, ERC20_ABI, signer);

  const [symbol, decimals] = await Promise.all([usdc.symbol(), usdc.decimals()]);
  const amount = ethers.parseUnits(usdcAmountInput, decimals);

  const senderBalance = await usdc.balanceOf(signer.address);
  if (senderBalance < amount) {
    throw new Error(
      `Insufficient ${symbol}. Have ${ethers.formatUnits(senderBalance, decimals)}, need ${usdcAmountInput}`
    );
  }

  const transferTx = await usdc.transfer(subject, amount);
  await transferTx.wait();

  const flowUnits = Number(ethers.formatUnits(amount, decimals));
  const currentScore = Number(await registry.getScore(subject));
  const nextScore = Math.min(1000, currentScore + Math.floor(flowUnits * 10));

  const scoreTx = await registry.updateScore(subject, nextScore);
  await scoreTx.wait();

  const finalScore = await registry.getScore(subject);

  console.log(`Stable flow transfer tx hash: ${transferTx.hash}`);
  console.log(`Oracle score update tx hash: ${scoreTx.hash}`);
  console.log(`Final capped score for ${subject}: ${finalScore}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
