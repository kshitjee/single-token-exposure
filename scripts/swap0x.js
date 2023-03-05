import { ethers } from "ethers";
// const qs = require("qs");
import qs from "qs";
import axios from "axios";
import fetch from "node-fetch";
const BigNumber = ethers.BigNumber;
import { dai_abi } from "./abi/dai_abi.js";

// mainnet
// const API_QUOTE_URL = "https://api.0x.org/swap/v1/quote";

// goerli
const API_QUOTE_URL = "https://goerli.api.0x.org/swap/v1/quote";

// goerli
// DAI: 0xB5F97357D1B443432a5CAC14EdddBAab4b5F65BF
// ETH: 0xf772505CA5bA7AeCf394Ea0Fe48ff4BF33bB6B62

const zeroxProxy_goerly = "0xf91bb752490473b8342a3e964e855b9f9a2a668e";

const sellAmount = 122334343434;

const sellAmountWei = BigNumber.from(sellAmount);

function createQueryString(params) {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
}

const swap0x = async () => {
  /* getQuote */
  // Convert sell amount to wei

  const qs = createQueryString({
    sellToken: "0xB5F97357D1B443432a5CAC14EdddBAab4b5F65BF",
    buyToken: "0xf772505ca5ba7aecf394ea0fe48ff4bf33bb6b62",
    sellAmount: sellAmountWei,
  });
  const quoteUrl = `${API_QUOTE_URL}?${qs}`;
  const response = await axios.get(quoteUrl);
  const quote = response.data;

  console.log("quote: ", quote);

  /* zeroxswap */
  // Second parameter is chainId, 5 is Goerli testnet
  const provider = new ethers.providers.JsonRpcProvider(
    "https://goerli.infura.io/v3/f0b04b881cb747b8b58ddaa2e4141886",
    5
  );

  const signer = new ethers.Wallet("__private_key__", provider);

  // Set up a DAI allowance on the 0x contract if needed.
  const dai = new ethers.Contract(
    "0xB5F97357D1B443432a5CAC14EdddBAab4b5F65BF",
    dai_abi,
    signer
  );

  const currentAllowance = await dai.allowance(
    "0x95a548A77f41d64f5F0d6905f8F9CD3aeFe972A9",
    zeroxProxy_goerly
  );

  if (currentAllowance.lt(sellAmountWei)) {
    const tx = await dai.approve(zeroxProxy_goerly, sellAmountWei);
    await tx.wait();
  }

  // Fetch the swap quote.
  const response_swap = await fetch(`${quoteUrl}`);

  // Perform the swap.
  const swapData = await response_swap.json();

  const tx = {
    to: swapData.to,
    value: swapData.value,
    data: swapData.data,
  };
  await signer.sendTransaction(tx);

  console.log(tx);
};

swap0x();
