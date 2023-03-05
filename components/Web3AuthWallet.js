import React from "react";
import styles from "./Rectangle.module.css";
import { useState } from "react";
import { useEffect } from "react";
import { Web3Auth } from "@web3auth/modal";
import { ethers } from "ethers";

export default function Web3AuthWallet(props) {
  const initializeWeb3Auth = async () => {
    console.log("initializeWeb3Auth clicked");
    const web3auth = new Web3Auth({
      clientId:
        "BNgfsjaVQwtkNrWN2R72dpJLRX_00-YnUXZo4HlnucU42Yx5BFl7gKRK42YWMmOnwP3L3feOxXSBxCjddLYFuWU", // get it from Web3Auth Dashboard
      web3AuthNetwork: "cyan",
      chainConfig: {
        chainNamespace: "eip155",
        chainId: "0x5",
        rpcTarget:
          "https://goerli.infura.io/v3/f0b04b881cb747b8b58ddaa2e4141886",
        displayName: "Goerli Testnet",
        blockExplorer: "https://goerli.etherscan.io",
        ticker: "ETH",
        tickerName: "Ethereum",
      },
    });
    await web3auth.initModal();
    const web3authProvider = await web3auth.connect();

    const provider = new ethers.providers.Web3Provider(web3authProvider); // web3auth.provider

    const user = await web3auth.getUserInfo(); // web3auth instance

    const signer = provider.getSigner();

    // Get user's Ethereum public address
    const address = await signer.getAddress();

    console.log("user address: ", address);
  };

  const callContract = async () => {
    const web3auth = new Web3Auth({
      clientId:
        "BNgfsjaVQwtkNrWN2R72dpJLRX_00-YnUXZo4HlnucU42Yx5BFl7gKRK42YWMmOnwP3L3feOxXSBxCjddLYFuWU", // get it from Web3Auth Dashboard
      web3AuthNetwork: "cyan",
      chainConfig: {
        chainNamespace: "eip155",
        chainId: "0x5",
        rpcTarget:
          "https://goerli.infura.io/v3/f0b04b881cb747b8b58ddaa2e4141886",
        displayName: "Goerli Testnet",
        blockExplorer: "https://goerli.etherscan.io",
        ticker: "ETH",
        tickerName: "Ethereum",
      },
    });
    await web3auth.initModal();
    const web3authProvider = await web3auth.connect();

    const provider = new ethers.providers.Web3Provider(web3authProvider); // web3auth.provider

    const user = await web3auth.getUserInfo(); // web3auth instance

    console.log("user: ", user);

    const signer = provider.getSigner();

    const contractABI = "[{__place_contract_abi_here__}]";
    const contractAddress = "__place_contract_address_here__";
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Send transaction to smart contract calling its function
    const tx = await contract.functionNameHere(
      "__place_function_arguments_here__"
    );

    // Wait for transaction to finish
    const receipt = await tx.wait();

    console.log("tx receipt: ", receipt);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-screen h-screen overflow-hidden">
      <div>
        <button
          onClick={initializeWeb3Auth}
          style={{
            backgroundColor: "#1a73e8",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Connect Wallet
        </button>
      </div>
      <div
        style={{
          marginTop: "20px",
        }}
      >
        <button
          onClick={callContract}
          style={{
            backgroundColor: "#1a73e8",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Call Contract
        </button>
      </div>
    </div>
  );
}
