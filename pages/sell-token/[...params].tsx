import {
  Box,
  Text,
  Image,
  HStack,
  VStack,
  Center,
  Spinner,
  FormControl,
  FormLabel,
  Input,
  InputRightAddon,
  InputGroup,
  Divider,
  Container,
  Skeleton,
  Heading,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { MarketPlaceContext } from "../../context/MarketPlaceContext";
import {
  getIPFSImageUrl,
  getToken,
  ipfsGateway,
} from "../../services/ipfs.service";

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

// TODO: Fetch infos from the contract
const owner = "0x3D590DFe57886728810819feFbb9219f4A847c0d";

export default function SellToken() {
  const router = useRouter();
  const { params } = router.query;

  const { marketPlaceContractAsSigner } = useContext(MarketPlaceContext);

  const [imageLoaded, setImageLoaded] = useState(false);

  const [tokenJson, setTokenJson] = useState<TokenMetadata>();
  const [marketPlaceFees, setMarketPlaceFees] = useState<number>();
  const [quantity, setQuantity] = useState<string>("1");
  const [price, setPrice] = useState<string>("0");

  const getImageUrl = (ipfsUrl: string): string => {
    return ipfsUrl.replace("ipfs:/", `${ipfsGateway}`);
  };

  const handleImageLoaded = (): void => {
    setImageLoaded(true);
  };

  useEffect(() => {
    if (params && params.length > 0) {
      (async () => {
        const token = await getToken(params);
        setTokenJson(token);
        const _marketPlaceFees = await marketPlaceContractAsSigner.feePercent();
        setMarketPlaceFees(_marketPlaceFees.toString());
      })();
    }
  }, [params]);
  4;

  const sellItem = async () => {
    try {
      await marketPlaceContractAsSigner.createMarketItem("eer", price);
    } catch (error) {
      console.log("Error when selling item: ", error);
    }
  };

  return (
    <>
      <Layout>
        {tokenJson ? (
          <>
            <Container>
              <Heading>List item for sale</Heading>
              <HStack spacing={"4em"}>
                <VStack justifyContent={"flex-start"}>
                  <Box w={"350px"}>
                    <Box w={"full"}>
                      <FormControl>
                        <FormLabel>Quantity</FormLabel>
                        <Input
                          type="text"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                        />
                      </FormControl>
                    </Box>
                    <Box mt={"2em"} w={"full"}>
                      <FormControl>
                        <FormLabel>Price par unit</FormLabel>
                        <InputGroup>
                          <Input
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                          />
                          <InputRightAddon children="ETH" />
                        </InputGroup>
                      </FormControl>
                    </Box>
                    <Divider />
                    <Box mt={"2em"} w={"full"}>
                      <Text>Plateform service fee : {marketPlaceFees} %</Text>
                    </Box>
                    <Box mt={"2em"} w={"full"}>
                      <Button
                        colorScheme={"purple"}
                        bg={"purple.800"}
                        color={"white"}
                        variant="solid"
                      >
                        Complete listing
                      </Button>
                    </Box>
                  </Box>
                </VStack>
                <VStack>
                  <Box mt={"2em"} w={"350px"}>
                    <Image
                      w="full"
                      h={"350px"}
                      borderRadius="lg"
                      fit="cover"
                      src={getImageUrl(tokenJson.image)}
                      alt="item"
                      onLoad={handleImageLoaded}
                      fallback={
                        <Skeleton h={"350px"} isLoaded={!imageLoaded} />
                      }
                    />
                  </Box>
                </VStack>
              </HStack>
            </Container>
          </>
        ) : (
          <Center>
            <Spinner />
          </Center>
        )}
      </Layout>
    </>
  );
}
