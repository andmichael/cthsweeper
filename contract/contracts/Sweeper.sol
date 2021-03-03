//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "hardhat/console.sol";

contract Sweeper {
    mapping(address => uint256) public playersRecord;
    uint256 public betLimit = 10000000000000000;

    constructor(uint256 _betLimit) {
        betLimit = _betLimit;
    }

    receive() external payable {}

    fallback() external payable {}

    event BalanceChanged(address indexed from, uint256 amount);

    modifier onlyEnteredPlayers {
        require(
            playersRecord[msg.sender] > 0,
            "Only entered players can call this function"
        );
        _;
    }

    function enter() external payable {
        if (
            msg.value > 0 &&
            msg.value <= betLimit &&
            playersRecord[msg.sender] == 0
        ) {
            playersRecord[msg.sender] += msg.value;
        } else {
            msg.sender.transfer(msg.value);
        }
        emit BalanceChanged(msg.sender, playersRecord[msg.sender]);
    }

    function play() external onlyEnteredPlayers {
        // Bad security, need better random mechanisms for cheapeth
        if (block.timestamp % 2 == 0) {
            playersRecord[msg.sender] *= 2;
        } else {
            playersRecord[msg.sender] = 0;
        }
        emit BalanceChanged(msg.sender, playersRecord[msg.sender]);
    }

    function withdraw() external onlyEnteredPlayers {
        msg.sender.transfer(playersRecord[msg.sender]);
        playersRecord[msg.sender] = 0;
        emit BalanceChanged(msg.sender, playersRecord[msg.sender]);
    }
}
