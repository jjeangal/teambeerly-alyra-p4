import { createContext, ReactNode, useEffect, useState } from "react";
import { Contract, ethers } from "ethers";
import {
  marketplaceAddress,
  marketplaceAddressAbi,
  blyTokenAddress,
  blyTokenAddressAbi,
  factoryAddress,
  factoryAddressAbi,
  networkCurrency,
} from "./constants";

type MarketPlaceContextValues = {
  marketPlaceContractAsSigner: any;
  blyTokenContractAsSigner: any;
  factoryContractAsSigner: any;
  networkCurrency: string;
};

export const MarketPlaceContext = createContext<MarketPlaceContextValues>({
  marketPlaceContractAsSigner: {} as Contract,
  blyTokenContractAsSigner: {} as Contract,
  factoryContractAsSigner: {} as Contract,
  networkCurrency,
});

export const MarketPlaceProvider = ({ children }: { children: ReactNode }) => {
  const [marketPlaceContractAsSigner, setMarketPlaceContractAsSigner] =
    useState<Contract>();

  const [blyTokenContractAsSigner, setBlyTokenContractAsSigner] =
    useState<Contract>();

  const [factoryContractAsSigner, setFactoryContractAsSigner] =
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

    const _marketPlaceContractAsSigner = new ethers.Contract(
      marketplaceAddress,
      marketplaceAddressAbi,
      provider.getSigner()
    );
    setMarketPlaceContractAsSigner(_marketPlaceContractAsSigner);

    const _blyTokenContractAsSigner = new ethers.Contract(
      blyTokenAddress,
      blyTokenAddressAbi,
      provider.getSigner()
    );
    setBlyTokenContractAsSigner(_blyTokenContractAsSigner);

    const _factoryContractAsSigner = new ethers.Contract(
      factoryAddress,
      factoryAddressAbi,
      provider.getSigner()
    );
    setFactoryContractAsSigner(_factoryContractAsSigner);
  }, []);

  return (
    <MarketPlaceContext.Provider
      value={{
        marketPlaceContractAsSigner,
        blyTokenContractAsSigner,
        factoryContractAsSigner,
        networkCurrency,
      }}
    >
      {children}
    </MarketPlaceContext.Provider>
  );
};
