import { BlasterswapV2Factory__factory, BlasterswapV2Factory, BlasterswapV2Router02, BlasterswapV2Router02__factory, WETH, MockToken, MockToken__factory } from "../typechain-types";
import { ethers } from "hardhat";


async function deployUniAndPair() {
	const signers = await ethers.getSigners();
	const deployer = signers[0];
	const owner = signers[0];

	const gasRefundAddress = "0xbcd8A06036D23d649A510489a618c72D2220689F";

	console.log("Deployer address:", await deployer.getAddress());
	console.log("Gas refund address:", gasRefundAddress);

	const Erc20Mock = await ethers.getContractFactory("MockToken") as unknown as MockToken__factory;
	const WETHAddress = "0x4200000000000000000000000000000000000023";
	console.log("WETH address:", WETHAddress);

	const Factory: BlasterswapV2Factory__factory = await ethers.getContractFactory("BlasterswapV2Factory");
	const factory: BlasterswapV2Factory = await Factory.connect(deployer).deploy(await deployer.getAddress(), gasRefundAddress);
	await factory.waitForDeployment();

	console.log("BlasterswapV2Factory deployed to:", await factory.getAddress());


	const Router: BlasterswapV2Router02__factory = await ethers.getContractFactory("BlasterswapV2Router02");
	const router: BlasterswapV2Router02 = await Router.connect(deployer).deploy(await factory.getAddress(), WETHAddress, gasRefundAddress);
	await router.waitForDeployment();

	console.log("BlasterswapV2Router02 deployed to:", await router.getAddress());

	console.log();
	console.log("You can mint erc20A, erc20B, WETH using mint function on each contract");

	const blasterswapRouterAddress = await router.getAddress();

	const mintAmount = BigInt(1_000_000_000) * BigInt(10 ** 18);
	let tx;

	const erc20A = await Erc20Mock.connect(owner).deploy("usd_a", "A") as unknown as MockToken;
	await erc20A.waitForDeployment();

	const erc20B = await Erc20Mock.connect(owner).deploy("usd_b", "B") as unknown as MockToken;
	await erc20B.waitForDeployment();

	const erc20C = await Erc20Mock.connect(owner).deploy("usd_c", "C") as unknown as MockToken;
	await erc20C.waitForDeployment();

	const erc20D = await Erc20Mock.connect(owner).deploy("usd_d", "D") as unknown as MockToken;
	await erc20D.waitForDeployment();

	tx = await erc20A.connect(owner).mint(mintAmount);
	await tx.wait();

	tx = await erc20B.connect(owner).mint(mintAmount);
	await tx.wait();

	tx = await erc20C.connect(owner).mint(mintAmount);
	await tx.wait();

	tx = await erc20D.connect(owner).mint(mintAmount);
	await tx.wait();

	tx = await erc20A.connect(owner).approve(blasterswapRouterAddress, mintAmount);
	await tx.wait();

	tx = await erc20B.connect(owner).approve(blasterswapRouterAddress, mintAmount);
	await tx.wait();

	tx = await erc20C.connect(owner).approve(blasterswapRouterAddress, mintAmount);
	await tx.wait();

	tx = await erc20D.connect(owner).approve(blasterswapRouterAddress, mintAmount);
	await tx.wait();

	console.log("A token address: ", await erc20A.getAddress());
	console.log("B token address: ", await erc20B.getAddress());
	console.log("C token address: ", await erc20C.getAddress());
	console.log("D token address: ", await erc20D.getAddress());


	tx = await factory.connect(owner).createPair(await erc20A.getAddress(), await erc20B.getAddress());
	await tx.wait();
	const abPairAddress = await factory.getPair(await erc20A.getAddress(), await erc20B.getAddress());

	tx = await factory.connect(owner).createPair(await erc20B.getAddress(), await erc20C.getAddress());
	await tx.wait();
	const bcPairAddress = await factory.getPair(await erc20B.getAddress(), await erc20C.getAddress());

	tx = await factory.connect(owner).createPair(await erc20C.getAddress(), await erc20D.getAddress());
	await tx.wait();
	const cdPairAddress = await factory.getPair(await erc20C.getAddress(), await erc20D.getAddress());

	tx = await factory.connect(owner).createPair(WETHAddress, await erc20A.getAddress());
	await tx.wait();
	const EthAPairAddress = await factory.getPair(WETHAddress, await erc20A.getAddress());

	console.log("AB Pair: ", abPairAddress);
	console.log("BC Pair: ", bcPairAddress);
	console.log("CD Pair: ", cdPairAddress);
	console.log("ETHA Pair: ", EthAPairAddress);

	const currentBlockTime = Date.now()
	const deadline = currentBlockTime - 10000000;

	const atokenAmountForWETHAPair = BigInt(3000) * BigInt(10 ** 18);
	const wethAmountForWETHAPair = ethers.parseEther("1");

	const atokenAmountForAB = mintAmount / BigInt(2);
	const btokenAmountForAB = mintAmount / BigInt(4);

	const btokenAmountForBC = mintAmount / BigInt(2);
	const ctokenAmountForBC = mintAmount / BigInt(5);

	const ctokenAmountForCD = mintAmount / BigInt(5);
	const dtokenAmountForCD = mintAmount / BigInt(2);

	console.log("");
	console.log(`Adding liquidity to AB pair:
		${atokenAmountForAB} of A token
		${btokenAmountForAB} of B token`);
	console.log("");
	console.log(`Adding liquidity to BC pair:
		${btokenAmountForBC} of B token
		${ctokenAmountForBC} of C token`);
	console.log("");
	console.log(`Adding liquidity to CD pair:
		${ctokenAmountForCD} of C token
		${dtokenAmountForCD} of D token`);
	console.log("");


	const ATokenAddress = await erc20A.getAddress();
	const BTokenAddress = await erc20B.getAddress();
	const CTokenAddress = await erc20C.getAddress();
	const DTokenAddress = await erc20D.getAddress();
	// AB Pair: 0x5f81779dDa7b4DF02710882482FF58C550a84C20
	// BC Pair: 0xDfdde9BE50323Ea4d892f26D46cdFD9734f712b9
	// CD Pair: 0xcEe5b099D7f9e3D0fA1b081cB3393CD8c6238a23

	console.log("");
	console.log("Atoken address: ", ATokenAddress);
	console.log("Btoken address: ", BTokenAddress);
	console.log("Ctoken address: ", CTokenAddress);
	console.log("Dtoken address: ", DTokenAddress);
	console.log("");


	tx = await router.connect(owner).addLiquidity(
		BTokenAddress,
		ATokenAddress,
		btokenAmountForAB, atokenAmountForAB,
		btokenAmountForAB, atokenAmountForAB,
		owner.address,
		deadline
	);
	await tx.wait();

	tx = await router.connect(owner).addLiquidity(
		BTokenAddress,
		CTokenAddress,
		btokenAmountForBC, btokenAmountForBC,
		ctokenAmountForBC, ctokenAmountForBC,
		owner.address,
		deadline
	);
	await tx.wait();

	tx = await router.connect(owner).addLiquidity(
		CTokenAddress,
		DTokenAddress,
		ctokenAmountForCD, dtokenAmountForCD,
		ctokenAmountForCD, dtokenAmountForCD,
		owner.address,
		deadline
	);
	await tx.wait();

	tx = await router.connect(owner).addLiquidityETH(
		ATokenAddress,
		atokenAmountForWETHAPair, atokenAmountForWETHAPair,
		wethAmountForWETHAPair,
		owner.address,
		deadline,
		{
			value: wethAmountForWETHAPair
		}
	);
	await tx.wait();


	const ethUSDAPair = await ethers.getContractAt("BlasterswapV2Pair", EthAPairAddress);

	const ethUsdAReserves = await ethUSDAPair.getReserves();

	console.log("ethUsdAReserves.WETH:", ethUsdAReserves._reserve0.toString())
	console.log("ethUsdAReserves.USDA:", ethUsdAReserves._reserve1.toString())


}

deployUniAndPair();
