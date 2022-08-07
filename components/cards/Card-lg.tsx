import {
  Avatar,
  Box,
  Button,
  HStack,
  Image,
  Link,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { chakra } from "@chakra-ui/react";

interface CardProps {
  imageUrl?: string;
  avatar?: string;
  viewOwner?: boolean;
}

export default function CardLg({
  imageUrl,
  avatar,
  viewOwner = true,
}: CardProps) {
  return (
    <Box w="385px" bg="white" shadow="lg" rounded="lg" overflow="hidden">
      <Image
        w="full"
        h={"350px"}
        fit="cover"
        src={imageUrl}
        alt="item"
        fallback={<Skeleton h={"350px"} />}
      />

      <HStack p={5} spacing={5}>
        {avatar && (
          <Box>
            <Avatar name="NC" src={avatar} />
          </Box>
        )}
        <Box textAlign="left">
          <Text
            display="block"
            fontSize="2xl"
            color="gray.800"
            fontWeight="bold"
          >
            Colorz
          </Text>
          {viewOwner && (
            <chakra.span fontSize="sm" color="gray.700">
              by Zoonies
            </chakra.span>
          )}
        </Box>

        {/* TODO: Add link to /collection with the ID */}
        <Link
          href="/"
          alignSelf={"center"}
          flexGrow={"2"}
          _hover={{
            textDecoration: "none",
          }}
        >
          <Button
            colorScheme={"purple"}
            bg={"purple.800"}
            color={"white"}
            variant="solid"
          >
            View
          </Button>
        </Link>
      </HStack>
    </Box>
  );
}
