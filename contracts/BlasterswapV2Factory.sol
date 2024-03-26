pragma solidity =0.5.16;

import "./interfaces/IBlasterswapV2Factory.sol";
import "./interfaces/IBlast.sol";
import "./BlasterswapV2Pair.sol";

contract BlasterswapV2Factory is IBlasterswapV2Factory {
    address public feeTo;
    address public feeToSetter;
    address public governor;

    IBlast public BLAST;

    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;

    // address public constant blast = 0x4300000000000000000000000000000000000002;

    event PairCreated(
        address indexed token0,
        address indexed token1,
        address pair,
        uint
    );

    constructor(address _feeToSetter, address _governor) public {
        require(address(0) != _governor, 'BlasterswapV2: governor is zero address');
        feeToSetter = _feeToSetter;
        governor = _governor;

        // IBlast iblast = IBlast(blast);
        // iblast.configureClaimableGas();
        // iblast.configureGovernor(_governor);
    }

    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }

    function createPair(
        address tokenA,
        address tokenB
    ) external returns (address pair) {
        require(tokenA != tokenB, "BlasterswapV2: IDENTICAL_ADDRESSES");
        (address token0, address token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
        require(token0 != address(0), "BlasterswapV2: ZERO_ADDRESS");
        require(
            getPair[token0][token1] == address(0),
            "BlasterswapV2: PAIR_EXISTS"
        ); // single check is sufficient
        bytes memory bytecode = type(BlasterswapV2Pair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        IBlasterswapV2Pair(pair).initialize(token0, token1, governor);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, "BlasterswapV2: FORBIDDEN");
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, "BlasterswapV2: FORBIDDEN");
        feeToSetter = _feeToSetter;
    }
}
