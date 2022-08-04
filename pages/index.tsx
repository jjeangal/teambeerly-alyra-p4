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
import { getAvatar, getImageUrl } from "../services/utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { useContext, useEffect } from "react";
import { MarketPlaceContext } from "../context/MarketPlaceContext";

export default function Home() {
  const {
    marketPlaceContract,
    marketPlaceContractAsSigner,
    erc721Contract,
    erc721ContractAsSigner,
  } = useContext(MarketPlaceContext);

  async function getFees() {
    try {
      const marketPlaceFees = await marketPlaceContract.feePercent();
      console.log("marketPlaceFees (Home)", marketPlaceFees);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (marketPlaceContract) {
      console.log(marketPlaceContract);
      getFees();
    }
  }, [marketPlaceContract]);

  const collections = [
    {
      avatar: getAvatar("lorem"),
      imageUrl: getImageUrl("20.png"),
    },
    {
      avatar: getAvatar("ipsum"),
      imageUrl: getImageUrl("21.png"),
    },
    {
      avatar: getAvatar("dolor"),
      imageUrl: getImageUrl("22.png"),
    },
    {
      avatar: getAvatar("amet"),
      imageUrl: getImageUrl("23.png"),
    },
  ];

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
                <a>Explore</a>
              </Button>
            </Link>

            <Link href="/create-collection">
              <Button
                colorScheme={"orange"}
                bg={"orange.400"}
                color={"white"}
                variant="solid"
              >
                <a>Create</a>
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
              {collections.map((collection, index) => (
                <SwiperSlide key={index} className={styles.swiper_slide}>
                  <CardLg
                    avatar={collection.avatar}
                    imageUrl={collection.imageUrl}
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
