import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useNumberInput,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { MarketPlaceContext } from "../context/MarketPlaceContext";

export default function CreateCollection() {
  const { marketPlaceContract } = useContext(MarketPlaceContext);

  async function getFees() {
    try {
      const marketPlaceFees = await marketPlaceContract.feePercent();
      console.log("marketPlaceFees (CreateCollection)", marketPlaceFees);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (marketPlaceContract) {
      getFees();
    }
  }, [marketPlaceContract]);

  // Creator earning management
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 0.01,
      defaultValue: 0,
      min: 0,
      max: 25,
      precision: 2,
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  // Contract type management
  const [contractType, setContractType] = useState("ERC721");

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [baseUri, setBaseUri] = useState("");
  const [supply, setSupply] = useState(0);

  function createCollection() {
    if (name.length == 0) return alert("Name field is empty.");
    if (symbol.length == 0) return alert("Symbol field is empty.");
    if (description.length == 0) alert("Description field is empty.");
    if (baseUri.length == 0) alert("Uri field is empty.");
    if (supply <= 0) alert("Supply must be higher than 0.");

    generateIpfsLinks();
    generateMetaData();
  }

  function generateIpfsLinks() {
    console.log("Generate folder link to IPFS");
    console.log("Generate image link to IPFS");
  }

  function generateMetaData() {
    const metadata = {
      name: name,
      description: description,
      image:
        "https://ipfs.io/ipfs/QmUnMkaEB5FBMDhjPsEtLyHr4ShSAoHUrwqVryCeuMosNr",
      external_url: baseUri,
    };
    console.log(metadata);
    return metadata;
  }

  return (
    <Layout>
      <Container centerContent maxW={"500px"}>
        <Text fontSize={"3xl"} fontWeight={"bold"}>
          Create New Collection
        </Text>
        <Box mt={"2em"} w={"full"}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
        </Box>
        <Box mt={"2em"} w={"full"}>
          <FormControl>
            <FormLabel>Symbol</FormLabel>
            <Input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            />
          </FormControl>
        </Box>
        <Box mt={"2em"} w={"full"}>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <FormHelperText mb={3}>
              The description will be included on the item's detail page
              underneath its image.
            </FormHelperText>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
        </Box>
        <Box mt={"2em"} w={"full"}>
          <FormControl>
            <FormLabel>Image Url</FormLabel>
            <FormHelperText mb={3}>
              The banner image url for the collection.
            </FormHelperText>
            <Input
              type="text"
              /**value={}
              onChange={}*/
            />
          </FormControl>
        </Box>
        <Box mt={"2em"} w={"full"}>
          <FormControl>
            <FormLabel>Base Uri</FormLabel>
            <FormHelperText mb={3}>
              Provide ipfs base Uri used to identify all NFTs of the collection.
              Example: Base uri "https://ipfs.io/ipfs/QvTalyhCoX/" for token 3
              will give "https://ipfs.io/ipfs/QvTalyhCoX/3".
            </FormHelperText>
            <Input
              type="text"
              value={baseUri}
              onChange={(e) => setBaseUri(e.target.value)}
            />
          </FormControl>
        </Box>
        <Box mt={"2em"} w={"full"}>
          <FormControl>
            <FormLabel>Type</FormLabel>
            <RadioGroup onChange={setContractType} value={contractType}>
              <Stack direction="row">
                <Radio value="ERC721">ERC721</Radio>
                <Radio value="ERC1155">ERC1155</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
        </Box>
        <Box mt={"2em"} w={"full"}>
          <FormControl>
            <FormLabel>Creator earnings</FormLabel>
            <FormHelperText mb={3}>
              Define a price to be payed in order to mint an NFT from the
              collection (ETH).
            </FormHelperText>
            <HStack maxW="full">
              <Button {...dec}>-</Button>
              <Input {...input} />
              <Button {...inc}>+</Button>
            </HStack>
          </FormControl>
        </Box>

        <Box mt={"2em"} w={"full"}>
          <FormControl>
            <FormLabel>Supply</FormLabel>
            <FormHelperText mb={3}>
              You must specify the maximum amount of tokens that can be minted.
            </FormHelperText>
            <NumberInput
              defaultValue={0}
              min={1}
              value={supply}
              onChange={(num) => setSupply(parseInt(num))}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </Box>
        <Button
          colorScheme={"purple"}
          bg={"purple.800"}
          color={"white"}
          variant="solid"
          onClick={() => createCollection()}
        >
          <a>Create</a>
        </Button>
      </Container>
    </Layout>
  );
}
