# LiquidEase - ETH Denver Hackathon 2023

Sourcify: https://repo.sourcify.dev/contracts/full_match/5/0xaFaa7c12f7bba0C094CEE44B47fba153e859d799/

# Introduction:
LiquidEase is an innovative DeFi technology whose goal is to boost the adoption of DeFi by lowering friction for liquidity providers. In conventional LP models, in order to provide liquidity, a liquidity provider must provide two or more tokens. By giving liquidity providers the choice to supply single-sided liquidity, LiquidEase aims to expedite this procedure.


# Installation:
To install Liquidease, follow these steps:
Clone the repository from GitHub
Install the necessary dependencies using a package manager like npm or yarn
Connect your wallet to the app
Start using Liquidease to provide liquidity and set custom triggers for asset removal

# Smart Contracts:
The contract uses several Solidity libraries such as SafeMath, IERC20, and AggregatorV3Interface, as well as imported contracts such as IUniswapV2Pair and IUniswapV2Router02 from Uniswap and IUniswapV2Factory from Uniswap's v2-core library.
The constructor takes in the initial supplies of the two tokens in the liquidity pool and the liquidity pool address as inputs.
The getTokenValue() function is a helper function that takes in a token address and an amount and returns the token value of that amount based on a price feed address specific to the token.

The main functions of the contract are:
provideLiquidity(): Allows a user to provide liquidity to a Uniswap trading pair by depositing two tokens. It calculates the amount of LP tokens to be received and emits a LiquidityProvided event.
removeLiquidity(): Allows a user to remove liquidity from a Uniswap trading pair by specifying the LP token amount and the two tokens to receive. It calculates the amounts of tokens to be received and emits a LiquidtyRemoved event.
calculateLPStats(): Calculates daily statistics about a Uniswap trading pair such as trading volume, liquidity pool supply, and differences in token supply. It emits an LPStatsCalculated event with the calculated values.
executeSwap(): Swaps tokens using 0x ExchangeProxy and emits a BoughtTokens event with the amount of tokens bought.
The contract also has several state variables such as volume0, volume1, and diff1 used for calculating the daily statistics. The contract is deployed on both the Goerli and Ethereum mainnet with different addresses for tokens and the liquidity pool.


# Usage:
Liquidease offers a user-friendly interface that makes it easy for users to provide liquidity and set custom triggers. Upon connecting your wallet, you'll be prompted to select between two options: 2-sided liquidity or "Single Token Liquidity" for a simplified approach.
Once you've selected your preferred liquidity provision option, you can set custom triggers based on various factors like APY, trading volume, and impermanent loss. These triggers enable automated asset removal to ensure optimal performance and returns.

# Contributing:
Contributions to Liquidease are welcome and appreciated. If you'd like to contribute to the project, here are some steps to follow:
Fork the repository on GitHub
Make the necessary changes or bug fixes
Open a pull request to merge your changes into the main branch
Wait for the Liquidease team to review your changes and merge them if they are accepted

# Bounties:
0x API Swap is under contracts/MonoLiquidity and under scripts/swap0x.
OpenZeppelin Defender scripts can be found under the scripts folder, labelled auto task.
Chainlink AggregatorV3Interface used in contracts/MonoLiquidity







