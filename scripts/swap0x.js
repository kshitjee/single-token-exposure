import { ethers } from "ethers";
// const qs = require("qs");
import qs from "qs";
import axios from "axios";
import fetch from "node-fetch";

// import { dai_abi } from "./abi/dai_abi";
// import { eth_abi } from "./abi/eth_abi";
// const axios = require("axios");
// import { abi } from "../../abi";

const BigNumber = ethers.BigNumber;

const dai_abi = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "subtractedValue", type: "uint256" },
    ],
    name: "decreaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "addedValue", type: "uint256" },
    ],
    name: "increaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// mainnet
// const API_QUOTE_URL = "https://api.0x.org/swap/v1/quote";

// goerli
const API_QUOTE_URL = "https://goerli.api.0x.org/swap/v1/quote";

// goerli
// DAI: 0xB5F97357D1B443432a5CAC14EdddBAab4b5F65BF
// ETH: 0xf772505CA5bA7AeCf394Ea0Fe48ff4BF33bB6B62

const zeroxProxy_goerly = "0xf91bb752490473b8342a3e964e855b9f9a2a668e";

const sellAmount = 1223343434;

const sellAmountWei = BigNumber.from(sellAmount);

function createQueryString(params) {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
}

const swap0x = async () => {
  /* getQuote */
  // Convert sell amount to wei
  //   const sellAmountWei = ethers.utils.parseUnits(String(sellAmount), "ether");

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

  const signer = new ethers.Wallet("__PRIVATE_KEY__", provider);

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

  const params = {
    sellToken: "0xB5F97357D1B443432a5CAC14EdddBAab4b5F65BF",
    buyToken: "0xf772505ca5ba7aecf394ea0fe48ff4bf33bb6b62",
    sellAmount: "100000000000000000000",
    takerAddress: "0x95a548A77f41d64f5F0d6905f8F9CD3aeFe972A9",
  };

  // Fetch the swap quote.
  const response_swap = await fetch(
    `https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`
  );

  // Perform the swap.
  const swapData = await response_swap.json();

  console.log(swapData);
  const tx = {
    to: swapData.to,
    value: swapData.value,
    data: swapData.data,
  };
  await signer.sendTransaction(tx);

  console.log(tx);
};

swap0x();
