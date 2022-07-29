import {
  Box,
  Button,
  Container,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCoinbaseWallet, useMetamask } from "@thirdweb-dev/react";
import Image from "next/image";

export const ConnectWalletsButtons = () => {
  const connectWithMetamask = useMetamask();
  const connectWithCoinbaseWallet = useCoinbaseWallet();

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
            <Button
              colorScheme="black"
              variant="outline"
              onClick={connectWithMetamask}
            >
              <Image src="/metamask-fox.svg" width={24} height={24} />
              <Text ml={3}>Metamask</Text>
            </Button>
          </Box>
          <Box>
            <Button
              colorScheme="black"
              variant="outline"
              onClick={connectWithCoinbaseWallet}
            >
              <Image src="/coinbase.webp" width={24} height={24} />
              <Text ml={3}>Coinbase</Text>
            </Button>
          </Box>
        </VStack>
      </Container>
    </>
  );
};
