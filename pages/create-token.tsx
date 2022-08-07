import { useState, useContext, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  HStack,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";

import { MarketPlaceContext } from "../context/MarketPlaceContext";

import Layout from "../components/Layout/Layout";

import {
  ipfsInfura,
  uploadFileToIPFS,
  uploadFolderToIPFS,
} from "../services/ipfs.service";

//Create IPFS clients
const projectId = "2CvlZnTIlpRtyaWCJEp0aVOPPUg";
const projectSecret = "ac0b1ae7fcabb8bb3972d9fd04d92ae5";

export default function CreateToken() {
  //Form input
  const [fileUrl, setFileUrl] = useState("");
  const [formInput, setFormInput] = useState({
    image: File,
    name: "",
    description: "",
  });

  //Get contracts
  const {
    marketPlaceContractAsSigner,
    blyTokenContractAsSigner: erc721ContractAsSigner,
  } = useContext(MarketPlaceContext);

  const createNFT = async () => {
    const { image, name, description } = formInput;
    if (!image || !name || !description) return;
    try {
      const jsonFileCollection = new File(
        [JSON.stringify(formInput)],
        `_metadata.json`,
        { type: "application/json" }
      );
      const transaction = await uploadFileToIPFS(jsonFileCollection);
      console.log(transaction);

      const tokenCreation = await erc721ContractAsSigner.mint(transaction);
      await tokenCreation.wait();
      console.log("token created");
    } catch (error) {
      console.log("Error on mint NFT: ", error);
    }
  };

  return (
    <Layout>
      <Container centerContent maxW={"500px"}>
        <Text fontSize={"3xl"} fontWeight={"bold"}>
          Create New NFT
        </Text>
        <Box mt={"2em"} w={"full"}>
          <FormControl isRequired>
            <FormLabel>Banner image</FormLabel>
            <FormHelperText mb={3}>
              The banner image url for the collection.
            </FormHelperText>
            <Input
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => {
                if (e.target.files != null)
                  setFormInput({ ...formInput, image: e.target.files[0] });
              }}
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
        {/* <Box mt={"2em"} w={"full"}>
          <FormControl>
            <FormLabel>Collection</FormLabel>
            <FormHelperText mb={3}>
              If you want to put the NFT on on of your collection:
            </FormHelperText>
            <Input type="text" />
          </FormControl>
        </Box> */}
        <Box mt={"3em"} w={"full"} onClick={createNFT}>
          <Button>create</Button>
        </Box>
      </Container>
    </Layout>
  );
}
