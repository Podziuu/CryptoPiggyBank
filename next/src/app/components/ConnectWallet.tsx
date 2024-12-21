"use client";

import React, { useState, useEffect } from "react";
import { useConnect, useSignMessage } from "wagmi";
import { injected } from "wagmi/connectors";
import { useAccount } from "wagmi";
import { useToast } from "@/hooks/use-toast";
import { SiweMessage } from "siwe";
import { useChainId } from "wagmi";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import ConnectWalletButton from "./ConnectWalletButton";
import { shortenAddress } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const ConnectWallet = () => {
  const { connect, status } = useConnect();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();
  const chainId = useChainId();
  const session = useSession();

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
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      console.log(signature);
      signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
      });
    } catch (err) {
      console.error(err);
      window.alert(err);
    }
  };

  console.log(status);

  useEffect(() => {
    if (status === "success") {
      setIsOpen(false);
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected",
      });
      handleSignIn();
    } else if (status === "error") {
      setIsOpen(false);
      toast({
        title: "Error",
        description: "An error occured while connecting wallet",
        variant: "destructive",
      });
    }
  }, [status]);

  console.log(shortenAddress(address));

  return (
    <>
      {(session.status === "unauthenticated" || status === "idle") && (
        <ConnectWalletButton
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          connect={connect}
          injected={injected}
        />
      )}
      {session.status === "authenticated" && status === "success" && (
        <Badge className="py-2 px-4 rounded-full">Connected: {shortenAddress(address)}</Badge>
      )}
      {session.status === "loading" && <div>Loading...</div>}
    </>
  );
};

export default ConnectWallet;
