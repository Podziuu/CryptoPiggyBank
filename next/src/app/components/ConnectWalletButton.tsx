import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// TODO: Add types
const ConnectWalletButton = ({isOpen, setIsOpen, connect, injected } : any ) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        className="bg-black text-white py-2 px-4 rounded-full"
        onClick={() => setIsOpen(true)}
      >
        Connect Wallet
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select wallet you want to connect</DialogTitle>
          <DialogDescription>Blablabla small desc</DialogDescription>
        </DialogHeader>
        <div>
          <Button
            onClick={() => {
              connect({ connector: injected() });
            }}
          >
            MetaMask
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectWalletButton;
