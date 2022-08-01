import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
// import fs from 'fs';

// const privateKey1 = fs.readFileSync('.secret').toString().trim();

const config: HardhatUserConfig = {
    solidity: "0.8.14",
    // networks:{
    //     hardhat: {
    //         chainId: 1337,
    //     },
    //     rinkeby: {
    //         url: "https://eth-rinkeby.alchemyapi.io/v2/123abc123abc123abc123abc123abcde",
    //         accounts: [privateKey1]
    //     }
    // },
    // paths: {
    //     sources: "./contracts",
    //     artifacts: "./artifacts",
    //     cache: "./cache",
    //     tests: "./test",
    // },
};

export default config;
