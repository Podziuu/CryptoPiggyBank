// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/**
 * @title PiggyBank
 * @author Bartosz Podemski
 * @notice A simple piggy bank contract that allows you to deposit and withdraw funds
 */
contract PiggyBank {
    /**
     * Errors
     */
    error PiggyBank__UnlockTimeCannotBeLessThanItWas();
    error PiggyBank__AccountIsLocked();
    error PiggyBank__NotEnoughFunds();
    error PiggyBank__TransferFailed();

    /**
     * State variables
     */
    mapping(address => uint256) public deposits;
    mapping(address => uint256) public unlockTime;

    /**
     * Events
     */
    event DepositMade(address accountAddress, uint256 amount);

    /**
     * Public & External Functions
     */

    function deposit(uint256 _unlockTime) public payable {
        deposits[msg.sender] += msg.value;
        if (unlockTime[msg.sender] > _unlockTime) {
            revert PiggyBank__UnlockTimeCannotBeLessThanItWas();
        }
        unlockTime[msg.sender] = _unlockTime;
    }

    function withdraw(uint256 amountToWithdraw) public {
        if (block.timestamp < unlockTime[msg.sender]) {
            revert PiggyBank__AccountIsLocked();
        }
        uint256 amount = deposits[msg.sender];
        if (amountToWithdraw > amount) {
            revert PiggyBank__NotEnoughFunds();
        }
        deposits[msg.sender] = amount - amountToWithdraw;
        if (amount - amountToWithdraw == 0) {
            unlockTime[msg.sender] = 0;
        }
        (bool succes, ) = payable(msg.sender).call{value: amount}("");
        if (!succes) {
            revert PiggyBank__TransferFailed();
        }
    }

    // TODO: Function to extend unlockTime

    // TODO: Function to get balance

    // TODO: Function to get unlockTime
}
