import Rectangle from "../components/Rectangle";
import DropDown from "../components/DropDown";
import Modal from "../components/Modal";
import LandingPage from "../components/LandingPage";
import { useState } from "react";
import Web3AuthWallet from "../components/Web3AuthWallet";

export default function Home() {
  const [selectedToken, setSelectedToken] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTokenChange = (token) => {
    setSelectedToken(token);
    setIsModalOpen(true);
  };

  const tokenPairs = [
    {
      token: "ETH",
    },
    {
      token: "DAI",
    },
    {
      token: "USDC",
    },
    {
      token: "LINK",
    },
  ];

  return (
    <div>
      <Rectangle>
        <DropDown options={tokenPairs} onTokenChange={handleTokenChange} />
      </Rectangle>
      <Web3AuthWallet />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedToken={selectedToken}
      />
    </div>
  );
}
