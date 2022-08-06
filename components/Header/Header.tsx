import {
  Box,
  Flex,
  IconButton,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { FaWallet } from "react-icons/fa";
import { useAddress } from "@thirdweb-dev/react";
import { AccountAddress } from "../AccountAddress/AccountAddress";
import { Sidebar } from "../Sidebar/Sidebar";

export default function Header() {
  const address = useAddress();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Head>
        <title>OpenBatch</title>
        <meta name="description" content="NFTs marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box pos="relative">
        <Box
          h="4.5rem"
          px="1em"
          borderBottom={"1px"}
          borderBottomColor="gray.200"
        >
          <Flex w="full" h="full" px="6" align="center" justify="space-between">
            <Flex align="center">
              <Box mt={"2px"} mr={"15px"} w="40px" h="auto">
                <Image w={"full"} src="/logo.png" alt="OpenBatch logo" />
              </Box>

              <Link href="/">
                <Text
                  fontSize="25px"
                  fontWeight={800}
                  color="purple.800"
                  cursor="pointer"
                >
                  OpenBatch
                </Text>
              </Link>
            </Flex>

            <Flex
              justify="flex-end"
              w="full"
              gap={5}
              align="center"
              color="gray.400"
            >
              <AccountAddress />
              {!address && (
                <IconButton
                  display="flex"
                  aria-label="Open menu"
                  fontSize="20px"
                  color="gray.800"
                  variant="ghost"
                  icon={<FaWallet />}
                  onClick={onOpen}
                />
              )}
            </Flex>
          </Flex>
          <Sidebar isOpen={isOpen} closeEvent={onClose} />
        </Box>
      </Box>
    </>
  );
}
