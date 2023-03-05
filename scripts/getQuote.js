import ethers from "ethers";
import qs from "qs";
import fetch from "node-fetch";

const API_QUOTE_URL = "https://goerli.api.0x.org/swap/v1/quote";

const sellAmount = 49914.332110262862325934;

function createQueryString(params) {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
}

const getQuote = async () => {
  const sellAmountWei = ethers.utils.parseUnits(String(sellAmount), "ether");
  const qs = createQueryString({
    sellToken: "0xB5F97357D1B443432a5CAC14EdddBAab4b5F65BF",
    buyToken: "0xf772505CA5bA7AeCf394Ea0Fe48ff4BF33bB6B62",
    sellAmount: sellAmountWei,
  });
  const quoteUrl = `${API_QUOTE_URL}?${qs}`;
  const response = await fetch(quoteUrl);
  const quote = await response.json();

  console.log(quote);
};

getQuote();
