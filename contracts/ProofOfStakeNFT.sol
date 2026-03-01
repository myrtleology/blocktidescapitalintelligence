// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract ProofOfStakeNFT is ERC721, Ownable {
    uint256 public nextTokenId;
    address public vault;

    constructor(address initialOwner) ERC721("BTCI Proof of Stake", "BTCIPOS") Ownable(initialOwner) {}

    function setVault(address _vault) external onlyOwner {
        vault = _vault;
    }

    function mintTo(address to) external returns (uint256 tokenId) {
        require(msg.sender == vault, "Only vault");
        tokenId = ++nextTokenId;
        _mint(to, tokenId);
    }

    function burn(uint256 tokenId) external {
        require(msg.sender == vault, "Only vault");
        _burn(tokenId);
    }
}
