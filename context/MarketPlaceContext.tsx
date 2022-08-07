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
  marketPlaceContract: any;
  marketPlaceContractAsSigner: any;
  blyTokenContract: any;
  blyTokenContractAsSigner: any;
  factoryContract: any;
  factoryContractAsSigner: any;
  networkCurrency: string;
};

export const MarketPlaceContext = createContext<MarketPlaceContextValues>({
  marketPlaceContract: {} as Contract,
  marketPlaceContractAsSigner: {} as Contract,
  blyTokenContract: {} as Contract,
  blyTokenContractAsSigner: {} as Contract,
  factoryContract: {} as Contract,
  factoryContractAsSigner: {} as Contract,
  networkCurrency,
});

export const MarketPlaceProvider = ({ children }: { children: ReactNode }) => {
  const [marketPlaceContract, setMarketPlaceContract] = useState<Contract>();
  const [marketPlaceContractAsSigner, setMarketPlaceContractAsSigner] =
    useState<Contract>();

  const [erc721Contract, setErc721Contract] = useState<Contract>();
  const [erc721ContractAsSigner, setErc721ContractAsSigner] =
    useState<Contract>();

  const [factoryContract, setFactoryContract] = useState<Contract>();
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

    const _blyTokenContract = new ethers.Contract(
      blyTokenAddress,
      blyTokenAddressAbi,
      provider
    );
    setErc721Contract(_blyTokenContract);

    const _blyTokenContractAsSigner = new ethers.Contract(
      blyTokenAddress,
      blyTokenAddressAbi,
      provider.getSigner()
    );
    setErc721ContractAsSigner(_blyTokenContractAsSigner);

    const _factoryContract = new ethers.Contract(
      factoryAddress,
      factoryAddressAbi,
      provider
    );
    setFactoryContract(_factoryContract);

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
        marketPlaceContract,
        marketPlaceContractAsSigner,
        blyTokenContract: erc721Contract,
        blyTokenContractAsSigner: erc721ContractAsSigner,
        factoryContract,
        factoryContractAsSigner,
        networkCurrency,
      }}
    >
      {children}
    </MarketPlaceContext.Provider>
  );
};
