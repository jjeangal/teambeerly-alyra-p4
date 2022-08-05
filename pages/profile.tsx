import { CopyIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Image,
  Spinner,
  Text,
  Tooltip,
  useClipboard,
} from "@chakra-ui/react";
import { useAddress, useSigner } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import Link from "next/link";
import { useEffect, useState } from "react";
import CardLg from "../components/cards/Card-lg";
import Layout from "../components/Layout/Layout";
import { getAvatar, getImageUrl } from "../services/utils";

export default function Profile() {
  const address = useAddress() || "";
  const signer = useSigner();
  const [balance, setBalance] = useState("");
  const { hasCopied, onCopy } = useClipboard(address);

  const userCollections = [
    {
      imageUrl: getImageUrl("5.png"),
    },
    {
      imageUrl: getImageUrl("15.png"),
    },
    {
      imageUrl: getImageUrl("20.png"),
    },
    {
      imageUrl: getImageUrl("8.png"),
    },
  ];

  useEffect(() => {
    if (signer) {
      (async () => {
        const walletBalance = await signer.getBalance();
        const currentBalance = ethers.utils.formatEther(walletBalance);
        setBalance(currentBalance.substring(0, 6));
      })();
    }
  }, [signer]);

  return (
    <Layout>
      {address ? (
        <Container w={"full"} centerContent>
          <Box>
            <Image
              borderRadius="full"
              boxSize="150px"
              src={getAvatar(address)}
              alt="Dan Abramov"
            />
          </Box>
          <HStack align={"baseline"} mt={"2em"}>
            <Text fontFamily={"mono"} fontSize={"16px"}>
              {address}
            </Text>
            <Tooltip
              hasArrow
              label={hasCopied ? "Copied" : "Copy"}
              closeDelay={300}
            >
              <IconButton
                aria-label="Copy address"
                onClick={onCopy}
                icon={<CopyIcon />}
              />
            </Tooltip>
          </HStack>
          <Box mt={"2em"}>
            <Text fontSize={"16px"}>
              {/* TODO: fetch number of collections for the address */}4
              collections
            </Text>
          </Box>
          <Box mt={"2em"}>
            {balance ? (
              <Text fontSize={"16px"}>
                <strong>Balance</strong> : {balance} ETH
              </Text>
            ) : (
              <Spinner />
            )}
          </Box>
          <Box mt={"4em"}>
            <Link href="/create-collection">
              <Button colorScheme={"purple"} bg={"purple.700"}>
                <a>Create new collection</a>
              </Button>
            </Link>
          </Box>

          <Flex gap={"1em"} mt={"4em"}>
            {userCollections.map((collection, index) => (
              <CardLg
                key={index}
                imageUrl={collection.imageUrl}
                viewOwner={false}
              ></CardLg>
            ))}
          </Flex>
        </Container>
      ) : (
        <Container w={"full"} centerContent>
          You are not connected
        </Container>
      )}
    </Layout>
  );
}
