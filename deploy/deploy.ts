import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { BlasterswapV2Factory__factory, BlasterswapV2Factory, BlasterswapV2Router02, BlasterswapV2Router02__factory, WETH } from "../typechain-types";
import { ethers } from 'hardhat';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const signers = await hre.ethers.getSigners();
	const deployer = signers[0];
	const governor = ethers.ZeroAddress;
	// console.log("Deployer address:", await deployer.getAddress());

	const blk = await hre.ethers.provider.getBlockNumber();
	console.log(blk);

	const feeToSetter = deployer.address;
	console.log(feeToSetter)
	const WETHAddress = "0x4300000000000000000000000000000000000004";
	console.log("WETH address:", WETHAddress);

	if (governor === ethers.ZeroAddress) {
		throw new Error("Governor address is not set");
	}
	// // throw new Error("Chainge Points operator to our eoa backend signer");

	// const Factory: BlasterswapV2Factory__factory = await hre.ethers.getContractFactory("BlasterswapV2Factory");
	// const factory: BlasterswapV2Factory = await Factory.connect(deployer).deploy(feeToSetter, governor);
	// await factory.waitForDeployment();

	// await factory.setFeeTo(await deployer.getAddress());

	// console.log("BlasterswapV2Factory deployed to:", await factory.getAddress());


	// const Router: BlasterswapV2Router02__factory = await hre.ethers.getContractFactory("BlasterswapV2Router02");
	// const router: BlasterswapV2Router02 = await Router.connect(deployer).deploy(await factory.getAddress(), WETHAddress, await governor.getAddress());
	// await router.waitForDeployment();

	// console.log("BlasterswapV2Router02 deployed to:", await router.getAddress());
};

export default func;
