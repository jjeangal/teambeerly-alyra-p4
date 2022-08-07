import { createContext, ReactNode, useEffect, useState } from "react";
import { Contract, ethers } from "ethers";

import {
  factoryAddress,
  factoryAddressAbi,
  networkCurrency,
} from "./constants";

type FactoryContextValues = {
  factoryContract: any;
  factoryContractAsSigner: any;
  networkCurrency: string;
};

export const FactoryContext = createContext<FactoryContextValues>({
  factoryContract: {} as Contract,
  factoryContractAsSigner: {} as Contract,
  networkCurrency,
});

export const FactoryProvider = ({ children }: { children: ReactNode }) => {
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
    <FactoryContext.Provider
      value={{
        factoryContract,
        factoryContractAsSigner,
        networkCurrency,
      }}
    >
      {children}
    </FactoryContext.Provider>
  );
};
