import React from "react";
import styles from "./Card.module.css";

export default function Card(props) {
  const { title, address, tradingVolume24h, APY, impermanentLoss } = props;

  return (
    <div className={styles.card}>
      <div className={styles.card__header}>
        <h2 className={styles.card__title}>{title}</h2>
        <button className={styles.card__button}>View Details</button>
      </div>
      <div className={styles.card__body}>
        <div className={styles.card__row}>
          <span className={styles.card__label}>Address:</span>
          <span className={styles.card__value}>{address}</span>
        </div>
        <div className={styles.card__row}>
          <span className={styles.card__label}>{tradingVolume24h}:</span>
          <span className={styles.card__value}>{tradingVolume24h}</span>
        </div>
        <div className={styles.card__row}>
          <span className={styles.card__label}>APY:</span>
          <span className={styles.card__value}>{APY}</span>
        </div>
        <div className={styles.card__row}>
          <span className={styles.card__label}>{impermanentLoss}:</span>
          <span className={styles.card__value}>{impermanentLoss}</span>
        </div>
      </div>
    </div>
  );
}
