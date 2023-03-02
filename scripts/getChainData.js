const fetch = require("node-fetch");

// Covalent API documentation: https://www.covalenthq.com/docs/api/

// chains code to pass into Covalent API
// eth-goerli isn't supported yet
const eth_mainnet = "eth-mainnet"; // Ethereum Mainnet, Goerli is not supported yet for LP data

// DEX code to pass into Covalent API
const uniswap = "uniswap_v2"; // Uniswap V2, Uniswap V3 is not supported yet
// list of Uniswap V2 pools: https://www.geckoterminal.com/eth/uniswap_v2/pools

// get LP data with Covalent API
const getLpData = async (pool_addr) => {
  const result = await fetch(
    `https://api.covalenthq.com/v1/${eth_mainnet}/xy=k/${uniswap}/pools/address/${pool_addr}/?key=${"YOUR_API_KEY"}`
  );
  const response = await result.json();
  console.log(response.data.items);
  return response;
};

// example of getting LP data for Uniswap V2 USDC/WETH pool
getLpData("0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc");
