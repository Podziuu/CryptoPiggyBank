// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {PiggyBank} from "../src/PiggyBank.sol";

contract DeployPiggyBank is Script {
    function run() external returns (PiggyBank) {
        return deployPiggyBank();
    }

    function deployPiggyBank() public returns (PiggyBank) {
        vm.startBroadcast();
        PiggyBank piggyBank = new PiggyBank();
        vm.stopBroadcast();
        return piggyBank;
    }
}