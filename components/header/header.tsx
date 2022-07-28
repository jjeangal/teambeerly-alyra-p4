import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Flex,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { HamburgerIcon } from "@chakra-ui/icons";

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // TODO: Put drawer in a sidebar component
  const MobileNavContent = (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerContent>
        <DrawerCloseButton onClick={onClose} />
        <DrawerHeader>Wallet address</DrawerHeader>

        <DrawerBody>Drawer body content here</DrawerBody>

        <DrawerFooter>Drawer footer content here</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );

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
              <Link href="/">
                <Text fontSize="25px" fontWeight={800} color="purple.800">
                  OpenBatch
                </Text>
              </Link>
            </Flex>

            <Flex justify="flex-end" w="full" align="center" color="gray.400">
              <IconButton
                display="flex"
                aria-label="Open menu"
                fontSize="20px"
                color="gray.800"
                variant="ghost"
                icon={<HamburgerIcon />}
                onClick={onOpen}
              />
            </Flex>
          </Flex>
          {MobileNavContent}
        </Box>
      </Box>
    </>
  );
}
