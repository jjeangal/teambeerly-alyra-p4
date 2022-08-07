import {
  Box,
  Button,
  HStack,
  Image,
  Link,
  Skeleton,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";

interface CardProps {
  itemInfos: any;
}

export default function CardItem({ itemInfos }: CardProps) {
  return (
    <Box
      w="183px"
      bg="white"
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      position={"relative"}
    >
      <Link
        href={`/token/${itemInfos.collectionCID}/${itemInfos.index}`}
        alignSelf={"center"}
        textAlign={"right"}
        flexGrow={"2"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Image
          w="full"
          h={"183x"}
          fit="cover"
          src={itemInfos.image}
          alt="item"
          fallback={<Skeleton h={"183px"} />}
        />
      </Link>

      <VStack p={5} spacing={2} align="stretch">
        <Box textAlign="left">
          <Text
            display="block"
            fontSize={"15px"}
            color="gray.800"
            fontWeight="bold"
            maxW={"190px"}
            textOverflow={"ellipsis"}
            overflowX={"hidden"}
            whiteSpace={"nowrap"}
          >
            {itemInfos.name}
          </Text>
          <Text
            display="block"
            fontSize={"15px"}
            color="gray.500"
            maxW={"190px"}
            textOverflow={"ellipsis"}
            overflowX={"hidden"}
            whiteSpace={"nowrap"}
          >
            {itemInfos.collectionName}
          </Text>
        </Box>
        {/* TODO: Display only if token is listed */}
        <Stat>
          <StatLabel>Price</StatLabel>
          <StatNumber>1 ETH</StatNumber>
        </Stat>

        {/* TODO: Trigger sell function */}
        <Button
          colorScheme={"orange"}
          bg={"orange.600"}
          color={"white"}
          variant="solid"
        >
          Sell
        </Button>
      </VStack>
    </Box>
  );
}
