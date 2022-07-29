import { Avatar, Tag, TagLabel } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import Link from "next/link";
import { getAvatar, stripAddress } from "../../services/utils";

export const AccountAddress = () => {
  const address = useAddress();
  return (
    <>
      <Link href="/profile">
        <Tag
          size="lg"
          colorScheme="orange"
          borderRadius="full"
          cursor="pointer"
        >
          {address ? (
            <>
              <Avatar src={getAvatar(address)} size="xs" ml={-1} mr={2} />
              <TagLabel>{stripAddress(address)}</TagLabel>
            </>
          ) : (
            <TagLabel>Not connected</TagLabel>
          )}
        </Tag>
      </Link>
    </>
  );
};
