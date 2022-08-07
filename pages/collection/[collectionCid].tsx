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
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { networkCurrency } from "../../context/constants";
import { ipfsInfura } from "../../services/ipfs.service";
import { stripAddress } from "../../services/utils";

export default function Collection() {
  const router = useRouter();
  const { collectionCid } = router.query;

  console.log("collectionCid : ", collectionCid);

  const getCollection = async (collectionCid: any) => {
    try {
      const fetchResponse = await fetch(
        `${ipfsInfura}/${collectionCid}/_metadata.json`
      );
      if (fetchResponse.ok) {
        const collectionMetaData = await fetchResponse.json();
        console.log("collectionMetaData", collectionMetaData);
        return Promise.resolve(collectionMetaData);
      } else {
        alert("HTTP-Error: " + fetchResponse.status);
      }
    } catch (error) {
      console.log("Error when fetching token metadata : ", error);
      return Promise.reject(error);
    }
  };

  // const getImageUrl = (ipfsUrl: string): string => {
  //   return ipfsUrl.replace("ipfs:/", `${IPFSUrl}`);
  // };

  useEffect(() => {
    if (collectionCid) {
      (async () => {
        const collectionJson = await getCollection(collectionCid);
      })();
    }
  }, [collectionCid]);

  return <></>;
}
