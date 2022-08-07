import { CopyIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Image,
  list,
  Spinner,
  Text,
  Tooltip,
  useClipboard,
} from "@chakra-ui/react";
import { useAddress, useSigner } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import CardItem from "../components/cards/Card-item";

import CardLg from "../components/cards/Card-lg";
import Layout from "../components/Layout/Layout";
import { MarketPlaceContext } from "../context/MarketPlaceContext";
import { ipfsInfura } from "../services/ipfs.service";
import { getAvatar } from "../services/utils";

export default function Profile() {
  const address = useAddress() || "";
  const signer = useSigner();
  const [balance, setBalance] = useState("");
  const [ownedItems, setOwnedItems] = useState<any[]>([]);
  const [allItems, setAllItems] = useState<any[]>([]);
  const { hasCopied, onCopy } = useClipboard(address);

  const { factoryContractAsSigner } = useContext(MarketPlaceContext);
  const { marketPlaceContractAsSigner } = useContext(MarketPlaceContext);

  //Simple NFT:

  //Get the NFT by the owner
  const getNFTByOwner = async () => {
    const nfts = await marketPlaceContractAsSigner.fetchSales(address);
    setOwnedItems(nfts);
  };

  //Collections:
  //Get the collection of the owner
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

  //Get metadata of the collections
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

  useEffect(() => {
    if (signer) {
      (async () => {
        // Get balance
        const walletBalance = await signer.getBalance();
        const currentBalance = ethers.utils.formatEther(walletBalance);
        setBalance(currentBalance.substring(0, 6));

        // Get collections addresses
        const ownerCollections = await getOwnerCollections(address);
        console.log("ownerCollections", ownerCollections);

        // Get collections CID
        const allJsonCIDs = await getOwnerCollectionsMetaData(ownerCollections);
        console.log("allJsonCIDs", allJsonCIDs);

        // Get collections Metadatas
        const allCollections = await getOwnerCollectionsJson(allJsonCIDs);

        //Get NFT

        const _allItems: any[] = [];
        allCollections.forEach((col, collectionIndex) => {
          col.items.forEach((item: any, itemIndex: number) => {
            item.collectionAddress = ownerCollections[collectionIndex];
            item.collectionName = col.name;
            item.collectionCID = allJsonCIDs[collectionIndex];
            item.index = itemIndex;
            _allItems.push(item);
          });
        });
        console.log("_allItems", _allItems);
        setAllItems(_allItems);
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
                {allItems.length + " "}
                items(s)
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

          {allItems.length > 0 && (
            <Flex
              columnGap={"2em"}
              rowGap={"3em"}
              mt={"4em"}
              flexWrap={"wrap"}
              justifyContent={"center"}
            >
              {allItems.map((item: any, itemIndex: number) => (
                <CardItem key={itemIndex} itemInfos={item}></CardItem>
              ))}
            </Flex>
          )}
          {ownedItems.length > 0 && (
            <Flex
              columnGap={"2em"}
              rowGap={"3em"}
              mt={"4em"}
              flexWrap={"wrap"}
              justifyContent={"center"}
            >
              {ownedItems.map((item: any, itemIndex: number) => (
                <CardItem key={itemIndex} itemInfos={item}></CardItem>
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
