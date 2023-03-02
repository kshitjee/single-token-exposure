const { ethers } = require("ethers");
const qs = require("qs");
const fetch = require("node-fetch");

const API_QUOTE_URL = "https://api.0x.org/swap/v1/quote";

const sellAmount = 0.1;

function createQueryString(params) {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
}

const getQuote = async () => {
  // Convert sell amount to wei
  const sellAmountWei = ethers.utils.parseUnits(String(sellAmount), "ether");

  const qs = createQueryString({
    sellToken: "WETH",
    buyToken: "USDC",
    sellAmount: sellAmountWei,
  });
  const quoteUrl = `${API_QUOTE_URL}?${qs}`;
  const response = await fetch(quoteUrl);
  const quote = await response.json();

  console.log(quote);
};

getQuote();
