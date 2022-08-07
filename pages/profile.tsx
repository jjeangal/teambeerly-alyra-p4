import { useStatStyles } from "@chakra-ui/react";
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
import { useContext, useEffect, useState } from "react";
import { getIPFSImageUrl } from "../services/ipfs.service";
import { getAvatar } from "../services/utils";

import CardLg from "../components/cards/Card-lg";
import Layout from "../components/Layout/Layout";
import { MarketPlaceContext } from "../context/MarketPlaceContext";

export default function Profile() {
  const address = useAddress() || "";
  const signer = useSigner();
  const [balance, setBalance] = useState("");
  const [listedItems, setListedItems] = useState();
  const { hasCopied, onCopy } = useClipboard(address);

  const testCID = "QmPLNFPhYSMjRZPgEuYEvBEcFvg525aDsPKFnZTP2DjMTE";

  const { marketPlaceContract, marketPlaceContractAsSigner } =
    useContext(MarketPlaceContext);

  const getAccountItemsOnMarketplace = async () => {
    const items = await marketPlaceContractAsSigner.fetchSales();
    setListedItems(items);
  };

  const userCollections = [
    {
      imageUrl: getIPFSImageUrl(testCID, "15.png"),
    },
    {
      imageUrl: getIPFSImageUrl(testCID, "16.png"),
    },
    {
      imageUrl: getIPFSImageUrl(testCID, "17.png"),
    },
    {
      imageUrl: getIPFSImageUrl(testCID, "18.png"),
    },
    {
      imageUrl: getIPFSImageUrl(testCID, "15.png"),
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
        <>
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
          </Container>
          <Flex
            columnGap={"2em"}
            rowGap={"3em"}
            mt={"4em"}
            flexWrap={"wrap"}
            justifyContent={"flex-start"}
          >
            {userCollections.map((collection, index) => (
              <CardLg
                key={index}
                imageUrl={collection.imageUrl}
                viewOwner={false}
              ></CardLg>
            ))}
          </Flex>
        </>
      ) : (
        <Container w={"full"} centerContent>
          You are not connected
        </Container>
      )}
    </Layout>
  );
}
