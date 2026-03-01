import { expect } from "chai";
import { ethers } from "hardhat";

describe("BTCIStakingVault", function () {
  it("allows stake and withdrawal after unlock", async function () {
    const [owner, user] = await ethers.getSigners();

    const nftFactory = await ethers.getContractFactory("ProofOfStakeNFT");
    const nft = await nftFactory.deploy(owner.address);
    await nft.waitForDeployment();

    const vaultFactory = await ethers.getContractFactory("BTCIStakingVault");
    const vault = await vaultFactory.deploy(await nft.getAddress(), owner.address);
    await vault.waitForDeployment();

    await nft.setVault(await vault.getAddress());

    const stakeAmount = ethers.parseEther("1");
    await vault.connect(user).stake(1, { value: stakeAmount });

    expect(await nft.ownerOf(1)).to.equal(user.address);

    await ethers.provider.send("evm_increaseTime", [24 * 60 * 60 + 1]);
    await ethers.provider.send("evm_mine", []);

    await expect(() => vault.connect(user).withdraw(1)).to.changeEtherBalances(
      [user, vault],
      [stakeAmount, -stakeAmount]
    );

    await expect(nft.ownerOf(1)).to.be.reverted;
  });
});
