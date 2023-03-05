const ABI = ["function calculateLPStats(address _liquidityPool) external"];

const ADDRESS = "0xbb4a18773c5f036ad821059dd3574320934b567f";

const { ethers } = require("ethers");
const {
  DefenderRelaySigner,
  DefenderRelayProvider,
} = require("defender-relay-client/lib/ethers");

async function main(signer) {
  const monoLiquidity = new ethers.Contract(ADDRESS, ABI, signer);
  const tx = await monoLiquidity.calculateLPStats(
    "0x7a884A791a8E86306AF26C1869a81D204cb50030"
  );
  const receipt = await tx.wait(1);
  console.log(await receipt.events[0].getTransactionReceipt());

  console.log("calculated LP stats");
}

exports.handler = async function (params) {
  const provider = new DefenderRelayProvider(params);
  const signer = new DefenderRelaySigner(params, provider, { speed: "fast" });
  console.log(`using relayer ${await signer.getAddress()}`);
  await main(signer);
};
