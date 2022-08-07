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
import { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { networkCurrency } from "../../context/constants";
import { MarketPlaceContext } from "../../context/MarketPlaceContext";
import { ipfsInfura } from "../../services/ipfs.service";
import { stripAddress } from "../../services/utils";

export default function Collection() {
  const router = useRouter();
  const { collectionAddress } = router.query;
  const { factoryContractAsSigner } = useContext(MarketPlaceContext);

  const getCollectionCID = async (collectionAddress: any) => {
    try {
      const baseUri = await factoryContractAsSigner.getCollectionBaseUri(
        collectionAddress
      );
      return Promise.resolve(baseUri);
    } catch (error) {
      console.log("Error when fetching token metadata : ", error);
      return Promise.reject(error);
    }
  };

  const getCollection = async (collectionCid: any) => {
    try {
      const fetchResponse = await fetch(
        `${ipfsInfura}/${collectionCid}/_metadata.json`
      );
      if (fetchResponse.ok) {
        const collectionMetaData = await fetchResponse.json();
        return Promise.resolve(collectionMetaData);
      } else {
        alert("HTTP-Error: " + fetchResponse.status);
      }
    } catch (error) {
      console.log("Error when fetching token metadata : ", error);
      return Promise.reject(error);
    }
  };

  useEffect(() => {
    if (collectionAddress) {
      (async () => {
        const collectionCID = await getCollectionCID(collectionAddress);
        const collectionMetadata = await getCollection(collectionCID);
        console.log(collectionMetadata);
      })();
    }
  }, [collectionAddress]);

  return (
    <>
      <Layout>
        <span></span>
      </Layout>
    </>
  );
}
