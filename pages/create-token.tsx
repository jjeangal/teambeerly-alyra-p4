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
  Select,
} from "@chakra-ui/react";

import { MarketPlaceContext } from "../context/MarketPlaceContext";

import Layout from "../components/Layout/Layout";

import {
  ipfsInfura,
  uploadFileToIPFS,
  uploadFolderToIPFS,
} from "../services/ipfs.service";
import { factoryAddress } from "../context/constants";
import { useAddress } from "@thirdweb-dev/react";

//Create IPFS clients
const projectId = "2CvlZnTIlpRtyaWCJEp0aVOPPUg";
const projectSecret = "ac0b1ae7fcabb8bb3972d9fd04d92ae5";

export default function CreateToken() {
  const address = useAddress() || "";

  //Form input
  const [fileUrl, setFileUrl] = useState("");
  const [image, setImage] = useState<File>();
  const [formInput, setFormInput] = useState({
    name: "",
    description: "",
  });

  //Get contracts
  const { factoryContractAsSigner, blyTokenContractAsSigner } =
    useContext(MarketPlaceContext);

  const getAllCollections = async (currentAdress: string) => {
    try {
      const eventFilter = factoryContractAsSigner.filters.CollectionCreated();
      const events = await factoryContractAsSigner.queryFilter(eventFilter);
      const allCollections: any[] = [];
      events.forEach((element: any) => {
        if (element.args._owner == currentAdress) {
          allCollections.push(element.args._collectionAddress);
        }
      });
      return Promise.resolve(allCollections);
    } catch (error) {
      console.log("Error when fetching collection owner : ", error);
      return Promise.reject(error);
    }
  };

  const createNFT = async () => {
    const { name, description } = formInput;
    if (!image || !name || !description) return;
    try {
      const imageUrl = await uploadFileToIPFS(image);
      console.log(image);
      const form = { imageUrl, name, description };
      const jsonFileCollection = new File(
        [JSON.stringify(form)],
        `_metadata.json`,
        { type: "application/json" }
      );
      const transaction = await uploadFileToIPFS(jsonFileCollection);
      console.log(transaction);

      const tokenCreation = await blyTokenContractAsSigner.mint(transaction);
      const receipt = await tokenCreation.wait();
      console.log("token created: ", receipt);
    } catch (error) {
      console.log("Error on mint NFT: ", error);
    }
  };

  useEffect(() => {
    if (factoryContractAsSigner && address) {
      (async () => {
        const collectionsAddresses = await getAllCollections(address);
        console.log("collectionsAddresses", collectionsAddresses);
      })();
    }
  }, [factoryContractAsSigner, address]);

  return (
    <Layout>
      <Container centerContent maxW={"500px"}>
        <Text fontSize={"3xl"} fontWeight={"bold"}>
          Create New NFT
        </Text>
        <Box mt={"6em"} w={"full"}>
          <FormControl isRequired>
            <FormLabel>Image</FormLabel>
            <Input
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => {
                if (e.target.files != null) setImage(e.target.files[0]);
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
          <Select placeholder="Select option">
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </Select>
        </Box>
        <Box mt={"3em"} w={"full"} onClick={createNFT}>
          <Button>create</Button>
        </Box>
      </Container>
    </Layout>
  );
}
