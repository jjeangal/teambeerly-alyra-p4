import { useState, useContext, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import { create } from "ipfs-http-client";
import { MarketPlaceContext } from "../context/MarketPlaceContext";

import Layout from "../components/Layout/Layout";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";

//Create IPFS clients
const projectId = "2CvlZnTIlpRtyaWCJEp0aVOPPUg";
const projectSecret = "ac0b1ae7fcabb8bb3972d9fd04d92ae5";
const auth =
  "Basic" + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

export default function CreateToken() {
  //Form input
  const [fileUrl, setFileUrl] = useState("");
  const [formInput, setFormInput] = useState({
    image: "",
    name: "",
    description: "",
  });

  //Get contracts
  const {
    marketPlaceContract,
    marketPlaceContractAsSigner,
    erc721Contract,
    erc721ContractAsSigner,
  } = useContext(MarketPlaceContext);

  /* Get the dropped Image */
  //Function triggered on image drop
  const onDrop = useCallback(async (acceptedFile) => {
    try {
      const url = await uploadToIPFS(acceptedFile[0]);
      setFileUrl(url);
      console.log("URL:", url);
    } catch (error) {
      console.log("ipfs image upload error: ", error);
    }
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

  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    } catch (error) {
      console.log("Error when uploading file to IPFS:", error);
    }
  };
  // const uploadToIPFS = async (event) => {
  //   event.preventDefault()
  //   const file = event.target.files[0]
  //   if (typeof file !== 'undefined') {
  //     try {
  //       const result = await client.add(file)
  //       console.log(result)
  //       setFileUrl(`https://ipfs.infura.io/ipfs/${result.path}`)
  //     } catch (error){
  //       console.log("ipfs image upload error: ", error)
  //     }
  //   }
  // }

  const createNFT = async () => {
    const { image, name, description } = formInput;
    if (!image || !name || !description) return;
    try {
      const result = await client.add(
        JSON.stringify({ image, name, description })
      );
      const added = await client.add(result);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      console.log("IPFS: ", url);
      const tokenCreation = await erc721Contract.mint(url);
      await tokenCreation.wait();
      console.log("token created");
    } catch (error) {
      console.log("ipfs uri upload error: ", error);
    }
  };

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
            <Input
              {...getInputProps()}
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
        <Box mt={"3em"} w={"full"} onClick={createNFT}>
          {/* {...createNFT()} */}
          <Button>create</Button>
        </Box>
      </Container>
    </Layout>
  );
}
