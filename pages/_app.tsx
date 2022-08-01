import { AppProps } from "next/app";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import { ChakraProvider } from "@chakra-ui/react";
import "swiper/css/bundle";
import "../styles/globals.scss";
import { MarketPlaceProvider } from "../context/MarketPlaceContext";

const desiredChainId = ChainId.Rinkeby;

export default function OpenBatch({ Component, pageProps }: AppProps) {
  return (
    <MarketPlaceProvider>
      <ThirdwebProvider desiredChainId={desiredChainId}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </ThirdwebProvider>
    </MarketPlaceProvider>
  );
}
