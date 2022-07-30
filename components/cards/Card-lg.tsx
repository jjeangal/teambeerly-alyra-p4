import { Avatar, Box, HStack, Image, Link } from "@chakra-ui/react";
import { chakra } from "@chakra-ui/react";
import { defaultItemImage } from "../../services/utils";

interface CardProps {
  imageUrl?: string;
  avatar?: string;
}

export default function CardLg({ imageUrl, avatar }: CardProps) {
  return (
    <Box w="385px" bg="white" shadow="lg" rounded="lg" overflow="hidden">
      <Link>
        {/* TODO: Add link to /collection with the ID */}
        <Image
          w="full"
          h={"350px"}
          fit="cover"
          src={imageUrl}
          alt="item"
          fallbackSrc={defaultItemImage}
        />
      </Link>

      <HStack p={5} spacing={5}>
        <Box>
          <Avatar name="NC" src={avatar} />
        </Box>
        <Box textAlign="left">
          <Link
            display="block"
            fontSize="2xl"
            color="gray.800"
            fontWeight="bold"
          >
            Colorz
          </Link>
          by&nbsp;
          <chakra.span fontSize="sm" color="gray.700" fontWeight="bold">
            <Link fontSize="sm" color="gray.700" fontWeight="bold">
              Zoonies
            </Link>
          </chakra.span>
        </Box>
      </HStack>
    </Box>
  );
}
