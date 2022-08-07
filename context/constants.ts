import blyJSon from "./BlyToken.json";
import marketplaceJSon from "./Marketplace.json";
import factoryJSon from "./NFTFactory.json";
import { ChainId } from "@thirdweb-dev/sdk";

//For BLY contract
export const blyTokenAddress = "0x13F8c49aA03DCeF7D83775505bbe857916Ba7169";
export const blyTokenAddressAbi = blyJSon.abi;

//For Marketplace contract
export const marketplaceAddress = "0x76E16ABC630d8a95633377CD23fcF6e6eB76452a";
export const marketplaceAddressAbi = marketplaceJSon.abi;

//For FactoryAddress contract
export const factoryAddress = "0xF1e483F3217163e59831C2f9a142f062DE02163F";
export const factoryAddressAbi = factoryJSon.abi;

export const networkCurrency = "ETH";

export const infuraUrl = "ipfs.infura.io";
export const infuraPort = 5001;

export const prodChainId = ChainId.Rinkeby;
export const localChainId = ChainId.Hardhat;
export const localRpcCUrl = "http://127.0.0.1:8545";
