import { Box, Image, Link } from "@chakra-ui/react";
import { chakra } from "@chakra-ui/react";

interface CardProps {
  imageUrl?: string;
  avatar?: string;
}

export default function CardLg({ imageUrl, avatar }: CardProps) {
  const _imageUrl =
    imageUrl ||
    "https://images.unsplash.com/photo-1613542231149-63eb74d8b4ef?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1972&q=80";

  return (
    <Box
      w="385px"
      bg="white"
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      cursor={"pointer"}
    >
      <Image w="full" h={"350px"} fit="cover" src={_imageUrl} alt="avatar" />

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
