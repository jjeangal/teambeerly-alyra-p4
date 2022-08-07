import {
  Box,
  Text,
  Image,
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
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import Layout from "../../components/Layout/Layout";
import { networkCurrency } from "../../context/constants";
import { MarketPlaceContext } from "../../context/MarketPlaceContext";
import { stripAddress } from "../../services/utils";

type TokenMetadata = {
  image: string;
  name: string;
  date: number;
  description: string;
  attributes?: any[];
  compiler?: string;
  dna?: string;
  edition?: number;
};

const IPFSUrl = "https://cf-ipfs.com/ipfs";

// TODO: Fetch infos from the contract
const owner = "0x3D590DFe57886728810819feFbb9219f4A847c0d";

export default function Token() {
  const router = useRouter();
  const { params } = router.query;
  const { marketPlaceContractAsSigner, blyTokenContractAsSigner } =
    useContext(MarketPlaceContext);
  const [sucessPayment, setSucessPayment] = useState(false);

  const [tokenJson, setTokenJson] = useState<TokenMetadata>();

  let tokenSellingPrice;

  const setTokenSellingPrice = async () => {
    tokenSellingPrice = await marketPlaceContractAsSigner.getTotalPrice(params);
  };
  setTokenSellingPrice();

  const getToken = async function (params: any) {
    const collectionCIDJson = params[0];
    const tokenId = params[1];
    try {
      const fetchResponse = await fetch(
        `${IPFSUrl}/${collectionCIDJson}/${tokenId}.json`
      );
      if (fetchResponse.ok) {
        const tokenMetaData = await fetchResponse.json();
        setTokenJson(tokenMetaData);
      } else {
        alert("HTTP-Error: " + fetchResponse.status);
      }
    } catch (error) {
      console.log("Error when fetching token metadata : ", error);
    }
  };

  const getImageUrl = (ipfsUrl: string): string => {
    return ipfsUrl.replace("ipfs:/", `${IPFSUrl}`);
  };

  const getTokenCreateDate = (date: number): string => {
    const localDate = new Date(date).toLocaleDateString();
    return `Created the ${localDate}`;
  };

  const buyNFT = async () => {
    try {
      const price = ethers.utils.parseUnits(
        blyTokenContractAsSigner.price.toString(),
        "ether"
      );
      const transaction = await marketPlaceContractAsSigner.purchaseItem(
        params,
        { value: price }
      );
      await transaction.wait();
    } catch (error) {
      console.log("Error when purchasing item: ", error);
    }
  };

  useEffect(() => {
    if (params) {
      getToken(params);
    }
  }, [params]);

  return (
    <>
      <Layout>
        {tokenJson ? (
          <chakra.span p={"4em"}>
            <HStack spacing={"2em"}>
              <Box boxSize="lg">
                <Image
                  borderRadius="xl"
                  objectFit="fill"
                  src={getImageUrl(tokenJson.image)}
                ></Image>
              </Box>
              <Box boxSize="lg">
                <VStack align={"left"}>
                  {/* TODO: put link to the collection */}
                  <Text>[Collection's name]</Text>
                  <Text fontSize={"20px"} fontWeight={"bold"}>
                    {tokenJson.name}
                  </Text>
                  <chakra.span>
                    Owned by
                    <Text fontWeight={"bold"} display={"inline"}>
                      {" " + stripAddress(owner)}
                    </Text>
                  </chakra.span>
                  <Box mb={"20px"}>Description : {tokenJson.description}</Box>
                </VStack>
                <Text fontSize={"30px"} mt={"1em"} whiteSpace={"nowrap"}>
                  Price : {tokenSellingPrice + " " + networkCurrency}
                </Text>
                <Button
                  colorScheme={"purple"}
                  w={"80px"}
                  h={"45px"}
                  mt={"1em"}
                  backgroundColor={"purple.700"}
                >
                  <Text fontSize={"20px"}>Buy</Text>
                </Button>
              </Box>
            </HStack>

            {tokenJson.attributes && (
              <Box boxSize="lg">
                <Heading as="h3" size="md" mb={"10px"}>
                  Attributes
                </Heading>
                <TableContainer
                  w="full"
                  border={"1px"}
                  borderColor="gray.200"
                  rounded="lg"
                >
                  <Table variant="striped" size={"lg"}>
                    <Thead>
                      <Tr>
                        <Th textAlign={"center"}>Name</Th>
                        <Th textAlign={"center"}>Value</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {tokenJson.attributes.map((attr, index) => (
                        <Tr key={index}>
                          <Td textAlign={"center"} textTransform={"capitalize"}>
                            {attr.trait_type}
                          </Td>
                          <Td textAlign={"center"} textTransform={"capitalize"}>
                            {attr.value}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </chakra.span>
        ) : (
          <Center>
            <Spinner />
          </Center>
        )}
      </Layout>
    </>
  );
}
