// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// goerli
// link 0x63bfb2118771bd0da7A6936667A7BB705A06c1bA
// usdc 0xd35CCeEAD182dcee0F148EbaC9447DA2c4D449c4
// dai 0x5C221E77624690fff6dd741493D735a17716c26B

// mainnet
// link 0x514910771AF9Ca656af840dff83E8264EcF986CA
// usdc 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
// dai 0x6B175474E89094C44Da98b954EedeAC495271d0F
// wbtc 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599
// weth 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2

// A partial WETH interfaec.
interface IWETH is IERC20 {
    function deposit() external payable;
}

contract SimpleSwap {
    // 0x ExchangeProxy address
    // https://docs.0x.org/developer-resources/contract-addresses
    address public exchangeProxy = 0xDef1C0ded9bec7F1a1670819833240f027b25EfF; // mainnet

    IWETH public immutable WETH;

    constructor(address _WETH) {
        WETH = IWETH(_WETH);
    }

    // it's emited when a swap is executed and returns the amount of bought tokens
    event BoughtTokens(IERC20 sellToken, IERC20 buyToken, uint256 boughtAmount);

    // This function receives ETH and wraps it into WETH
    function depositETH() external payable {
        WETH.deposit{value: msg.value}();
        payable(msg.sender).transfer(msg.value);
    }

    /* 0x swap
     * this function is used to execute a swap on 0x
     * it takes the parameters from the API response and executes the swap
     * it also gives an infinite allowance to the 0x contract to spend the `sellToken`
     * the amount to swap is determined in `sellAmount` field when fetching the quote from the API, it's encoded in the `data` field and passed to this function as `swapCallData`
     */
    function zeroxSwap(
        // The `sellTokenAddress` field from the API response.
        IERC20 sellToken,
        // The `buyTokenAddress` field from the API response.
        IERC20 buyToken,
        // The `allowanceTarget` field from the API response.
        address spender,
        // The `to` field from the API response.
        address payable swapTarget,
        // The `data` field from the API response.
        // It's the encoded data payload that needs to be sent to the 0x Exchange Proxy contract to execute the swap
        bytes calldata swapCallData
    ) external payable {
        // Checks that the swapTarget is actually the address of 0x ExchangeProxy
        require(swapTarget == exchangeProxy, "Target not ExchangeProxy");

        // Give `spender` (0x contract) an infinite allowance to spend the `sellToken`
        // Note that for some tokens (e.g., USDT, KNC), you must first reset any existing allowance to 0
        require(
            sellToken.approve(spender, type(uint256).max),
            "allowance error"
        );

        // Track the initial user balance of the buyToken, so we can calculate how much was bought at the end
        // the calculation will be made by subtracting the initial balance from the final balance of the buyToken
        // @dev: this assumes that the msg.sender is the holder of the buyToken, if not, this needs to be changed
        uint256 boughtAmount = buyToken.balanceOf(msg.sender);

        // Execute the swap by calling the 0x ExchangeProxy contract
        // Note that the swapCallData is the encoded data payload that needs to be sent to the 0x Exchange Proxy contract to execute the swap
        // The swapCallData is generated by the 0x API and passed to this function as a parameter
        // The swapCallData is generated by the 0x API based on the parameters passed to the API
        (bool success, ) = swapTarget.call{value: msg.value}(swapCallData);
        require(success, "SWAP_CALL_FAILED");

        // it checks if there is any unspent protocol fees left in the contract balance resulted of any unspent protocol fees,
        // and if so, it refunds the sender
        // dev: double check if it's necessary, not sure if any unspent fees will be sent to this contract
        if (address(this).balance > 0) {
            (bool success2, ) = msg.sender.call{value: address(this).balance}(
                ""
            );
            require(success2, "Refund failed");
        }

        // Calculate the amount of `buyToken` bought by subtracting the initial balance from the final balance
        emit BoughtTokens(sellToken, buyToken, boughtAmount);

        boughtAmount = buyToken.balanceOf(address(this));

        // Transfer the bought tokens directly to the msg.sender
        require(buyToken.transfer(msg.sender, boughtAmount), "Transfer failed");
    }

    address public constant USDC_ADDRESS =
        0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    function getUSDCBalance(address account) external view returns (uint256) {
        IERC20 usdcToken = IERC20(USDC_ADDRESS);
        return usdcToken.balanceOf(account);
    }
}
