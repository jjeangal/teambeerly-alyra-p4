import {
  Avatar,
  Box,
  Button,
  HStack,
  Image,
  Link,
  Skeleton,
} from "@chakra-ui/react";
import { chakra } from "@chakra-ui/react";
import { useState } from "react";

interface CardProps {
  imageUrl?: string;
  avatar?: string;
}

export default function CardLg({ imageUrl, avatar }: CardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  function handleImageLoaded(): void {
    setImageLoaded(true);
  }

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
          onLoad={handleImageLoaded}
          fallback={<Skeleton h={"350px"} isLoaded={!imageLoaded} />}
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
          <chakra.span fontSize="sm" color="gray.700">
            by Zoonies
          </chakra.span>
        </Box>
        <Link href="">
          <Button
            colorScheme={"purple"}
            bg={"purple.800"}
            color={"white"}
            variant="solid"
          >
            <a>View</a>
          </Button>
        </Link>
      </HStack>
    </Box>
  );
}
