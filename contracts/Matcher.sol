// // SPDX-License-Identifier: MIT

// pragma solidity >=0.7.0 <0.9.0;

// import "hardhat/console.sol";
// import "./IERC20.sol";

// /**
//  * @title Matcher
//  * @dev 
//  */

// contract Matcher {
//     /* structs and enums */
//     struct Deposit {
//         address token;
//         address AMM;
//         uint256 amount;
//     }

//     /* state variables */ 
//     mapping(address => Deposit[]) userToDeposit;
//     mapping(address => uint256) tokenSupply;
//     mapping(address => uint256[]) pairToRewards; // change name
//     mapping(string => uint256) tokenRatios; // to do: need to calculate
//     address[] public tokens;
//     address[] public AMMs; // assumption: let's say that the AMMs we are talking to are ETH/DAI, WBTC/USDC, LINK/MKR, ETH/USDC, ETH/LINK
//     address public rewardToken; 

//     /* events */ 
//     event TokenDeposited(
//         address indexed token;
//         address indexed AMM;
//         uint256 indexed amount;
//         Deposit deposit;
//     )
//     event RewardsSent(
//         address indexed to;
//         address indexed AMM;
//         uint256 indexed amount;
//     )

//     /* constructor */
//     constructor(address[] _tokens, address[] _AMMs, address _rewardToken;) {
//         tokens = _tokens;
//         AMMs = _AMMs;
//         rewardToken = _rewardToken;
//         // set token ratios
//         tokenRatios["ETH/DAI"] = 3 * 10**18;
//         tokenRatios["USDC/WBTC"] = 2 * 10**18;
//         tokenRatios["LINK/MKR"] = 2 * 10**18;
//         tokenRatios["ETH/USDC"] = 3 * 10**18;
//         tokenRatios["ETH/LINK"] = 3 * 10**18 / 2;
//         // set rewards
//         rewardToken = _rewardToken;
//     }

//     /* external functions */
//     function deposit(address _token, address _AMM, uint256 _amount) external {
//         // need to check if token deposited is in the list of valid tokens
//         bool validToken;
//         for (uint256 i = 0; i <= tokens.length; i++) {
//             if (tokens[i] == _token) {
//                 validToken = true;
//             }
//         }
//         require(validToken, "Enter Valid Token!");
//         // need to check if AMM address is valid
//         bool validAMM;
//         for (uint i = 0; i <= tokens.length; i++) {
//             if (AMMs[i] == _AMM) {
//                 validAMM = true;
//             }
//         }
//         require(validAMM, "Enter Valid AMM Contract!");
//         // change state
//         Deposit memory deposit = Deposit({
//             token: _token,
//             AMM: _AMM,
//             amount: _amount
//         });
//         userToDeposit[msg.sender].push(deposit);
//         tokenSupply[_token] += _amount; 
//         // transfer erc20 liquidity to address(this)
//         require(IERC20(_token).transferFrom(msg.sender, address(this), _amount), "Deposit failed");
//         // emit token deposited event
//         emit TokenDeposited(_token, _AMM, _amount, deposit);
//         // send rewards
//         require(sendRewards(msg.sender, _AMM, _token));
//         // updateRewards();
//     }

//     function sendRewards(address _to, address _AMM, address _token) internal {
//         // check which token in the AMM has been deposited, note that as tokenIndex
//         uint256 tokenIndex;
//         if (pairToRewards[_AMM][0] == _token) {
//             tokenIndex = 0;
//         } else {
//             tokenIndex = 1;
//         }
//         // transfer erc20 rewards to depositer
//         require(IERC20(rewardToken)).transferFrom(address(this), msg.sender, pairToRewards[_AMM][tokenIndex]), "Rewards could not be sent";
//         emit RewardsSent(_to, _AMM, _amount);
//     }   
//     function updateRewards(address _AMM) internal {
//         // need to update pairToRewards[_AMM]
//         // will look at the supply ratios, look at the occurrence ratios, and determine the shortages for each pair
//         // based on the shortage amount in usd, add a (0.2) multiplier to that and add that to base rewards
//     }   

//     function match() external {
//         // 
//     }

//     function provideLiquidity() external {
//         // 
//     }

//     function withdrawPair() external {
//         // extract liqudity pair from AMM
//         // send fees and tokens to user 
//     }
// } 