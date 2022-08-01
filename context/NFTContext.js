import React, { useState, useEffect } from "react";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import axios from "axios";
import { create as ipfsHttpsClient } from "ipfs-http-client";

import {
  MarketplaceAddress,
  MarketplaceAddressAbi,
  NFTAddress,
  NFTAddressAbi,
} from "./constants";

import { fetchContractMetadata } from "@thirdweb-dev/sdk";

//URL to stock the data on IPFS
const client = ifpsHttpClient("https:/ifps.infura.io:5001/api/v0");

export const NFTContext = React.createContext();

//Principal function
export const NFTProvider = ({ children }) => {
  //to keep track of loading web3
  const [loading, setLoading] = useState(true);

  //Keep copies of contracts everywhere on the Dapp
  const [nft, setNFT] = useState({});
  const [marketplace, setMarketplace] = useState({});
  const nftCurrency = "ETH";

  const web3Handler = async () => {
    //Get signer info
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    //Deploy copies of contract and keep it on a useState
    const marketplace = new ethers.Contract(
      MarketplaceAddress,
      MarketplaceAddressAbi,
      signer
    );
    setMarketplace(marketplace);
    const nft = new ethers.Contract(NFTAddress, NFTAddressAbi, signer);
    setNFT(nft);

    //End of loading Web3
    setLoading(false);
  };

  const uploadToIPFS = async (file, setFileUrl) => {
    try {
      const added = await client.add({ content: file });
      const uri = `https://ipfs.infura.io/ipfs/${added.path}`;

      return uri;
    } catch (error) {
      console.log("Error when uploading file to IPFS");
    }
  };

  const createNFT = async (formInput, fileUrl, router) => {
    const { name, description, price } = formInput;

    if (!name || !description || !price || !fileUrl) return;
    try {
      const data = JSON.stringify({ name, description, image: fileUrl });
      const added = await client.add(data);

      await createSale(url, price);
      router.push("/");
    } catch (error) {
      console.log("Error when creating NFT");
    }
  };

  const createSale = async (inputPrice, id) => {
    const uri = `https://ipfs.infura.io/ipfs/${added.path}`;

    //mint NFT
    await (await nft.mint(uri)).wait();

    //get ID
    const tokenId = await nft.tokenId();
    const price = ethers.utils.parseUnits(inputPrice, "ether");

    const transaction = await nft.mint;
  };

  // useEffect(()=>{
  //     checkIfWalletIsConnected();
  // }, []);

  return (
    <NFTContext.Provider value={[nftCurrency, uploadToIPFS]}>
      {children}
    </NFTContext.Provider>
  );
};
