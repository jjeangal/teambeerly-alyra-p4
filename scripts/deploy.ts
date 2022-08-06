import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    //Deploy Info
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    // NFT contract
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy();
    await nft.deployed();
    console.log("Contract NFT deployed to:", nft.address);

    // Marketplace contract
    const Marketplace = await ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy(1);
    await marketplace.deployed();
    console.log("Contract Marketplace deployed to:", marketplace.address);

    //Factory contract
    const Factory = await ethers.getContractFactory("NFTFactory");
    const factory = await Factory.deploy();
    await factory.deployed();
    console.log("Contract Factory deployed to: ", factory.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
