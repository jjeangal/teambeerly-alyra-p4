import { Avatar, Tag, TagLabel } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { getAvatar, stripAddress } from "../../services/utils";

export const AccountAddress = () => {
  const address = useAddress();
  return (
    <>
      <Tag size="lg" colorScheme="teal" borderRadius="full">
        {address ? (
          <>
            <Avatar src={getAvatar(address)} size="xs" ml={-1} mr={2} />
            <TagLabel>{stripAddress(address)}</TagLabel>
          </>
        ) : (
          <TagLabel>Not connected</TagLabel>
        )}
      </Tag>
    </>
  );
};
