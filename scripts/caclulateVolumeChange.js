const { ethers } = require("ethers");



const events = await contract.getPastEvents("EventName", { fromBlock: 0, toBlock: "latest" });
const lastEvent = events.pop();

console.log(lastEvent);