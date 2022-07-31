import { AppProps } from "next/app";
import { ThirdwebProvider, ThirdwebSDK, ChainId } from "@thirdweb-dev/react";
import { ChakraProvider } from "@chakra-ui/react";
import "swiper/css/bundle";
import "../styles/globals.scss";
import React from "react";
import web3Handler from "../services/web3Handler";

const desiredChainId = ChainId.Rinkeby;
const sdk = new ThirdwebSDK("Rinkeby");

export default function OpenBatch({ Component, pageProps }: AppProps) {
  const getContract = async () => {
    const NFT = sdk.getContract("0x5fbdb2315678afecb367f032d93f642f64180aa3");
    const Marketplace = sdk.getContract(
      "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"
    );
  };

  return (
    <ThirdwebProvider desiredChainId={desiredChainId}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ThirdwebProvider>
  );
}
