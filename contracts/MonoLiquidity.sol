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

import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract MonoLiquidity {
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
    address private constant FACTORY =
        0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address private constant ROUTER =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    /* state variables */
    address private deployer;
    mapping(address => Deposit[]) userToDeposit;
    mapping(address => mapping(address => uint256)) userToTokenToBalance;

    /* events */
    event CalculatedSwapAmount(
        address indexed tokenA,
        address indexed pair,
        uint256 indexed amount,
        uint reserve0,
        uint reserve1
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

    /* modifiers */

    /* constructor */
    constructor() {
        deployer = msg.sender;
    }
    
    /* functions */
  function getSwapAmount(uint r, uint a, uint decimals) public pure returns (uint) {
    return ((10**decimals).mul(sqrt(r.mul(r.mul(3988009) + a.mul(3988000))).sub(r.mul(1997)))).div(1994);
    // return a.div(2);
    // return sqrt(r.mul(10) + r.mul(a));
  }

    function calculateOptimalLiquidity(address _tokenA, address _tokenB, uint _amountA) external {
        // get pair based on params, get reserves for each pair
        
        address pair = IUniswapV2Factory(FACTORY).getPair(_tokenA, _tokenB);
        (uint reserve0, uint reserve1, ) = IUniswapV2Pair(pair).getReserves();
        uint decimals = IERC20Metadata(_tokenA).decimals();

        // perform swap based on getSwapAmount(), emit event to display swap amount in frontend
        uint256 swapAmount;
        if (IUniswapV2Pair(pair).token0() == _tokenA) {
            // swap from token 0 to token 1
            swapAmount = getSwapAmount(reserve0, _amountA, decimals);
            emit CalculatedSwapAmount(_tokenA, pair, swapAmount, reserve0, reserve1);
        }
        else {
            // swap from token 1 to token 0
            swapAmount = getSwapAmount(reserve1, _amountA, decimals);
            emit CalculatedSwapAmount(_tokenA, pair, swapAmount, reserve0, reserve1);
        }
    }

    function addLiquidity(address _tokenA, address _tokenB, uint256[] memory _amounts, address  _liquidityProvider) external {
        // can only deposit in new pair, cannot increase liquidity in existing pair for now


        // get pair using uniswap factory interface
        address pair = IUniswapV2Factory(FACTORY).getPair(_tokenA, _tokenB);
        require(pair != address(0), "Pair does not exist");

        // liquidity provider deposits tokens to this contract
        require(IERC20(_tokenA).transferFrom(_liquidityProvider, address(this), _amounts[0]), "Deposit for token A failed");
        require(IERC20(_tokenB).transferFrom(_liquidityProvider, address(this), _amounts[1]), "Deposit for token B failed");

        // approve router to provide liquidity from this contract 
        uint balA = IERC20(_tokenA).balanceOf(address(this));
        uint balB = IERC20(_tokenB).balanceOf(address(this));
        IERC20(_tokenA).approve(ROUTER, balA);
        IERC20(_tokenB).approve(ROUTER, balB);

        // provide liquidity
        (uint256 amountTokenA, uint256 amountTokenB, uint256 lpTokensMinted) = IUniswapV2Router02(ROUTER).addLiquidity(
            _tokenA,
            _tokenB,
            balA,
            balB,
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
        userToDeposit[_liquidityProvider].push(deposit);
        userToTokenToBalance[_liquidityProvider][_tokenA] += (_amounts[0] - amountsProvided[0]);
        userToTokenToBalance[_liquidityProvider][_tokenA] += (_amounts[1] - amountsProvided[1]);
        emit LiquidityProvided(_liquidityProvider, pair, amountsProvided);
    }

    // might need modifier, check if can be done via defender first
    function removeLiquidity(address _remover, address _tokenA, address _tokenB) external {
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
                deposit.liquidityPool == IUniswapV2Factory(FACTORY).getPair(_tokenA, _tokenB)
            ) {
                depositIndex = i;
                break;
            }
        }
        require(depositIndex != ~uint256(0), "Deposit not found");

        // Remove liquidity
        (uint256 amountTokenA, uint256 amountTokenB) = IUniswapV2Router02(ROUTER).removeLiquidity(
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
        require(IERC20(_tokenA).transferFrom(address(this), _remover, tokenABalance + amountTokenA), "Return for token A failed");
        require(IERC20(_tokenB).transferFrom(address(this), _remover, tokenBBalance + amountTokenB), "Return for token B failed");

        // remove deposit from userToDeposit mapping
        for (uint i = 0; i < userToDeposit[_remover].length; i++) {
            if (
                userToDeposit[_remover][i].tokenA == _tokenA &&
                userToDeposit[_remover][i].tokenB == _tokenB &&
                userToDeposit[_remover][i].liquidityPool == pair
            ) {
                userToDeposit[_remover][i] = userToDeposit[_remover][userToDeposit[_remover].length - 1];
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


