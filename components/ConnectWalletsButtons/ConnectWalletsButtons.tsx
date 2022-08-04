import {
  Box,
  Button,
  Container,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  useCoinbaseWallet,
  useMetamask,
  useWalletConnect,
} from "@thirdweb-dev/react";
import Image from "next/image";

type SidebarProps = {
  connectedEvent: any;
};

export const ConnectWalletsButtons = ({ connectedEvent }: SidebarProps) => {
  const connectWithMetamask = useMetamask();
  const connectWithCoinbaseWallet = useCoinbaseWallet();
  const connectWithWalletConnect = useWalletConnect();

  function connectMM() {
    connectWithMetamask()
      .then(() => {
        connectedEvent();
      })
      .catch(console.log);
  }

  function connectCoinbase() {
    connectWithCoinbaseWallet()
      .then(() => {
        connectedEvent();
      })
      .catch(console.log);
  }

  function connectWalletConnect() {
    connectWithWalletConnect()
      .then(() => {
        connectedEvent();
      })
      .catch(console.log);
  }

  return (
    <>
      <Container centerContent>
        <Text fontSize="2xl" mb={"10"} mt={5}>
          Connect your wallet
        </Text>
        <VStack
          divider={<StackDivider borderColor="gray.200" />}
          spacing={4}
          align="center"
        >
          <Box>
            <Button colorScheme="black" variant="outline" onClick={connectMM}>
              <Image
                src="/metamask-fox.svg"
                width={24}
                height={24}
                alt="Metamask icon"
              />
              <Text ml={3}>Metamask</Text>
            </Button>
          </Box>
          <Box>
            <Button
              colorScheme="black"
              variant="outline"
              onClick={connectCoinbase}
            >
              <Image
                src="/coinbase.webp"
                width={24}
                height={24}
                alt="Coinbase icon"
              />
              <Text ml={3}>Coinbase</Text>
            </Button>
          </Box>
          <Box>
            <Button
              colorScheme="black"
              variant="outline"
              onClick={connectWalletConnect}
            >
              <Image
                src="/walletconnect.png"
                width={24}
                height={24}
                alt="WalletConnect icon"
              />
              <Text ml={3}>WalletConnect</Text>
            </Button>
          </Box>
        </VStack>
      </Container>
    </>
  );
};
