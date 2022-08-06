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
