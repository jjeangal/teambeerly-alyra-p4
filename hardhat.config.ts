import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";

const pathEnv =
    process.env.NODE_ENV === "production"
        ? "./.env.production"
        : "./.env.local";

require("dotenv").config({ path: pathEnv });

const rinkebyPrivateKey = process.env.RINKEBY_PRIVATE_KEY || "";
const infuraApiKey = process.env.INFURA_API_KEY || "";

const config: HardhatUserConfig = {
    solidity: "0.8.14",
    networks: {
        hardhat: {
            chainId: 31337,
            initialBaseFeePerGas: 0,
        },
        rinkeby: {
            url: `https://rinkeby.infura.io/v3/${infuraApiKey}`,
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
