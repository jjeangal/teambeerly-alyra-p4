import { Box, Flex, Image, Link } from "@chakra-ui/react";
import { chakra } from "@chakra-ui/react";

export default function CardLg() {
  return (
    <Box w="385px" bg="white" shadow="lg" rounded="lg" overflow="hidden">
      <Image
        w="full"
        h={"350px"}
        fit="cover"
        src="https://images.unsplash.com/photo-1613542231149-63eb74d8b4ef?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1972&q=80"
        alt="avatar"
      />

      <Box p={5} textAlign="left">
        <Link display="block" fontSize="2xl" color="gray.800" fontWeight="bold">
          Colorz
        </Link>
        <chakra.span fontSize="sm" color="gray.700">
          by Zoonies
        </chakra.span>
      </Box>
    </Box>
  );
}
