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
import { useContext, useEffect, useState } from "react";
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

  return (
    <Layout>
      <Container centerContent maxW={"500px"}>
        <Text fontSize={"3xl"} fontWeight={"bold"}>
          Create New Collection
        </Text>
        <Box mt={"2em"} w={"full"}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input type="text" />
          </FormControl>
        </Box>
        <Box mt={"2em"} w={"full"}>
          <FormControl>
            <FormLabel>Symbol</FormLabel>
            <Input type="text" />
          </FormControl>
        </Box>
        <Box mt={"2em"} w={"full"}>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <FormHelperText mb={3}>
              The description will be included on the item's detail page
              underneath its image
            </FormHelperText>
            <Input type="text" />
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
            <Input type="text" />
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
              You must specify the maximum amount of tokens that can be minted
            </FormHelperText>
            <NumberInput defaultValue={0} min={1}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </Box>
      </Container>
    </Layout>
  );
}
