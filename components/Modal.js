import styles from "./Modal.module.css";
import Grid from "./Grid";
import { useState } from "react";
import { useEffect } from "react";

export default function Modal({ isOpen, onClose, selectedToken }) {
  const [isGridVisible, setIsGridVisible] = useState(true);
  const [selectedPair, setSelectedPair] = useState(null); // define selectedPair state
  const [showStats, setShowStats] = useState(false);
  const [swapAmount, setSwapAmount] = useState(null);
  const [showOptimalLiquidity, setshowOptimalLiquidity] = useState(false);

  // Stores Covalent API data
  // ETH (WETH)
  const [ethusdt_lp24Hvol, setEthusdt_Lp24Hvol] =
    useState("trading volume 24h");

  // USDC
  const [usdceth_lp24Hvol, setUsdceth_Lp24Hvol] =
    useState("trading volume 24h");

  // DAI
  const [daieth_lp24Hvol, setDaieth_Lp24Hvol] = useState("trading volume 24h");
  const [daiusdt_lp24Hvol, setDaiusdt_Lp24Hvol] =
    useState("trading volume 24h");
  const [daiusdc_lp24Hvol, setDaiusdc_Lp24Hvol] =
    useState("trading volume 24h");

  // LINK
  const [linketh_lp24Hvol, setLinketh_Lp24Hvol] =
    useState("trading volume 24h");

  useEffect(() => {
    console.log(swapAmount);
  }, [swapAmount]);

  useEffect(() => {
    getLpSomePools();
  }, []);

  const eth_mainnet = "eth-mainnet"; // Ethereum Mainnet, Goerli is not supported yet for LP data
  // DEX code to pass into Covalent API
  const uniswap = "uniswap_v2"; // Uniswap V2, Uniswap V3 is not supported yet
  // list of Uniswap V2 pools:
  // https://v2.info.uniswap.org/pairs
  // https://www.geckoterminal.com/eth/uniswap_v2/pools

  // get LP data with Covalent API
  const getLpData = async (pool_addr) => {
    const result = await fetch(
      `https://api.covalenthq.com/v1/${eth_mainnet}/xy=k/${uniswap}/pools/address/${pool_addr}/?key=${"ckey_f10a43e61ede47bebf33d6dfe18"}`
    );

    try {
      const response = await result.json();

      const lp24Hvol_data = await response.data.items[0].fee_24h_quote;

      console.log(response.data.items[0].fee_24h_quote);

      return response;
    } catch (error) {
      console.log(error);
    }
  };

  // get LP data from some pools with Covalent API
  // Uniswap V2 Mainnet Pools
  const getLpSomePools = async () => {
    // USDC/ETH
    const response_usdceth = await getLpData(
      "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc"
    );
    const lp24Hvol_data_usdceth = await response_usdceth.data.items[0]
      .fee_24h_quote;
    setUsdceth_Lp24Hvol(lp24Hvol_data_usdceth);
    console.log("state of usdceth_lp24Hvol: ", usdceth_lp24Hvol);

    // ETH/USDT
    const response_ethusdt = await getLpData(
      "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852"
    );
    const lp24Hvol_data_ethusdt = await response_ethusdt.data.items[0]
      .fee_24h_quote;
    setEthusdt_Lp24Hvol(lp24Hvol_data_ethusdt);
    console.log("state of ethusdt_lp24Hvol: ", ethusdt_lp24Hvol);

    // DAI/USDT
    const response_daiusdt = await getLpData(
      "0xb20bd5d04be54f870d5c0d3ca85d82b34b836405"
    );
    const lp24Hvol_data_daiusdt = await response_daiusdt.data.items[0]
      .fee_24h_quote;
    setDaiusdt_Lp24Hvol(lp24Hvol_data_daiusdt);
    console.log("state of daiusdt_lp24Hvol: ", daiusdt_lp24Hvol);

    // DAI/USDC
    const response_daiusdc = await getLpData(
      0xae461ca67b15dc8dc81ce7615e0320da1a9ab8d5
    );
    // const lp24Hvol_data_daiusdc = await response_daiusdc.data.items[0]; // this is giving error, then hard code the value
    // setDaiusdc_Lp24Hvol(lp24Hvol_data_daiusdc);

    // DAI/ETH
    const response_daieth = await getLpData(
      "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11"
    );
    const lp24Hvol_data_daieth = await response_daieth.data.items[0]
      .fee_24h_quote;
    setDaieth_Lp24Hvol(lp24Hvol_data_daieth);
    console.log("state of daieth_lp24Hvol: ", daieth_lp24Hvol);

    // LINK/ETH
    const response_linketh = await getLpData(
      "0xa2107fa5b38d9bbd2c461d6edf11b11a50f6b974"
    );
    const lp24Hvol_data_linketh = await response_linketh.data.items[0]
      .fee_24h_quote;
    setLinketh_Lp24Hvol(lp24Hvol_data_linketh);
    console.log("state of linketh_lp24Hvol: ", linketh_lp24Hvol);
  };

  // getLpSomePools();

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

  async function handleCustomizeLiquidityParams(event) {
    event.preventDefault();
    setshowOptimalLiquidity(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const depositAmount = event.target.depositAmount.value;
    const data = {
      depositAmount: depositAmount,
      pair: selectedPair,
      tokenA: selectedToken,
    };
    setShowStats(true);
    console.log(data);

    const res = await fetch("/api/return-optimal-swap", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    console.log(resData);
    setSwapAmount(resData.amountWithDecimals);
    // set state variables
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
          {showOptimalLiquidity ? (
            <div>Sample</div>
          ) : showStats ? (
            <div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>
                  Amount to Swap for{" "}
                  {selectedPair.title.substring(
                    selectedPair.title.indexOf("/") + 1
                  )}
                  : {swapAmount}{" "}
                  {selectedPair.title.substring(
                    0,
                    selectedPair.title.indexOf("/")
                  )}{" "}
                </span>
              </div>
              <button
                type="type"
                className={styles.formSubmit}
                onClick={(e) => handleCustomizeLiquidityParams(e)}
              >
                Customize Liquidity Parameters
              </button>
            </div>
          ) : (
            <>
              {isGridVisible ? (
                <Grid data={data} onPairSelected={onPairSelected} />
              ) : (
                <div>
                  <h2 className={styles.pairTitle}>{selectedPair.title}</h2>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Address:</span>
                    <span className={styles.statValue}>
                      {selectedPair.address}
                    </span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>
                      Trading Volume 24h:
                    </span>
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
                  <form
                    className={styles.form}
                    onSubmit={(e) => handleSubmit(e)}
                  >
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

//  async function handleSubmit(event) {
//   event.preventDefault();
//   const depositAmount = event.target.depositAmount.value;

//   const data = {
//     depositAmount: depositAmount,
//     pair: selectedPair,
//     tokenA: selectedToken,
//   };

//   console.log(data);

//   const res = await fetch("/api/return-optimal-swap", {
//     method: "POST",
//     headers: {
//       Accept: "application/json, text/plain, */*",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
// }
