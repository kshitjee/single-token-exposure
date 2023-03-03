const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
import { abi } from "../../abi";
const qs = require("qs");
const fetch = require("node-fetch");

export default async function handler(req, res) {
  await deployments.fixture(["all"]);
  const monoLiquidity = await ethers.getContractAt(
    abi,
    "0xd977422c9eE9B646f64A4C4389a6C98ad356d8C4"
  );
  const API_QUOTE_URL = "https://api.0x.org/swap/v1/quote";
  const sellAmount = req.body.sellAmount;

  function createQueryString(params) {
    return Object.entries(params)
      .map(([k, v]) => `${k}=${v}`)
      .join("&");
  }

  const qs = createQueryString({
    sellToken: req.body.sellToken,
    buyToken: req.body.buyToken,
    sellAmount: req.body.sellAmount,
  });
  const quoteUrl = `${API_QUOTE_URL}?${qs}`;
  const response = await fetch(quoteUrl);
  const quote = await response.json();

  console.log(quote);
}

// const { ethers } = require("ethers");
// const qs = require("qs");
// const fetch = require("node-fetch");

// const API_QUOTE_URL = "https://api.0x.org/swap/v1/quote";

// const sellAmount = 0.1;

// function createQueryString(params) {
//   return Object.entries(params)
//     .map(([k, v]) => `${k}=${v}`)
//     .join("&");
// }

// const getQuote = async () => {
//   // Convert sell amount to wei
//   const sellAmountWei = ethers.utils.parseUnits(String(sellAmount), "ether");

//   const qs = createQueryString({
//     sellToken: "WETH",
//     buyToken: "USDC",
//     sellAmount: sellAmountWei,
//   });
//   const quoteUrl = `${API_QUOTE_URL}?${qs}`;
//   const response = await fetch(quoteUrl);
//   const quote = await response.json();

//   console.log(quote);
// };

getQuote();
