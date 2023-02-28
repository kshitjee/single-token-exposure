// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;


contract MonoLiquidity {
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
    mapping(address => Deposit[]) userToDeposit;
    mapping(address => mapping(address => uint256)) userToTokenToBalance;

    /* events */
    event CalculatedSwapAmount(
        address indexed tokenA,
        address indexed pair,
        uint256 indexed amount
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
    
    /* functions */
    function getSwapAmount(uint r, uint a) public pure returns (uint) {
        // calculate optimal liqudity provision
        return (sqrt(r * (r * 3988009 + a * 3988000)) - r * 1997) / 1994;
    }

    function calculateOptimalLiquidity(address _tokenA, address _tokenB, uint256 _amountA) external {
        // get pair based on params, get reserves for each pair
        address pair = IUniswapV2Factory(FACTORY).getPair(_tokenA, _tokenB);
        (uint reserve0, uint reserve1, ) = IUniswapV2Pair(pair).getReserves();

        // perform swap based on getSwapAmount(), emit event to display swap amount in frontend
        uint256 swapAmount;
        if (IUniswapV2Pair(pair).token0() == _tokenA) {
            // swap from token 0 to token 1
            swapAmount = getSwapAmount(reserve0, _amountA);
            emit CalculatedSwapAmount(_tokenA, pair, swapAmount);
        }
        else {
            // swap from token 1 to token 0
            swapAmount = getSwapAmount(reserve1, _amountA);
            emit CalculatedSwapAmount(_tokenA, pair, swapAmount);
        }
    }

    function addLiquidity(address _tokenA, address _tokenB, uint256[] memory _amounts, address  _liquidityProvider) internal {
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
        (uint256 amountTokenA, uint256 amountTokenB, uint256 lpTokensMinted) = IUniswapV2Router(ROUTER).addLiquidity(
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
        (uint256 amountTokenA, uint256 amountTokenB) = IUniswapV2Router(ROUTER).removeLiquidity(
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



interface IERC20 {
    function totalSupply() external view returns (uint);

    function balanceOf(address account) external view returns (uint);

    function transfer(address recipient, uint amount) external returns (bool);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint);

    function approve(address spender, uint amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool);
}

interface IUniswapV2Router {
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);

    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB);
}

interface IUniswapV2Factory {
    function getPair(
        address token0,
        address token1
    ) external view returns (address);
}

interface IUniswapV2Pair {
    function token0() external view returns (address);

    function token1() external view returns (address);

    function getReserves()
        external
        view
        returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
}
