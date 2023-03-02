import styles from "./Modal.module.css";
import Grid from "./Grid";
import { useState } from "react";

export default function Modal({ isOpen, onClose }) {
  const [isGridVisible, setIsGridVisible] = useState(true);

  function onPairSelected(title, address, tradingVolume24h, APY, impermanentLoss) {
    setIsGridVisible(false);
  }

  if (!isOpen) {
    return null;
  }

  const data = [
    {
      id: 1,
      title: "ETH/DAI",
      address: "0x0c670AcA9AA0285B961F1D4AB7D4e462C7982311",
      tradingVolume24h: "trading volume 24h",
      APY: "37%",
      impermanentLoss: "impermanent loss",
    },
    {
      id: 2,
      title: "ETH/USDC",
      address: "0x0c670AcA9AA0285B961F1D4AB7D4e462C7982311",
      tradingVolume24h: "trading volume 24h",
      APY: "37%",
      impermanentLoss: "impermanent loss",
    },
    {
      id: 3,
      title: "ETH/LINK",
      address: "0x0c670AcA9AA0285B961F1D4AB7D4e462C7982311",
      tradingVolume24h: "trading volume 24h",
      APY: "37%",
      impermanentLoss: "impermanent loss",
    },
  ];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <div className={styles.content}>
          {isGridVisible ? (
            <Grid data={data} onPairSelected={onPairSelected} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
