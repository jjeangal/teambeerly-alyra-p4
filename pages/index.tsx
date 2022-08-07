import "swiper/css";
import "swiper/css/pagination";
import styles from "../styles/Home.module.scss";
import {
  Box,
  Button,
  Center,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Link from "next/link";
import CardLg from "../components/cards/Card-lg";
import Layout from "../components/Layout/Layout";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { useContext, useEffect, useState } from "react";
import { MarketPlaceContext } from "../context/MarketPlaceContext";
import { getCollection } from "../services/ipfs.service";
import { meta } from "@dicebear/avatars-identicon-sprites";

export default function Home() {
  const { factoryContractAsSigner } = useContext(MarketPlaceContext);
  const [collections, setCollections] = useState<any>([]);

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

  async function getCollectionMetadatas() {
    try {
      const eventFilter = factoryContractAsSigner.filters.CollectionCreated();
      const events = await factoryContractAsSigner.queryFilter(eventFilter);
      let allCollections: any = [];
      for (const element of events) {
        const collectionCid = await getCollectionCID(
          element.args._collectionAddress
        );
        const metadata = await getCollection(collectionCid);
        const collection = {
          owner: element.args._owner,
          address: element.args._collectionAddress,
          description: metadata.description,
          external_url: metadata.external_url,
          image: metadata.image,
          name: metadata.name,
          items: metadata.items,
        };
        allCollections.push(collection);
      }
      return allCollections;
    } catch (error) {
      console.log("Error when fetching collection owner : ", error);
      return Promise.reject(error);
    }
  }

  useEffect(() => {
    if (factoryContractAsSigner) {
      (async () => {
        const collectionMetadatas = await getCollectionMetadatas();
        setCollections(collectionMetadatas);
      })();
    }
  }, [factoryContractAsSigner]);

  return (
    <>
      <Layout>
        <div className={styles.container}>
          <Text fontSize={36} mb={"0.5em"} fontWeight={700}>
            Discover, create, and sell your NFTs collections
          </Text>

          <HStack mb={"5em"} spacing={"5"}>
            <Link href="/search-results">
              <Button
                colorScheme={"purple"}
                bg={"purple.800"}
                color={"white"}
                variant="solid"
              >
                Explore
              </Button>
            </Link>

            <Link href="/create-token">
              <Button
                colorScheme={"orange"}
                bg={"orange.400"}
                color={"white"}
                variant="solid"
              >
                Create Token
              </Button>
            </Link>

            <Link href="/create-collection">
              <Button
                colorScheme={"green"}
                bg={"green.400"}
                color={"white"}
                variant="solid"
              >
                Create Collection
              </Button>
            </Link>
          </HStack>

          <Box mb={"5em"}>
            <Swiper
              slidesPerView={3}
              navigation={true}
              modules={[Navigation]}
              className={styles.swiper}
            >
              {collections &&
                collections.map((collection: any) => (
                  <SwiperSlide
                    key={collection.name}
                    className={styles.swiper_slide}
                  >
                    <CardLg
                      collectionInfos={collection}
                      owner={collection.owner}
                    ></CardLg>
                  </SwiperSlide>
                ))}
            </Swiper>
          </Box>

          <Text mb={"1em"} fontSize={36} fontWeight={700}>
            Top collections
          </Text>

          <Center>
            <TableContainer
              w="full"
              border={"1px"}
              borderColor="gray.200"
              rounded="lg"
            >
              <Table variant="striped" size={"lg"}>
                <Thead>
                  <Tr>
                    <Th textAlign={"center"}>Creator</Th>
                    <Th textAlign={"center"}>Collection</Th>
                    <Th textAlign={"center"}>Sales</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td textAlign={"center"}>Zoonies</Td>
                    <Td textAlign={"center"}>Flowerz</Td>
                    <Td textAlign={"center"}>250</Td>
                  </Tr>
                  <Tr>
                    <Td textAlign={"center"}>0xMulti</Td>
                    <Td textAlign={"center"}>Colorz</Td>
                    <Td textAlign={"center"}>210</Td>
                  </Tr>
                  <Tr>
                    <Td textAlign={"center"}>Mawkzy</Td>
                    <Td textAlign={"center"}>RLmatch</Td>
                    <Td textAlign={"center"}>98</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </Center>
        </div>
      </Layout>
    </>
  );
}
