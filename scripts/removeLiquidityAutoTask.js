const ABI = [
  "function removeLiquidity(address _remover, address _tokenA, address _tokenB) external",
];
const ADDRESS = "0xbb4a18773c5f036ad821059dd3574320934b567f";

const { ethers } = require("ethers");
const {
  DefenderRelaySigner,
  DefenderRelayProvider,
} = require("defender-relay-client/lib/ethers");

async function main(signer) {
  const mono = new ethers.Contract(ADDRESS, contractABI, signer);
  const previousVolume = await mono.previousVolume();

  const filters = mono.filters.LPStatsCalculated();
  const events = await mono.queryFilter(filters);

  //   console.log(events[0].args);
  const currentVolume = Number(events[0].args[1]);
  console.log((previousVolume - currentVolume) / previousVolume < -0.15);

  if ((previousVolume - currentVolume) / previousVolume < -0.15) {
    const monoLiquidity = new ethers.Contract(ADDRESS, ABI, signer);
    const tx = await monoLiquidity.removeLiquidity(
      "0x0c670AcA9AA0285B961F1D4AB7D4e462C7982311",
      "0xB5F97357D1B443432a5CAC14EdddBAab4b5F65BF",
      "0xf772505CA5bA7AeCf394Ea0Fe48ff4BF33bB6B62"
    );
    //   const receipt = await tx.wait(1);
    //   console.log(await receipt.events);
    console.log("Removed Liquidity!");
  }
}

exports.handler = async function (params) {
  const provider = new DefenderRelayProvider(params);
  const signer = new DefenderRelaySigner(params, provider, { speed: "fast" });
  console.log(`using relayer ${await signer.getAddress()}`);
  await main(signer);
};

const contractABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenA",
        type: "address",
      },
      {
        internalType: "address",
        name: "_tokenB",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "_amounts",
        type: "uint256[]",
      },
    ],
    name: "addLiquidity",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "initialSupply0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "initialSupply1",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_liquidityPool",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract IERC20",
        name: "sellToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "contract IERC20",
        name: "buyToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "boughtAmount",
        type: "uint256",
      },
    ],
    name: "BoughtTokens",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "tokenA",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "pair",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reserve0",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reserve1",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "decimals",
        type: "uint256",
      },
    ],
    name: "CalculatedSwapAmount",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_liquidityPool",
        type: "address",
      },
    ],
    name: "calculateLPStats",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenA",
        type: "address",
      },
      {
        internalType: "address",
        name: "_tokenB",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amountA",
        type: "uint256",
      },
    ],
    name: "calculateOptimalLiquidity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "liquidityPool",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tradingVolumeDaily",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "currentSupply0",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "currentSupply1",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "volume0",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "volume1",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "initialSupply0",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "initalSupply1",
        type: "uint256",
      },
    ],
    name: "LPStatsCalculated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "provider",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "liquidityPool",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "amountsProvided",
        type: "uint256[]",
      },
    ],
    name: "LiquidityProvided",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "remover",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "liquidityPool",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "amountsRemoved",
        type: "uint256[]",
      },
    ],
    name: "LiquidtyRemoved",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_remover",
        type: "address",
      },
      {
        internalType: "address",
        name: "_tokenA",
        type: "address",
      },
      {
        internalType: "address",
        name: "_tokenB",
        type: "address",
      },
    ],
    name: "removeLiquidity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sellToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "buyToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "address payable",
        name: "swapTarget",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "swapCallData",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    name: "zeroxSwap",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "exchangeProxy",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "r",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "a",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "decimals",
        type: "uint256",
      },
    ],
    name: "getSwapAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "lpToSupply24h",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "userToDeposit",
    outputs: [
      {
        internalType: "address",
        name: "tokenA",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenB",
        type: "address",
      },
      {
        internalType: "address",
        name: "liquidityPool",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "LPTokensReceived",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userToTokenToBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
