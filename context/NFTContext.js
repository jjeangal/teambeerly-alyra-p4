import React, { useState, useEffect } from "react";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import axios from "axios";
import { create as ipfsHttpsClient } from "ifps-http-client";

import {
  MarketplaceAddress,
  MarketplaceAddressAbi,
  NFTAddress,
  NFTAddressAbi,
} from "./constants";

const client = ifpsHttpClient("https:/ifps.infura.io:5001/api/v0");

export const NFTContext = React.createContext();
export const NFTProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const nftCurrency = "ETH";

  // const checkIfWalletIsConnected = async () => {
  //     if(!window.ethereum) return alert('Please install a wallet (Metamask is the most common');

  //     const accounts = await window.ethereum.request({method: 'eth_accounts'});

  //     if(accounts.length) {
  //         setCurrentAccount(accounts[0]);
  //     }
  // }

  const uploadToIPFS = async (file, setFileUrl) => {
    try {
      const added = await client.add({ content: file });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      return url;
    } catch (error) {
      console.log("Error when uploading file to IPFS");
    }
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
