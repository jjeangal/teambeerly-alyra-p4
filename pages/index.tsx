import {
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
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import Link from "next/link";
import CardLg from "../components/cards/Card-lg";
import Layout from "../components/Layout/Layout";
import styles from "../styles/Home.module.scss";

export default function Home() {
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

          <Wrap mb={"5em"} py={5} spacing="50px" justify="center">
            <WrapItem>
              <CardLg></CardLg>
            </WrapItem>
            <WrapItem>
              <CardLg></CardLg>
            </WrapItem>
            <WrapItem>
              <CardLg></CardLg>
            </WrapItem>
          </Wrap>

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
