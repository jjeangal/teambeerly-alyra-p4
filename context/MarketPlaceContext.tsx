import { createContext, ReactNode, useEffect, useState } from "react";
import { Contract, ethers } from "ethers";

import {
  marketplaceAddress,
  marketplaceAddressAbi,
  erc721Address,
  erc721AddressAbi,
  networkCurrency,
} from "./constants";

type MarketPlaceContextValues = {
  marketPlaceContract: any;
  marketPlaceContractAsSigner: any;
  erc721Contract: any;
  erc721ContractAsSigner: any;
  networkCurrency: string;
};

export const MarketPlaceContext = createContext<MarketPlaceContextValues>({
  marketPlaceContract: {} as Contract,
  marketPlaceContractAsSigner: {} as Contract,
  erc721Contract: {} as Contract,
  erc721ContractAsSigner: {} as Contract,
  networkCurrency,
});

export const MarketPlaceProvider = ({ children }: { children: ReactNode }) => {
  const [marketPlaceContract, setMarketPlaceContract] = useState<Contract>();
  const [marketPlaceContractAsSigner, setMarketPlaceContractAsSigner] =
    useState<Contract>();
  const [erc721Contract, setErc721Contract] = useState<Contract>();
  const [erc721ContractAsSigner, setErc721ContractAsSigner] =
    useState<Contract>();

  useEffect(() => {
    // TODO: Use provider and signer from thirdWeb
    const { ethereum, web3 } = window;
    let provider;

    if (ethereum) {
      provider = new ethers.providers.Web3Provider(ethereum);
    } else if (web3) {
      provider = web3.currentProvider;
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      ); // message d’erreur si le navigateur ne détecte pas Ethereum
    }

    if (!provider) {
      console.error("No web3 provider found");
      return;
    }
    const _marketPlaceContract = new ethers.Contract(
      marketplaceAddress,
      marketplaceAddressAbi,
      provider
    );
    setMarketPlaceContract(_marketPlaceContract);

    const _marketPlaceContractAsSigner = new ethers.Contract(
      marketplaceAddress,
      marketplaceAddressAbi,
      provider.getSigner()
    );
    setMarketPlaceContractAsSigner(_marketPlaceContractAsSigner);

    const _erc721Contract = new ethers.Contract(
      erc721Address,
      erc721AddressAbi,
      provider
    );
    setErc721Contract(_erc721Contract);

    const _erc721ContractAsSigner = new ethers.Contract(
      erc721Address,
      erc721AddressAbi,
      provider.getSigner()
    );
    setErc721ContractAsSigner(_erc721ContractAsSigner);
  }, []);

  return (
    <MarketPlaceContext.Provider
      value={{
        marketPlaceContract,
        marketPlaceContractAsSigner,
        erc721Contract,
        erc721ContractAsSigner,
        networkCurrency,
      }}
    >
      {children}
    </MarketPlaceContext.Provider>
  );
};

// TODO: Put this code into a service in order to call function from
// everywhere we want after app loaded

//Principal function
// export const NFTProvider = ({ children }) => {

//URL to stock the data on IPFS
// const client = ipfsHttpsClient("https:/ifps.infura.io:5001/api/v0");

//   const uploadToIPFS = async (file, setFileUrl) => {
//     try {
//       const added = await client.add({ content: file });
//       const uri = `https://ipfs.infura.io/ipfs/${added.path}`;

//       return uri;
//     } catch (error) {
//       console.log("Error when uploading file to IPFS");
//     }
//   };

//   const createNFT = async (formInput, fileUrl, router) => {
//     const { name, description, price } = formInput;

//     if (!name || !description || !price || !fileUrl) return;
//     try {
//       const data = JSON.stringify({ name, description, image: fileUrl });
//       const added = await client.add(data);

//       await createSale(url, price);
//       router.push("/");
//     } catch (error) {
//       console.log("Error when creating NFT");
//     }
//   };

//   const createSale = async (inputPrice, id) => {
//     const uri = `https://ipfs.infura.io/ipfs/${added.path}`;

//     //mint NFT
//     await (await nft.mint(uri)).wait();

//     //get ID
//     const tokenId = await nft.tokenId();
//     const price = ethers.utils.parseUnits(inputPrice, "ether");

//     const transaction = await nft.mint;
//   };

// };
