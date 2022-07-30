import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";

const config: HardhatUserConfig = {
    solidity: "0.8.14",
    paths: {
        sources: "./contracts",
        artifacts: "./artifacts",
        cache: "./cache",
        tests: "./test",
    },
};

export default config;
