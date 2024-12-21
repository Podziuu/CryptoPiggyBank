import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import ConnectWallet from "./ConnectWallet";

const Navbar = () => {
  return (
    <NavigationMenu className="border px-4 py-4 rounded-full border-black mx-auto mt-2">
      <Link href="/deposit" legacyBehavior passHref>
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          Deposit
        </NavigationMenuLink>
      </Link>
      <Link href="/withdraw" legacyBehavior passHref>
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          Withdraw
        </NavigationMenuLink>
      </Link>
      <Link href="/extend" legacyBehavior passHref>
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          Extend Time
        </NavigationMenuLink>
      </Link>
      <ConnectWallet />
    </NavigationMenu>
  );
};

export default Navbar;
