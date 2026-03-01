import { run } from "hardhat";

async function main() {
  const contractAddress = process.env.BTCI_REGISTRY_ADDRESS;
  const admin = process.env.ADMIN_ADDRESS;
  const oracle = process.env.ORACLE_ADDRESS || admin;

  if (!contractAddress || !admin || !oracle) {
    throw new Error("Set BTCI_REGISTRY_ADDRESS, ADMIN_ADDRESS and ORACLE_ADDRESS in .env");
  }

  await run("verify:verify", {
    address: contractAddress,
    constructorArguments: [admin, oracle]
  });

  console.log(`Verified BTCIRegistry at ${contractAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
