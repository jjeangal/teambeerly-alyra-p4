import "swiper/css/bundle";
import "../styles/globals.scss";
import { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MarketPlaceProvider } from "../context/MarketPlaceContext";
import { localChainId, localRpcCUrl, prodChainId } from "../context/constants";

// TODO: use ENV variable to switch between local and prod
const useLocalRPC = true;

const desiredChainId = useLocalRPC ? localChainId : prodChainId;

export default function OpenBatch({ Component, pageProps }: AppProps) {
  if (useLocalRPC) {
    return (
      <ThirdwebProvider
        desiredChainId={desiredChainId}
        chainRpc={{ [desiredChainId]: localRpcCUrl }}
        sdkOptions={{
          readonlySettings: {
            chainId: desiredChainId,
            rpcUrl: localRpcCUrl,
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

  return (
    <ThirdwebProvider desiredChainId={desiredChainId}>
      <MarketPlaceProvider>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </MarketPlaceProvider>
    </ThirdwebProvider>
  );
}
