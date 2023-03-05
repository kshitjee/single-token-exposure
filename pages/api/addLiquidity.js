const { ethers } = require("ethers");
const qs = require("qs");
const axios = require("axios");
import { abi } from "../../abi";

// mainnet
// const API_QUOTE_URL = "https://api.0x.org/swap/v1/quote";

// goerli
const API_QUOTE_URL = "https://goerli.api.0x.org/swap/v1/quote";

const sellAmount = 49914.332110262862325934;

function createQueryString(params) {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
}

const addLiquidity = async () => {
  /* getQuote */
  // Convert sell amount to wei
  const sellAmountWei = ethers.utils.parseUnits(String(sellAmount), "ether");

  const qs = createQueryString({
    sellToken: "0xB5F97357D1B443432a5CAC14EdddBAab4b5F65BF",
    buyToken: "0xf772505ca5ba7aecf394ea0fe48ff4bf33bb6b62",
    sellAmount: sellAmountWei,
  });
  const quoteUrl = `${API_QUOTE_URL}?${qs}`;
  const response = await axios.get(quoteUrl);
  const quote = response.data;

  console.log("quote: ", quote);

  const sellTokenAddress = quote.sellTokenAddress;

  const buyTokenAddress = quote.buyTokenAddress;

  const allowanceTarget = quote.allowanceTarget;

  const swapTarget = quote.to;

  const callData = quote.data;

  /* zeroxswap */
  // Second parameter is chainId, 5 is Goerli testnet
  const provider = new ethers.providers.JsonRpcProvider(
    "https://goerli.infura.io/v3/f0b04b881cb747b8b58ddaa2e4141886",
    5
  );

  const signer = new ethers.Wallet("__private_key__", provider);

  const contract = new ethers.Contract("__contract_address__", abi, signer);

  // Send transaction to smart contract calling its function
  const tx = await contract.zeroxSwap(
    _sellToken,
    _buyToken,
    _spender,
    _swapTarget,
    _callData
  );

  // Wait for transaction to finish
  const receipt = await tx.wait();

  console.log("tx receipt: ", receipt);
};
