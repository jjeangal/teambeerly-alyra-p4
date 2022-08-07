import {
  Avatar,
  Badge,
  Box,
  Button,
  HStack,
  Image,
  Link,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { chakra } from "@chakra-ui/react";
import { getAvatar, stripAddress } from "../../services/utils";

interface CardProps {
  collectionInfos: any;
  owner?: string;
  avatar?: string;
  viewOwner?: boolean;
}

export default function CardLg({
  collectionInfos,
  owner,
  viewOwner = true,
}: CardProps) {
  return (
    <Box
      w="385px"
      bg="white"
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      position={"relative"}
    >
      <Badge
        position={"absolute"}
        top={"5px"}
        right={"5px"}
        borderRadius={"lg"}
      >
        {collectionInfos.items?.length} items
      </Badge>
      <Image
        w="full"
        h={"350px"}
        fit="cover"
        src={collectionInfos.image}
        alt="item"
        fallback={<Skeleton h={"350px"} />}
      />

      <HStack p={5} spacing={5}>
        {owner && (
          <Box>
            <Avatar name="NC" src={getAvatar(owner)} />
          </Box>
        )}
        <Box textAlign="left">
          <Text
            display="block"
            fontSize="2xl"
            color="gray.800"
            fontWeight="bold"
            maxW={"190px"}
            textOverflow={"ellipsis"}
            overflowX={"hidden"}
            whiteSpace={"nowrap"}
          >
            {collectionInfos.name || "Colorz"}
          </Text>
          {viewOwner && (
            <chakra.span fontSize="sm" color="gray.700">
              by {owner ? stripAddress(owner) : "Zoonies"}
            </chakra.span>
          )}
        </Box>

        <Link
          href={`/collection/${collectionInfos.address}`}
          alignSelf={"center"}
          textAlign={"right"}
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
