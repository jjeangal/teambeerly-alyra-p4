import erc721JSon from "./BlyToken.json";
import marketplaceJSon from "./Marketplace.json";
import factoryJSon from "./NFTFactory.json";
import { ChainId } from "@thirdweb-dev/sdk";

//For NFT contract
export const erc721Address = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
export const erc721AddressAbi = erc721JSon.abi;

//For Marketplace contract
export const marketplaceAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
export const marketplaceAddressAbi = marketplaceJSon.abi;

//For FactoryAddress contract
export const factoryAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
export const factoryAddressAbi = factoryJSon.abi;

export const networkCurrency = "ETH";

export const infuraUrl = "ipfs.infura.io";
export const infuraPort = 5001;

export const prodChainId = ChainId.Rinkeby;
export const localChainId = ChainId.Hardhat;
export const localRpcCUrl = "http://127.0.0.1:8545";
