import styles from "./Modal.module.css";
import Grid from "./Grid";
import { useState } from "react";

export default function Modal({ isOpen, onClose, selectedToken }) {
  const [isGridVisible, setIsGridVisible] = useState(true);
  const [selectedPair, setSelectedPair] = useState(null); // define selectedPair state

  function onPairSelected(
    title,
    address,
    tradingVolume24h,
    APY,
    impermanentLoss
  ) {
    setIsGridVisible(false);
    setSelectedPair({ title, address, tradingVolume24h, APY, impermanentLoss });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const depositAmount = event.target.depositAmount.value;

    const data = {
      depositAmount: depositAmount,
      pair: selectedPair,
      tokenA: selectedToken,
    };

    console.log(data);

    const res = await fetch("/api/return-optimal-swap", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  if (!isOpen) {
    return null;
  }

  const data = [
    {
      id: 1,
      title: "USDC/DAI",
      address: "0x0c670AcA9AA0285B961F1D4AB7D4e462C7982311",
      tradingVolume24h: "trading volume 24h",
      APY: "37%",
      impermanentLoss: "impermanent loss",
    },
    {
      id: 2,
      title: "USDC/LINK",
      address: "0x0c670AcA9AA0285B961F1D4AB7D4e462C7982311",
      tradingVolume24h: "trading volume 24h",
      APY: "37%",
      impermanentLoss: "impermanent loss",
    },
    {
      id: 3,
      title: "USDC/USDT",
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
          ) : (
            <div>
              <h2 className={styles.pairTitle}>{selectedPair.title}</h2>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Address:</span>
                <span className={styles.statValue}>{selectedPair.address}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Trading Volume 24h:</span>
                <span className={styles.statValue}>
                  {selectedPair.tradingVolume24h}
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>APY:</span>
                <span className={styles.statValue}>{selectedPair.APY}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Impermanent Loss:</span>
                <span className={styles.statValue}>
                  {selectedPair.impermanentLoss}
                </span>
              </div>
              <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor="depositAmount" className={styles.formLabel}>
                  Selected Token To Deposit:
                  <input
                    type="number"
                    id="depositAmount"
                    name="depositAmount"
                    min="0"
                    step="any"
                    required
                    className={styles.formInput}
                  />
                </label>
                <button type="submit" className={styles.formSubmit}>
                  Calculate Optimal Swap
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
