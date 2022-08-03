import { Avatar, IconButton, Tag, TagLabel } from "@chakra-ui/react";
import { useAddress, useDisconnect } from "@thirdweb-dev/react";
import Link from "next/link";
import { FaSignOutAlt } from "react-icons/fa";
import { getAvatar, stripAddress } from "../../services/utils";

// TODO: use useNetworkMistmatch() in order to detect if
// the connected wallet is on the correct network specified by the desiredChainId

export const AccountAddress = () => {
  const address = useAddress();
  const disconnect = useDisconnect();

  return (
    <>
      {address ? (
        <>
          <Link href="/profile">
            <Tag
              size="lg"
              colorScheme="orange"
              borderRadius="full"
              cursor="pointer"
            >
              <Avatar src={getAvatar(address)} size="xs" ml={-1} mr={2} />
              <TagLabel>{stripAddress(address)}</TagLabel>
            </Tag>
          </Link>
          <IconButton
            display="flex"
            aria-label="Open menu"
            fontSize="20px"
            color="gray.800"
            variant="ghost"
            icon={<FaSignOutAlt />}
            onClick={disconnect}
          />
        </>
      ) : (
        <Tag size="lg" colorScheme="orange" borderRadius="full">
          <TagLabel>Not connected</TagLabel>
        </Tag>
      )}
    </>
  );
};
