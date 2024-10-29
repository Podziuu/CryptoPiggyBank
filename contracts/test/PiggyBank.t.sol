// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

import {Test, console} from 'forge-std/Test.sol';
import {PiggyBank} from '../src/PiggyBank.sol';
import {DeployPiggyBank} from '../script/DeployPiggyBank.s.sol';

contract PiggyBankTest is Test {
    PiggyBank public piggyBank;

    uint256 public AMOUNT_TO_DEPOSIT = 10 * 1e18;
    uint256 public UNLOCK_TIME = block.timestamp + 1000;
    uint256 public AMOUNT_TO_WITHDRAW = 5 * 1e18;
    address user = makeAddr("USER");

    function setUp() public {
        DeployPiggyBank deployer = new DeployPiggyBank();
        piggyBank = deployer.deployPiggyBank();
        vm.deal(user, 1000 * 1e18);
    }

    function testDeposit() public {
        piggyBank.deposit{value: AMOUNT_TO_DEPOSIT}(UNLOCK_TIME);
        assertEq(piggyBank.deposits(address(this)), AMOUNT_TO_DEPOSIT);
        assertEq(piggyBank.unlockTime(address(this)), UNLOCK_TIME);
    }

    function testWithdrawBeforeTime() public {
        piggyBank.deposit{value: AMOUNT_TO_DEPOSIT}(UNLOCK_TIME);
        vm.expectRevert(PiggyBank.PiggyBank__AccountIsLocked.selector);
        piggyBank.withdraw(AMOUNT_TO_WITHDRAW);
    }

    function testWithdraw() public {
        vm.prank(user);
        piggyBank.deposit{value: AMOUNT_TO_DEPOSIT}(UNLOCK_TIME);
        vm.warp(block.timestamp + 1000);
        vm.prank(user);
        piggyBank.withdraw(AMOUNT_TO_WITHDRAW);
        assertEq(piggyBank.deposits(user), AMOUNT_TO_DEPOSIT - AMOUNT_TO_WITHDRAW);
        assertEq(piggyBank.unlockTime(user), UNLOCK_TIME);
    }

    function testWithdrawMoreThanDeposit() public {
        piggyBank.deposit{value: AMOUNT_TO_DEPOSIT}(UNLOCK_TIME);
        vm.warp(block.timestamp + 1000);
        vm.expectRevert(PiggyBank.PiggyBank__NotEnoughFunds.selector);
        piggyBank.withdraw(AMOUNT_TO_DEPOSIT + 1);
    }

    function testGetBalance() public {
        piggyBank.deposit{value: AMOUNT_TO_DEPOSIT}(UNLOCK_TIME);
        assertEq(piggyBank.getBalance(), AMOUNT_TO_DEPOSIT);
    }

    function testGetUnlockTime() public {
        piggyBank.deposit{value: AMOUNT_TO_DEPOSIT}(UNLOCK_TIME);
        assertEq(piggyBank.getUnlockTime(), UNLOCK_TIME);
    }

    function testExtendUnlockTime() public {
        piggyBank.deposit{value: AMOUNT_TO_DEPOSIT}(UNLOCK_TIME);
        uint256 newUnlockTime = UNLOCK_TIME + 1000;
        piggyBank.extendUnlockTime(newUnlockTime);
        assertEq(piggyBank.unlockTime(address(this)), newUnlockTime);
    }

    function testWithdrawAll() public {
        vm.prank(user);
        piggyBank.deposit{value: AMOUNT_TO_DEPOSIT}(UNLOCK_TIME);
        vm.warp(block.timestamp + 1000);
        vm.prank(user);
        piggyBank.withdraw(AMOUNT_TO_DEPOSIT);
        assertEq(piggyBank.deposits(address(this)), 0);
        assertEq(piggyBank.unlockTime(address(this)), 0);
    }

    function testTransferFailed() public {
        piggyBank.deposit{value: AMOUNT_TO_DEPOSIT}(UNLOCK_TIME);
        vm.warp(block.timestamp + 1000);

        vm.expectRevert(PiggyBank.PiggyBank__TransferFailed.selector);
        piggyBank.withdraw(AMOUNT_TO_DEPOSIT);
    }

    function testExtendUnlockTimeCannotBeLessThanItWas() public {
        piggyBank.deposit{value: AMOUNT_TO_DEPOSIT}(UNLOCK_TIME);
        vm.expectRevert(PiggyBank.PiggyBank__UnlockTimeCannotBeLessThanItWas.selector);
        piggyBank.extendUnlockTime(UNLOCK_TIME - 1);
    }
}