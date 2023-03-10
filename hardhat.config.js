require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.9",
// };

require("@nomiclabs/hardhat-waffle");
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.9",
  },
  defaultNetwork: "localhost",
  networks: {
    localhost: {},
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
    },
    forking: {
      url: "https://mainnet.infura.io/v3/7cb66f0c8b864d089ed93c13f4f8da31",
    },
  },
  namedAccounts: {
    owner: {
      default: 0,
    },
    liquidityProvider: {
      default: 1,
    },
  },
};
