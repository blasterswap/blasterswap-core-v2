pragma solidity >=0.5.16;

interface IBlast {
    function configureClaimableGas() external;
    function configureGovernor(address governor) external;
    function configureAutomaticYield() external;
}
