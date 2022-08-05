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
import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import { create } from "ipfs-http-client";

export default function CreateCollection() {
  // Contract type management
  const [contractType, setContractType] = useState("ERC721");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File>();
  const [imageUrl, setImageUrl] = useState("");
  const [uriFolder, setUriFolder] = useState<FileList>();
  const [baseUri, setBaseUri] = useState("");
  const [supply, setSupply] = useState(0);

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

  //Create IPFS clients
  const projectId = "2CvlZnTIlpRtyaWCJEp0aVOPPUg";
  const projectSecret = "ac0b1ae7fcabb8bb3972d9fd04d92ae5";
  const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

  const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });

  const uploadFileToIPFS = async (file: any) => {
    try {
      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      return url;
    } catch (error) {
      console.log("Error when uploading file to IPFS:", error);
    }
  };

  const uploadFolderToIPFS = async (file: any) => {
    try {
      //const added = await client.addAll(file);
      //console.log("added: " + added)
      //const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      return null;
    } catch (error) {
      console.log("Error when uploading file to IPFS:", error);
    }
  };

  const getImageIpfsUrl = async (acceptedFile: File) => {
    try {
      const url = await uploadFileToIPFS(acceptedFile);
      console.log(url);
      if (url) setImageUrl(url);
    } catch (error) {
      console.log("ipfs image upload error: ", error);
    }
  };

  const getUriIpfs = async (acceptedFile: FileList) => {
    try {
      const url = await uploadFolderToIPFS(acceptedFile);
      console.log(url);
      if (url) setBaseUri(url);
    } catch (error) {
      console.log("ipfs image upload error: ", error);
    }
  };

  function createCollection() {
    if (name.length == 0) return alert("Name field is empty.");
    if (symbol.length == 0) return alert("Symbol field is empty.");
    if (description.length == 0) return alert("Description field is empty.");
    if (!imageFile) return alert("Choose a collection image.");
    if (!uriFolder) return alert("Choose images for collection nfts.");
    if (supply <= 0) return alert("Supply must be higher than 0.");
    generateIpfsLinks();
    generateMetaData();
  }

  function generateIpfsLinks() {
    console.log("Generate folder link to IPFS");
    if (uriFolder) getUriIpfs(uriFolder);
    console.log("Generate image link to IPFS:");
    if (imageFile) getImageIpfsUrl(imageFile);
  }

  function generateMetaData() {
    const metadata = {
      name: name,
      description: description,
      image: imageUrl,
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
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => {
                if (e.target.files != null) setImageFile(e.target.files[0]);
              }}
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
              type="file"
              accept="image/png, image/jpeg"
              multiple={true}
              onChange={(e) => {
                if (e.target.files != null) setUriFolder(e.target.files);
              }}
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
