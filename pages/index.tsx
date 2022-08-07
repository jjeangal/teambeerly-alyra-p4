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
import { getAvatar } from "../services/utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { useContext, useEffect } from "react";
import { MarketPlaceContext } from "../context/MarketPlaceContext";
import { getIPFSImageUrl } from "../services/ipfs.service";

export default function Home() {
  const { marketPlaceContractAsSigner } = useContext(MarketPlaceContext);

  async function getFees() {
    try {
      const marketPlaceFees = await marketPlaceContractAsSigner.feePercent();
      console.log("marketPlaceFees (Home)", marketPlaceFees);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (marketPlaceContractAsSigner) {
      console.log(marketPlaceContractAsSigner);
      getFees();
    }
  }, [marketPlaceContractAsSigner]);

  const testCID = "QmPLNFPhYSMjRZPgEuYEvBEcFvg525aDsPKFnZTP2DjMTE";

  const collections = [
    {
      owner: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      address: "0x75537828f2ce51be7289709686A69CbFDbB714F1",
      description: "Une jolie description de VTSuccessHyped10",
      external_url:
        "https://ipfs.infura.io/ipfs/QmYuUUZCCCaPHXX3Vfnz9eoFjPvHUsv8tMXp3jB5AyRrmv",
      image:
        "https://ipfs.infura.io/ipfs/QmPaV9jKJEaW9ipvkJr5cNtHwzxXtZmBwdxVQJDcHxsb7j",
      items: [{}, {}],
      name: "VTSuccessHyped10",
    },
    {
      owner: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      address: "0x75537828f2ce51be7289709686A69CbFDbB714F1",
      description: "Une jolie description de VTSuccessHyped10",
      external_url:
        "https://ipfs.infura.io/ipfs/QmYuUUZCCCaPHXX3Vfnz9eoFjPvHUsv8tMXp3jB5AyRrmv",
      image:
        "https://ipfs.infura.io/ipfs/QmPaV9jKJEaW9ipvkJr5cNtHwzxXtZmBwdxVQJDcHxsb7j",
      items: [{}, {}],
      name: "VTSuccessHyped10",
    },
    {
      owner: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      address: "0x75537828f2ce51be7289709686A69CbFDbB714F1",
      description: "Une jolie description de VTSuccessHyped10",
      external_url:
        "https://ipfs.infura.io/ipfs/QmYuUUZCCCaPHXX3Vfnz9eoFjPvHUsv8tMXp3jB5AyRrmv",
      image:
        "https://ipfs.infura.io/ipfs/QmPaV9jKJEaW9ipvkJr5cNtHwzxXtZmBwdxVQJDcHxsb7j",
      items: [{}, {}],
      name: "VTSuccessHyped10",
    },
    {
      owner: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      address: "0x75537828f2ce51be7289709686A69CbFDbB714F1",
      description: "Une jolie description de VTSuccessHyped10",
      external_url:
        "https://ipfs.infura.io/ipfs/QmYuUUZCCCaPHXX3Vfnz9eoFjPvHUsv8tMXp3jB5AyRrmv",
      image:
        "https://ipfs.infura.io/ipfs/QmPaV9jKJEaW9ipvkJr5cNtHwzxXtZmBwdxVQJDcHxsb7j",
      items: [{}, {}],
      name: "VTSuccessHyped10",
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
                Create
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
