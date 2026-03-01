// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract BTCIRegistry is AccessControl {
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    uint16 public constant MAX_SCORE = 1000;

    mapping(address => uint16) private scores;

    event ScoreUpdated(address indexed subject, uint16 score, address indexed updater, uint256 timestamp);

    constructor(address admin, address oracle) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ORACLE_ROLE, oracle);
    }

    function updateScore(address subject, uint16 score) external onlyRole(ORACLE_ROLE) {
        require(score <= MAX_SCORE, "Score exceeds cap");
        scores[subject] = score;
        emit ScoreUpdated(subject, score, msg.sender, block.timestamp);
    }

    function getScore(address subject) external view returns (uint16) {
        return scores[subject];
    }
}
