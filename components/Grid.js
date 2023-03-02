import React from "react";
import Card from "./Card";
import styles from "./Grid.module.css";

const Grid = ({ data }) => {
  return (
    <div className={styles.grid}>
      {data.map(
        ({ id, title, address, tradingVolume24h, APY, impermanentLoss }) => (
          <Card
            key={id}
            title={title}
            address={address}
            tradingVolume24h={tradingVolume24h}
            APY={APY}
            impermanentLoss={impermanentLoss}
          />
        )
      )}
    </div>
  );
};

export default Grid;
