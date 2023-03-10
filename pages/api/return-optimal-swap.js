// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
import { abi } from "../../abi";

//0xF85895D097B2C25946BB95C4d11E2F3c035F8f0C

export default async function handler(req, res) {
  const contractAddresses = {
    DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    WETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    LINK: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  };

  // console.log(req.body);
  await deployments.fixture(["all"]);
  const monoLiquidity = await ethers.getContractAt(
    abi,
    "0x0b27a79cb9C0B38eE06Ca3d94DAA68e0Ed17F953"
  );

  // console.log(monoLiquidity);

  const tokenB = req.body.pair.title
    .split("/")
    .find((token) => token !== req.body.tokenA);

  // console.log(req.body.tokenA, tokenB, req.body.depositAmount);

  const tokenAaddress = contractAddresses[req.body.tokenA];
  const tokenBaddress = contractAddresses[tokenB];
  const txrequest = await monoLiquidity.calculateOptimalLiquidity(
    tokenAaddress,
    tokenBaddress,
    req.body.depositAmount
  );
  // console.log(txrequest);
  const receipt = await txrequest.wait(1);
  console.log(receipt);
  const optimalLiquidityInfo = receipt.events[0].args;
  // console.log(optimalLiquidityInfo);
  const amountToSwapBigInt = optimalLiquidityInfo[2];
  const decimalsBigInt = optimalLiquidityInfo[5];
  const amountToSwap = parseFloat(amountToSwapBigInt.toString());
  const decimals = parseFloat(decimalsBigInt.toString());
  const amountWithDecimals = amountToSwap / 10 ** decimals;
  console.log(amountWithDecimals);

  const data = {
    amountToSwap: amountToSwap,
    amountWithDecimals: amountWithDecimals,
    tokenA: req.body.tokenA,
    tokenB: tokenB,
  };

  res.status(200).json(data);
}
