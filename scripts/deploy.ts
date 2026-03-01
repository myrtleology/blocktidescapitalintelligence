import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(`Deploying with: ${deployer.address}`);

  const nftFactory = await ethers.getContractFactory("ProofOfStakeNFT");
  const nft = await nftFactory.deploy(deployer.address);
  await nft.waitForDeployment();

  const vaultFactory = await ethers.getContractFactory("BTCIStakingVault");
  const vault = await vaultFactory.deploy(await nft.getAddress(), deployer.address);
  await vault.waitForDeployment();

  const treasuryFactory = await ethers.getContractFactory("TreasuryPool");
  const treasury = await treasuryFactory.deploy(deployer.address);
  await treasury.waitForDeployment();

  const registryFactory = await ethers.getContractFactory("BTCIRegistry");
  const registry = await registryFactory.deploy(deployer.address, deployer.address);
  await registry.waitForDeployment();

  const setVaultTx = await nft.setVault(await vault.getAddress());
  await setVaultTx.wait();

  console.log("\nDeployment complete:");
  console.log(`ProofOfStakeNFT: ${await nft.getAddress()}`);
  console.log(`BTCIStakingVault: ${await vault.getAddress()}`);
  console.log(`TreasuryPool: ${await treasury.getAddress()}`);
  console.log(`BTCIRegistry: ${await registry.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
