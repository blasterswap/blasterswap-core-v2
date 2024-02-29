pragma solidity >=0.5.16;

interface IBlast {
    function configureClaimableGas() external;
    function configureGovernor(address governor) external;
    function configureClaimableYield() external;
    function claimAllYield(address contractAddress, address recipientOfYield) external returns (uint256);
    function claimMaxGas(address contractAddress, address recipientOfGas) external returns (uint256);
}
