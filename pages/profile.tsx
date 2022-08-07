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
import CardLg from "../components/cards/Card-lg";
import Layout from "../components/Layout/Layout";
import { MarketPlaceContext } from "../context/MarketPlaceContext";
import { getIPFSImageUrl, ipfsInfura } from "../services/ipfs.service";
import { getAvatar } from "../services/utils";

export default function Profile() {
  const address = useAddress() || "";
  const signer = useSigner();
  const [balance, setBalance] = useState("");
  const [collections, setCollections] = useState<any[]>([]);
  const { hasCopied, onCopy } = useClipboard(address);

  const { factoryContractAsSigner } = useContext(MarketPlaceContext);

  const getOwnerCollections = async (ownerAddress: string) => {
    try {
      const ownerCollections =
        await factoryContractAsSigner.getCollectionsOfOwner(ownerAddress);
      return Promise.resolve(ownerCollections);
    } catch (error) {
      console.log("Error when fetching owner collections : ", error);
      return Promise.reject(error);
    }
  };

  const getOwnerCollectionsMetaData = async (ownerCollections: string[]) => {
    const requests: Promise<any>[] = [];

    ownerCollections.forEach((ownerCollection: string) => {
      requests.push(
        factoryContractAsSigner.getCollectionBaseUri(ownerCollection)
      );
    });

    try {
      const ownerCollectionsMetaData = await Promise.all(requests);
      return Promise.resolve(ownerCollectionsMetaData);
    } catch (error) {
      console.log("Error when fetching owner collection CID : ", error);
      return Promise.reject(error);
    }
  };

  const getOwnerCollectionsJson = async (ownerCollectionsJsonCid: string[]) => {
    const requests: Promise<any>[] = [];

    ownerCollectionsJsonCid.forEach((collectionCid: string) => {
      requests.push(fetch(`${ipfsInfura}/${collectionCid}/_metadata.json`));
    });

    try {
      const ownerCollectionsJson = await Promise.all(requests).then(
        async (res) => {
          return Promise.all(res.map(async (data) => await data.json()));
        }
      );
      return Promise.resolve(ownerCollectionsJson);
    } catch (error) {
      console.log("Error when fetching owner collection CID : ", error);
      return Promise.reject(error);
    }
  };

  const testCID = "QmPLNFPhYSMjRZPgEuYEvBEcFvg525aDsPKFnZTP2DjMTE";

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
        const ownerCollections = await getOwnerCollections(address);

        console.log("ownerCollections", ownerCollections);
        const allJsonCIDs = await getOwnerCollectionsMetaData(ownerCollections);
        console.log("allJsonCIDs", allJsonCIDs);
        const allCollections = await getOwnerCollectionsJson(allJsonCIDs);
        console.log("allCollections", allCollections);

        allCollections.map((col, index) => {
          col.address = ownerCollections[index];
          return col;
        });
        setCollections(allCollections);
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
                {collections.length + " "}
                collection(s)
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

          {collections.length > 0 && (
            <Flex
              columnGap={"2em"}
              rowGap={"3em"}
              mt={"4em"}
              flexWrap={"wrap"}
              justifyContent={"center"}
            >
              {collections.map((collection, index) => (
                <CardLg
                  collectionInfos={collection}
                  key={index}
                  viewOwner={false}
                ></CardLg>
              ))}
            </Flex>
          )}
        </>
      ) : (
        <Container w={"full"} centerContent>
          You are not connected
        </Container>
      )}
    </Layout>
  );
}
