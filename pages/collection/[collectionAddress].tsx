import {
  Box,
  Text,
  Image,
  Flex,
  SimpleGrid,
  GridItem,
  HStack,
  chakra,
  VStack,
  Button,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Heading,
  Center,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { getJsonWalletAddress } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { factoryAddress } from "../../context/constants";
import { MarketPlaceContext } from "../../context/MarketPlaceContext";
import { ipfsInfura } from "../../services/ipfs.service";
import { stripAddress } from "../../services/utils";

export default function Collection() {
  const router = useRouter();
  const { collectionAddress } = router.query;
  const { factoryContractAsSigner } = useContext(MarketPlaceContext);

  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [owner, setOwner] = useState("");
  const [name, setName] = useState("");
  const [items, setItems] = useState([]);

  const getCollectionCID = async (collectionAddress: any) => {
    try {
      const baseUri = await factoryContractAsSigner.getCollectionBaseUri(
        collectionAddress
      );
      return Promise.resolve(baseUri);
    } catch (error) {
      console.log("Error when fetching token metadata : ", error);
      return Promise.reject(error);
    }
  };

  const getCollection = async (collectionCid: any) => {
    try {
      const fetchResponse = await fetch(
        `${ipfsInfura}/${collectionCid}/_metadata.json`
      );
      if (fetchResponse.ok) {
        const collectionMetaData = await fetchResponse.json();
        return Promise.resolve(collectionMetaData);
      } else {
        alert("HTTP-Error: " + fetchResponse.status);
      }
    } catch (error) {
      console.log("Error when fetching token metadata : ", error);
      return Promise.reject(error);
    }
  };

  const getOwnerOfCollection = async (collectionAddress: any) => {
    try {
      const eventFilter = factoryContractAsSigner.filters.CollectionCreated();
      const events = await factoryContractAsSigner.queryFilter(eventFilter);
      let owner = factoryAddress;
      events.forEach((element: any) => {
        if (element.args._collectionAddress == collectionAddress) {
          owner = element.args._owner;
        }
      });
      return owner;
    } catch (error) {
      console.log("Error when fetching collection owner : ", error);
      return Promise.reject(error);
    }
  };

  useEffect(() => {
    if (collectionAddress) {
      (async () => {
        const collectionCID = await getCollectionCID(collectionAddress);
        const collectionMetadata = await getCollection(collectionCID);
        const owner = await getOwnerOfCollection(collectionAddress);
        setOwner(owner);
        setImageUrl(collectionMetadata.image);
        setName(collectionMetadata.name);
        setDescription(collectionMetadata.description);
        setItems(collectionMetadata.items);
      })();
    }
  }, [collectionAddress]);

  return (
    <>
      <Layout>
        <Center>
          <Box boxSize="md">
            <Image src={" " + imageUrl} alt="Collection Image" />
          </Box>
        </Center>
        <br />
        <Flex>
          <Text fontSize={"3xl"} fontWeight={"bold"}>
            Name:
          </Text>
          <Text fontSize={"3xl"}>{" " + name}</Text>
        </Flex>
        <Flex>
          <Text fontSize={"3xl"} fontWeight={"bold"}>
            Owner:
          </Text>
          <Text fontSize={"3xl"}>{" " + owner}</Text>
        </Flex>
        <Flex>
          <Text fontSize={"3xl"} fontWeight={"bold"}>
            Description:
          </Text>
          <Text fontSize={"3xl"}>{" " + description}</Text>
        </Flex>
        <Flex>
          <Text fontSize={"3xl"} fontWeight={"bold"}>
            Collection Address:
          </Text>
          <Text fontSize={"3xl"}>{collectionAddress}</Text>
        </Flex>
        <br />
        <SimpleGrid columns={3}>
          {items.map((item: any) => (
            <Stack key={item.name} boxSize="sm">
              <Image src={item.image} alt="Token Image" />
              <Center>
                <Text>{item.name}</Text>
              </Center>
            </Stack>
          ))}
        </SimpleGrid>
      </Layout>
    </>
  );
}
