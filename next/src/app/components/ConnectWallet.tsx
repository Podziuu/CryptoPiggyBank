"use client";

import React, { useState, useEffect } from "react";
import { useConnect, useSignMessage } from "wagmi";
import { injected } from "wagmi/connectors";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { SiweMessage } from "siwe";
import { useChainId } from 'wagmi'
import { getCsrfToken, signIn, useSession } from "next-auth/react";

const ConnectWallet = () => {
  const { connect, status } = useConnect();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast()
  const { signMessageAsync } = useSignMessage();
  const {address} = useAccount();
  const chainId = useChainId()
  const session = useSession();

  console.log(session);

  const handleSignIn = async () => {
    try {
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum to the app",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce: await getCsrfToken(),
      })
      const signature = await signMessageAsync({message: message.prepareMessage()});
      console.log(signature);
      signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
      })
    } catch (err) {
      console.error(err);
      window.alert(err)
    }
  }

  useEffect(() => {
    if (status === "success") {
      setIsOpen(false);
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected",
      })
      handleSignIn();
    } else if (status === "error") {
      setIsOpen(false);
      toast({
        title: "Error",
        description: "An error occured while connecting wallet",
        variant: "destructive",
      })
    }
  }, [status]);

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

export default ConnectWallet;
