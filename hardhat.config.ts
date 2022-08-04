import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
require("dotenv").config();

const rinkebyPrivateKey = process.env.RINKEBY_PRIVATE_KEY || "";

const config: HardhatUserConfig = {
    solidity: "0.8.14",
    networks: {
        hardhat: {
            chainId: 31337,
            initialBaseFeePerGas: 0,
        },
        rinkeby: {
            url: "https://eth-rinkeby.alchemyapi.io/v2/123abc123abc123abc123abc123abcde",
            accounts: [rinkebyPrivateKey],
        },
    },
    paths: {
        sources: "./contracts",
        artifacts: "./artifacts",
        cache: "./cache",
        tests: "./test",
    },
};

export default config;
