import ethers from "ethers";
import qs from "qs";
import fetch from "node-fetch";

const API_QUOTE_URL = "https://goerli.api.0x.org/swap/v1/quote";
// const API_QUOTE_URL = "https://api.0x.org/swap/v1/quote";

const sellAmount = 4000;

function createQueryString(params) {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
}

const getQuote = async () => {
  // const sellAmountWei = ethers.utils.parseUnits(String(sellAmount), "ether");
  // console.log(Number(sellAmountWei));
  // const qs = createQueryString({
  //   sellToken: "USDC",
  //   buyToken: "ETH",
  //   sellAmount: sellAmountWei,
  // });
  // const quoteUrl = `${API_QUOTE_URL}?${qs}`;
  // const response = await fetch(quoteUrl);
  // const quote = await response.json();
  // console.log(quote);

  const sellAmountWei = ethers.utils.parseUnits(String(sellAmount), "ether");

  const API_ENDPOINT = "https://goerli.api.0x.org/swap/v1/quote";
  const qs = createQueryString({
    sellToken: "0xB5F97357D1B443432a5CAC14EdddBAab4b5F65BF",
    buyToken: "0xf772505CA5bA7AeCf394Ea0Fe48ff4BF33bB6B62",
    sellAmount: sellAmountWei.toString(),
  });

  const quoteUrl = `${API_ENDPOINT}?${qs}`;
  const response = await fetch(quoteUrl);
  const quote = await response.json();
  console.log(quote);
};

getQuote();
