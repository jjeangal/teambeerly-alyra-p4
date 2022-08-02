import { AppProps } from "next/app";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import { ChakraProvider } from "@chakra-ui/react";
import "swiper/css/bundle";
import "../styles/globals.scss";
import { MarketPlaceProvider } from "../context/MarketPlaceContext";

const desiredChainId = ChainId.Hardhat;

const localRPCChainId = 1337;

export default function OpenBatch({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      supportedChains={[localRPCChainId]}
      desiredChainId={localRPCChainId}
      chainRpc={{ [localRPCChainId]: "http://127.0.0.1:8545" }}
      sdkOptions={{
        gasSettings: { maxPriceInGwei: 500, speed: "fast" },
        readonlySettings: {
          chainId: localRPCChainId,
          rpcUrl: "http://127.0.0.1:8545",
        },
      }}
    >
      <MarketPlaceProvider>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </MarketPlaceProvider>
    </ThirdwebProvider>
  );
}
