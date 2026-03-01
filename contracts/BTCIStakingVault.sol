// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

interface IProofOfStakeNFT {
    function mintTo(address to) external returns (uint256 tokenId);
    function ownerOf(uint256 tokenId) external view returns (address);
    function burn(uint256 tokenId) external;
}

contract BTCIStakingVault is Ownable {
    struct StakePosition {
        uint256 amount;
        uint256 unlockAt;
        bool active;
    }

    IProofOfStakeNFT public immutable proofNFT;
    mapping(uint256 => StakePosition) public positions;

    event StakeCreated(address indexed staker, uint256 indexed tokenId, uint256 amount, uint256 durationDays);
    event StakeWithdrawn(address indexed staker, uint256 indexed tokenId, uint256 amount);

    constructor(address nftAddress, address initialOwner) Ownable(initialOwner) {
        proofNFT = IProofOfStakeNFT(nftAddress);
    }

    function stake(uint256 durationDays) external payable returns (uint256 tokenId) {
        require(msg.value > 0, "Stake > 0");
        require(durationDays > 0, "Duration > 0");

        tokenId = proofNFT.mintTo(msg.sender);
        positions[tokenId] = StakePosition({
            amount: msg.value,
            unlockAt: block.timestamp + (durationDays * 1 days),
            active: true
        });

        emit StakeCreated(msg.sender, tokenId, msg.value, durationDays);
    }

    function withdraw(uint256 tokenId) external {
        StakePosition memory position = positions[tokenId];
        require(position.active, "Inactive stake");
        require(block.timestamp >= position.unlockAt, "Still locked");
        require(proofNFT.ownerOf(tokenId) == msg.sender, "Not NFT owner");

        delete positions[tokenId];
        proofNFT.burn(tokenId);

        (bool success, ) = payable(msg.sender).call{value: position.amount}("");
        require(success, "Transfer failed");

        emit StakeWithdrawn(msg.sender, tokenId, position.amount);
    }
}
