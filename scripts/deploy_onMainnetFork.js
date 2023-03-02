const hre = require("hardhat");

async function main() {
  // we get the contract to deploy
  const MonoLiquidity = await hre.ethers.getContractFactory("MonoLiquidity");
  const monoLiquidity = await MonoLiquidity.deploy();

  await monoLiquidity.deployed();

  console.log("MonoLiquidity deployed to:", monoLiquidity.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// How to fork Ethereum Mainnet
// npx hardhat node --fork https://mainnet.infura.io/v3/<YOUR_INFURA_API_FOR_ETHEREUM_MAINNET>

// to run this script, run the following command:
// npx hardhat run scripts/deploy_onMainnetFork.js --network localhost
