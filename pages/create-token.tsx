import { useState, useContext, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import { create as ipfsHttpsClient } from "ipfs-http-client";
import { MarketPlaceContext } from "../context/MarketPlaceContext";

import Layout from "../components/Layout/Layout";
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
  transform,
  useNumberInput,
} from "@chakra-ui/react";
import { Contract } from "ethers";
import { TransactionDescription } from "ethers/lib/utils";

export default function CreateToken() {
  const [fileUrl, setFileUrl] = useState("");
  const [formInput, setFormInput] = useState({
    image: "",
    name: "",
    description: "",
  });
  //router (to be on the main page after creating NFT)
  const router = useRouter();

  //Get contracts
  const {
    marketPlaceContract,
    marketPlaceContractAsSigner,
    erc721Contract,
    erc721ContractAsSigner,
  } = useContext(MarketPlaceContext);

  //URL to stock the data on IPFS
  const client = ipfsHttpsClient("https:/ifps.infura.io:5001/api/v0");

  /* Get the dropped Image */
  // Function triggered on image drop
  const onDrop = useCallback(async (acceptedFile) => {
    try {
      const url = await uploadToIPFS(acceptedFile[0]);
      setFileUrl(url);
      console.log("URL:", url);
    } catch (error) {
      console.log("ipfs image upload error: ", error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".gif"],
    },
    maxSize: 5000000,
  });

  const fileStyle = useMemo(() => "", []);

  const createNFT = async (formInput, router) => {
    const { image, name, description } = formInput;

    // if (!name || !description || !fileUrl) return;
    try {
      const data = JSON.stringify({ name, description, image: fileUrl });
      const IPFSUrl = uploadToIPFS(data);

      const tokenCreation = await erc721Contract.mint(IPFSUrl);
      await tokenCreation.wait();

      router.push("/");
    } catch (error) {
      console.log("Error when creating NFT");
    }
  };

  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add({ content: file });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      return url;
    } catch (error) {
      console.log("Error when uploading file to IPFS:", error);
    }
  };

  //   // Creator earning management
  // const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
  //   useNumberInput({
  //     step: 0.01,
  //     defaultValue: 0,
  //     min: 0,
  //     max: 25,
  //     precision: 2,
  //   });

  // const inc = getIncrementButtonProps();
  // const dec = getDecrementButtonProps();
  // const input = getInputProps();

  return (
    <Layout>
      <Container centerContent maxW={"500px"}>
        <Text fontSize={"3xl"} fontWeight={"bold"}>
          Create New NFT
        </Text>
        {/* Need to change this to an upload image form */}
        <Box mt={"2em"} w={"full"} {...getRootProps()}>
          <FormControl isRequired>
            <FormLabel>Image</FormLabel>
            {/* {...getInputProps()} */}
            <Input
              onChange={(e) =>
                setFormInput({ ...formInput, image: e.target.value })
              }
            />
          </FormControl>
        </Box>
        <Box mt={"2em"} w={"full"}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              onChange={(e) =>
                setFormInput({ ...formInput, name: e.target.value })
              }
            />
          </FormControl>
        </Box>
        <Box mt={"2em"} w={"full"}>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <FormHelperText mb={3}>
              The description will be included on the item's detail page
              underneath its image
            </FormHelperText>
            <Input
              type="text"
              onChange={(e) =>
                setFormInput({ ...formInput, description: e.target.value })
              }
            />
          </FormControl>
        </Box>
        <Box mt={"2em"} w={"full"}>
          <FormControl>
            <FormLabel>Base Uri</FormLabel>
            <FormHelperText mb={3}>
              Si vous avez deja une URI mettez la ici:
            </FormHelperText>
            <Input type="text" />
          </FormControl>
        </Box>
        <Box mt={"2em"} w={"full"}>
          <FormControl>
            <FormLabel>Creator earnings</FormLabel>
            <FormHelperText mb={3}>
              Define a price to be payed in order to mint an NFT from the
              collection (ETH).
            </FormHelperText>
            {/* <HStack maxW="full">
              <Button {...dec}>-</Button>
              <Input {...input} />
              <Button {...inc}>+</Button>
            </HStack> */}
          </FormControl>
        </Box>
        {/* Need to change to a search user's collection form (with none) */}
        <Box mt={"2em"} w={"full"}>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <FormHelperText mb={3}>
              If you want to put the NFT on on of your collection:
            </FormHelperText>
            <Input type="text" />
          </FormControl>
        </Box>
        <Box mt={"3em"} w={"full"}>
          <Button {...createNFT(formInput, router)}>create</Button>
        </Box>
      </Container>
    </Layout>
  );
}
