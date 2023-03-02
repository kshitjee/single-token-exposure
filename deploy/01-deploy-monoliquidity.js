const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
require("dotenv").config();

module.exports = async function ({ getNamedAccounts, deployments }) {
  /* important variables for deployment */
  const { deploy, log } = deployments;
  const { owner } = await getNamedAccounts();
  const args = [];

  /* deployment */
  log("deploying mono liquidity contract");
  const collectionDeployment = await deploy("MonoLiquidity", {
    from: owner,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

};

module.exports.tags = ["all", "collection"];