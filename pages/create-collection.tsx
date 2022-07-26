import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Tag,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import Layout from "../components/Layout/Layout";
import { MarketPlaceContext } from "../context/MarketPlaceContext";
import {
  ipfsInfura,
  uploadFileToIPFS,
  uploadFolderToIPFS,
} from "../services/ipfs.service";

export default function CreateCollection() {
  const router = useRouter();

  const { factoryContractAsSigner } = useContext(MarketPlaceContext);

  // Contract type management
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File>();
  const [imagesFolder, setImagesFolder] = useState<FileList>();
  const [supply, setSupply] = useState(0);

  const [collectionIsSaving, setCollectionIsSaving] = useState(false);

  const handleFolderSelection = (event: any) => {
    if (!!event.target.files) {
      setImagesFolder(event.target.files);
      setSupply(event.target.files.length);
    }
  };

  async function createCollection() {
    if (name.length == 0) return alert("Name field is empty.");
    if (symbol.length == 0) return alert("Symbol field is empty.");
    if (description.length == 0) return alert("Description field is empty.");
    if (!imageFile) return alert("Choose a collection image.");
    if (!imagesFolder) return alert("Choose images for collection nfts.");
    if (supply <= 0) return alert("Supply must be higher than 0.");

    // 1) création du dossier d'images, avec les images dedans dans IPFS => OK
    // 2) création du metadata de chaque item, avec push sur IPFS => OK
    // 3) création du metadata de la collection à partir du résultat (info collection + infos de tous les items) => OK
    // 4) création des interactions avec le contracts => OK
    // 5) redirection vers la page collection view

    setCollectionIsSaving(true);
    await generateIPFSLinks(imageFile, imagesFolder);
    setCollectionIsSaving(false);
  }

  const generateIPFSLinks = async (imageFile: File, imagesFolder: FileList) => {
    const urlBannerImage = await getImageIPFSUrl(imageFile);
    const cidImagesFolder: any = await getUriIPFS(imagesFolder);
    console.log("CID images folder : ", cidImagesFolder);

    const itemsMetadatas = await generateItemsMetadata(
      imagesFolder,
      cidImagesFolder
    );
    const collectionMetadata = await generateCollectionMetadata(
      urlBannerImage,
      cidImagesFolder,
      itemsMetadatas
    );

    const jsonFileCollection = new File(
      [JSON.stringify(collectionMetadata)],
      `_metadata.json`,
      { type: "application/json" }
    );

    let filesList: any = [
      {
        path: `_metadata.json`,
        content: jsonFileCollection,
      },
    ];

    itemsMetadatas.forEach(async (itemsMetadata, index) => {
      const jsonFileItem = new File(
        [JSON.stringify(itemsMetadata)],
        `${index}.json`,
        { type: "application/json" }
      );
      filesList[index + 1] = {
        path: `${index}.json`,
        content: jsonFileItem,
      };
    });

    const cidJsonFolder: string =
      (await uploadFolderToIPFS(filesList, true)) || "";
    console.log("CID JSON folder : ", cidJsonFolder);

    await createCollectionFromContract(urlBannerImage, cidJsonFolder);
  };

  const createCollectionFromContract = async (
    urlBannerImage: string,
    collectionBaseUri: string
  ) => {
    const options = {
      name,
      symbol,
      collectionBaseUri,
      urlBannerImage,
      supply,
    };
    console.log(
      "🔎 ~ file: create-collection.tsx ~ line 115 ~ createCollectionFromContract ~ options",
      options
    );
    try {
      const tx = await factoryContractAsSigner.createCollection(
        name,
        symbol,
        collectionBaseUri,
        urlBannerImage,
        supply
      );
      const txReceipt = await tx.wait();

      console.log("txReceipt : ", txReceipt);

      const event = txReceipt.events.find(
        (event: any) => event.event === "CollectionCreated"
      );
      const newCollectionAddress = event.args._collectionAddress;
      console.log("newCollectionAddress", newCollectionAddress);
      router.push(`/collection/${newCollectionAddress}`);
    } catch (error) {}
  };

  const getImageIPFSUrl = async (acceptedFile: File): Promise<any> => {
    try {
      const url: string = await uploadFileToIPFS(acceptedFile);
      return Promise.resolve(url);
    } catch (error) {
      console.log("ipfs image upload error: ", error);
    }
  };

  const getUriIPFS = async (acceptedFile: FileList) => {
    try {
      const uri: any = await uploadFolderToIPFS(acceptedFile);
      return uri;
    } catch (error) {
      console.log("ipfs image upload error: ", error);
    }
  };

  const generateItemsMetadata = async (
    acceptedFile: FileList,
    cidFolder: string
  ) => {
    const filesMetadata = [];
    for (let i = 0; i < acceptedFile.length; i++) {
      let file: any = acceptedFile.item(i);

      const metadata = {
        name: `${name} #${i}`,
        description: `Welcome to the home of ${name} on OpenBatch. Discover the best items in this collection.`,
        image: `${ipfsInfura}/${cidFolder}/${file.name}`,
        date: new Date().toJSON(),
      };
      filesMetadata.push(metadata);
    }
    return filesMetadata;
  };

  const generateCollectionMetadata = async (
    urlBannerImage: string,
    cidFolder: string,
    itemsMetadatas: any[]
  ) => {
    const result = {
      name,
      description,
      image: urlBannerImage,
      external_url: `${ipfsInfura}/${cidFolder}`,
      items: itemsMetadatas,
    };
    return result;
  };

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
            <FormLabel>Banner image</FormLabel>
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
            <FormLabel>Images Folder</FormLabel>
            <FormHelperText mb={3}>
              Choose a folder for all token images. Please make sure all files
              are named as followed : "X.[file_extension]" with X a number
              starting from 0.
            </FormHelperText>
            <Input
              type="file"
              name="folderPicker"
              webkitdirectory={"true"}
              onChange={handleFolderSelection}
            />
          </FormControl>
        </Box>
        <Box mt={"2em"} w={"full"}>
          <FormControl>
            <FormLabel>Supply</FormLabel>
            <FormHelperText mb={3}>
              Specified from the number of files in the folder you have selected
            </FormHelperText>

            <Tag size="lg" colorScheme="green" borderRadius="full">
              <Text>{supply}</Text>
            </Tag>
          </FormControl>
        </Box>
        <Button
          isLoading={collectionIsSaving}
          loadingText="Loading"
          spinnerPlacement="end"
          mt={"2em"}
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
