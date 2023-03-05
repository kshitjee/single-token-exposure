// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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

// 7736314000000000000000000 * 10**18; 0xB5F97357D1B443432a5CAC14EdddBAab4b5F65BF mock dai
// 4944659000000000000000 * 10**18;  0xf772505CA5bA7AeCf394Ea0Fe48ff4BF33bB6B62 mock eth
// mock lp address = 0x7a884A791a8E86306AF26C1869a81D204cb50030

import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract MonoLiquidity01 {
  using SafeMath for uint;

  /* structs and enums */
  struct Deposit {
    address tokenA;
    address tokenB;
    address liquidityPool;
    uint256[] amounts;
    uint256[] amountProvided;
    uint256 LPTokensReceived;
  }

  /* constant variables */
  address private constant FACTORY = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
  address private constant ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

  // 0x ExchangeProxy address
  // https://docs.0x.org/developer-resources/contract-addresses
  address public exchangeProxy = 0xDef1C0ded9bec7F1a1670819833240f027b25EfF; // mainnet

  /* state variables */
  uint256 volume0;
  uint256 volume1;
  uint256 diff1;
  uint256 diff2;
  address private deployer;
  mapping(address => Deposit[]) public userToDeposit;
  mapping(address => mapping(address => uint256)) public userToTokenToBalance;
  mapping(address => uint256[]) public lpToSupply24h;

  /* events */
  event CalculatedSwapAmount(
    address indexed tokenA,
    address indexed pair,
    uint256 indexed amount,
    uint reserve0,
    uint reserve1,
    uint decimals
  );
  event LiquidityProvided(
    address indexed provider,
    address indexed liquidityPool,
    uint256[] amountsProvided
  );
  event LiquidtyRemoved(
    address indexed remover,
    address indexed liquidityPool,
    uint256[] amountsRemoved
  );
  event LPStatsCalculated(
    address indexed liquidityPool,
    uint256 tradingVolumeDaily,
    uint currentSupply0,
    uint currentSupply1,
    uint volume0,
    uint volume1,
    uint initialSupply0,
    uint initalSupply1
  );

  // it's emited when a swap is executed and returns the amount of bought tokens
  event BoughtTokens(IERC20 sellToken, IERC20 buyToken, uint256 boughtAmount);

  /* constructor */
  constructor(
    uint initialSupply0,
    uint initialSupply1,
    address _liquidityPool
  ) {
    deployer = msg.sender;
    lpToSupply24h[_liquidityPool].push(initialSupply0);
    lpToSupply24h[_liquidityPool].push(initialSupply1);
  }

  /* functions */
  function getTokenValue(
    address _token,
    uint256 _amount
  ) internal view returns (uint256) {
    address priceFeedAddr;
    if (_token == 0xB5F97357D1B443432a5CAC14EdddBAab4b5F65BF) {
      priceFeedAddr = 0x0d79df66BE487753B02D015Fb622DED7f0E9798d;
    } else {
      priceFeedAddr = 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e;
    }
    AggregatorV3Interface priceFeed = AggregatorV3Interface(priceFeedAddr); // Replace with appropriate ETH/USD price feed address for your network
    (, int256 answer, , , ) = priceFeed.latestRoundData();
    uint256 tokenPrice = uint256(answer);
    uint256 tokenDecimals = IERC20Metadata(_token).decimals();
    uint256 tokenValue = (_amount * tokenPrice) / (10 ** tokenDecimals);

    return tokenValue;
  }

  function calculateLPStats(address _liquidityPool) external {
    (uint256 currentSupply0, uint256 currentSupply1, ) = IUniswapV2Pair(
      _liquidityPool
    ).getReserves();

    uint256[2] memory currentSupplies = [currentSupply0, currentSupply1];

    if (currentSupply0 > (lpToSupply24h[_liquidityPool][0])) {
      diff1 = currentSupply0 - lpToSupply24h[_liquidityPool][0];
      volume0 = getTokenValue(
        0xB5F97357D1B443432a5CAC14EdddBAab4b5F65BF,
        diff1
      );
    } else {
      diff1 = lpToSupply24h[_liquidityPool][0] - currentSupply0;
      volume0 = getTokenValue(
        0xB5F97357D1B443432a5CAC14EdddBAab4b5F65BF,
        diff1
      );
    }
    if (currentSupply1 > (lpToSupply24h[_liquidityPool][1])) {
      diff2 = currentSupply1 - lpToSupply24h[_liquidityPool][1];
      volume1 = getTokenValue(
        0x7Dc0bB34236c6FF881a11d3d5042E26ff1740a6d,
        diff2
      );
    } else {
      diff2 = lpToSupply24h[_liquidityPool][1] - currentSupply1;
      volume1 = getTokenValue(
        0x7Dc0bB34236c6FF881a11d3d5042E26ff1740a6d,
        diff2
      );
    }
    uint256 dailyVolume = volume0 + volume1;
    lpToSupply24h[_liquidityPool] = currentSupplies;

    emit LPStatsCalculated(
      _liquidityPool,
      dailyVolume,
      currentSupply0,
      currentSupply1,
      volume0,
      volume1,
      (lpToSupply24h[_liquidityPool][0]),
      (lpToSupply24h[_liquidityPool][1])
    );
  }

  function getSwapAmount(
    uint r,
    uint a,
    uint decimals
  ) public pure returns (uint) {
    return (
      (
        (
          sqrt(r.mul(r.mul(3988009) + (10 ** decimals).mul(a).mul(3988000)))
            .sub(r.mul(1997))
        )
      ).div(1994)
    );
  }

  function calculateOptimalLiquidity(
    address _tokenA,
    address _tokenB,
    uint _amountA
  ) external {
    // get pair based on params, get reserves for each pair
    address pair = IUniswapV2Factory(FACTORY).getPair(_tokenA, _tokenB);
    (uint reserve0, uint reserve1, ) = IUniswapV2Pair(pair).getReserves();
    uint decimals = IERC20Metadata(_tokenA).decimals();

    // perform swap based on getSwapAmount(), emit event to display swap amount in frontend
    uint256 swapAmount;
    if (IUniswapV2Pair(pair).token0() == _tokenA) {
      // swap from token 0 to token 1
      swapAmount = getSwapAmount(reserve0, _amountA, decimals);
      emit CalculatedSwapAmount(
        _tokenA,
        pair,
        swapAmount,
        reserve0,
        reserve1,
        decimals
      );
    } else {
      // swap from token 1 to token 0
      swapAmount = getSwapAmount(reserve1, _amountA, decimals);
      emit CalculatedSwapAmount(
        _tokenA,
        pair,
        swapAmount,
        reserve0,
        reserve1,
        decimals
      );
    }
  }

  /* 0x swap
   * this function is used to execute a swap on 0x
   * it takes the parameters from the API response and executes the swap
   * it also gives an infinite allowance to the 0x contract to spend the `sellToken`
   * the amount to swap is determined in `sellAmount` field when fetching the quote from the API, it's encoded in the `data` field and passed to this function as `swapCallData`
   */
  function zeroxSwap(
    // The `sellTokenAddress` field from the API response.
    address sellToken,
    // The `buyTokenAddress` field from the API response.
    address buyToken,
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
      IERC20(sellToken).approve(spender, type(uint256).max),
      "allowance error"
    );

    // Track the initial user balance of the buyToken, so we can calculate how much was bought at the end
    // the calculation will be made by subtracting the initial balance from the final balance of the buyToken
    // @dev: this assumes that the msg.sender is the holder of the buyToken, if not, this needs to be changed
    uint256 boughtAmount = IERC20(buyToken).balanceOf(msg.sender);

    // Execute the swap by calling the 0x ExchangeProxy contract
    // Note that the swapCallData is the encoded data payload that needs to be sent to the 0x Exchange Proxy contract to execute the swap
    // The swapCallData is generated by the 0x API and passed to this function as a parameter
    // The swapCallData is generated by the 0x API based on the parameters passed to the API
    (bool success, ) = swapTarget.call{ value: msg.value }(swapCallData);
    require(success, "SWAP_CALL_FAILED");

    // it checks if there is any unspent protocol fees left in the contract balance resulted of any unspent protocol fees,
    // and if so, it refunds the sender
    // dev: double check if it's necessary, not sure if any unspent fees will be sent to this contract
    if (address(this).balance > 0) {
      (bool success2, ) = msg.sender.call{ value: address(this).balance }("");
      require(success2, "Refund failed");
    }

    // Calculate the amount of `buyToken` bought by subtracting the initial balance from the final balance
    emit BoughtTokens(IERC20(sellToken), IERC20(buyToken), boughtAmount);
    boughtAmount = IERC20(buyToken).balanceOf(address(this));
    // Transfer the bought tokens directly to the msg.sender
    require(
      IERC20(buyToken).transfer(msg.sender, boughtAmount),
      "Transfer failed"
    );
  }

  function addLiquidity(
    address _tokenA,
    address _tokenB,
    uint256[] memory _amounts
  ) external payable {
    // get pair using uniswap factory interface
    address pair = IUniswapV2Factory(FACTORY).getPair(_tokenA, _tokenB);
    require(pair != address(0), "Pair does not exist");

    // liquidity provider deposits tokens to this contract
    require(
      IERC20(_tokenA).transferFrom(msg.sender, address(this), _amounts[0]),
      "Deposit for token A failed"
    );
    require(
      IERC20(_tokenB).transferFrom(msg.sender, address(this), _amounts[1]),
      "Deposit for token B failed"
    );

    // approve router to provide liquidity from this contract
    IERC20(_tokenA).approve(ROUTER, IERC20(_tokenA).balanceOf(address(this)));
    IERC20(_tokenB).approve(ROUTER, IERC20(_tokenB).balanceOf(address(this)));

    // provide liquidity
    (
      uint256 amountTokenA,
      uint256 amountTokenB,
      uint256 lpTokensMinted
    ) = IUniswapV2Router02(ROUTER).addLiquidity(
        _tokenA,
        _tokenB,
        IERC20(_tokenA).balanceOf(address(this)),
        IERC20(_tokenB).balanceOf(address(this)),
        0,
        0,
        address(this),
        block.timestamp
      );

    // update state variables: deposit struct + userToDeposit mappings
    uint256[] memory amountsProvided = new uint256[](2);
    amountsProvided[0] = amountTokenA;
    amountsProvided[1] = amountTokenB;
    Deposit memory deposit = Deposit({
      tokenA: _tokenA,
      tokenB: _tokenB,
      liquidityPool: pair,
      amounts: _amounts,
      amountProvided: amountsProvided,
      LPTokensReceived: lpTokensMinted
    });
    userToDeposit[msg.sender].push(deposit);
    userToTokenToBalance[msg.sender][_tokenA] += (_amounts[0] -
      amountsProvided[0]);
    userToTokenToBalance[msg.sender][_tokenA] += (_amounts[1] -
      amountsProvided[1]);
    emit LiquidityProvided(msg.sender, pair, amountsProvided);
  }

  // might need modifier, check if can be done via defender first
  function removeLiquidity(
    address _remover,
    address _tokenA,
    address _tokenB
  ) external {
    // get pair
    address pair = IUniswapV2Factory(FACTORY).getPair(_tokenA, _tokenB);
    // find correct deposit, determine lp tokens to burn
    Deposit[] storage deposits = userToDeposit[_remover];
    uint256 depositIndex = ~uint256(0);
    for (uint256 i = 0; i < deposits.length; i++) {
      Deposit storage deposit = deposits[i];
      if (
        deposit.tokenA == _tokenA &&
        deposit.tokenB == _tokenB &&
        deposit.liquidityPool ==
        IUniswapV2Factory(FACTORY).getPair(_tokenA, _tokenB)
      ) {
        depositIndex = i;
        break;
      }
    }
    require(depositIndex != ~uint256(0), "Deposit not found");

    // Remove liquidity
    (uint256 amountTokenA, uint256 amountTokenB) = IUniswapV2Router02(ROUTER)
      .removeLiquidity(
        deposits[depositIndex].tokenA,
        deposits[depositIndex].tokenB,
        deposits[depositIndex].LPTokensReceived,
        0,
        0,
        address(this),
        block.timestamp
      );

    // fetch user token balances and update balances to 0
    uint256 tokenABalance = userToTokenToBalance[_remover][_tokenA];
    uint256 tokenBBalance = userToTokenToBalance[_remover][_tokenB];

    userToTokenToBalance[_remover][_tokenA] = 0;
    userToTokenToBalance[_remover][_tokenB] = 0;

    // transfer token balances back to user
    require(
      IERC20(_tokenA).transferFrom(
        address(this),
        _remover,
        tokenABalance + amountTokenA
      ),
      "Return for token A failed"
    );
    require(
      IERC20(_tokenB).transferFrom(
        address(this),
        _remover,
        tokenBBalance + amountTokenB
      ),
      "Return for token B failed"
    );

    // remove deposit from userToDeposit mapping
    for (uint i = 0; i < userToDeposit[_remover].length; i++) {
      if (
        userToDeposit[_remover][i].tokenA == _tokenA &&
        userToDeposit[_remover][i].tokenB == _tokenB &&
        userToDeposit[_remover][i].liquidityPool == pair
      ) {
        userToDeposit[_remover][i] = userToDeposit[_remover][
          userToDeposit[_remover].length - 1
        ];
        userToDeposit[_remover].pop();
        break;
      }
    }

    // emit event
    uint256[] memory amountsRemoved = new uint256[](2);
    amountsRemoved[0] = amountTokenA;
    amountsRemoved[1] = amountTokenB;
    emit LiquidtyRemoved(_remover, pair, amountsRemoved);
  }

  function sqrt(uint y) private pure returns (uint z) {
    if (y > 3) {
      z = y;
      uint x = y / 2 + 1;
      while (x < z) {
        z = x;
        x = (y / x + x) / 2;
      }
    } else if (y != 0) {
      z = 1;
    }
  }
}
