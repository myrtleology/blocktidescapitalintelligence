import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const oracleAddress = process.env.ORACLE_ADDRESS || deployer.address;

  console.log(`Deploying with: ${deployer.address}`);
  console.log(`Oracle role will be assigned to: ${oracleAddress}`);

  const factory = await ethers.getContractFactory("BTCIRegistry");
  const contract = await factory.deploy(deployer.address, oracleAddress);
  await contract.waitForDeployment();

  const deploymentAddress = await contract.getAddress();
  const deploymentTx = contract.deploymentTransaction();

  console.log(`BTCIRegistry deployed to: ${deploymentAddress}`);
  console.log(`Deployment tx hash: ${deploymentTx?.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
