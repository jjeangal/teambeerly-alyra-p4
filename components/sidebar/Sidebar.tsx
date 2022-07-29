import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  useDisclosure,
} from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { ConnectWalletsButtons } from "../ConnectWalletsButtons/ConnectWalletsButtons";

type SidebarProps = {
  isOpen: boolean;
};

export const Sidebar = ({ isOpen }: SidebarProps) => {
  const address = useAddress();
  const { onClose } = useDisclosure();

  return (
    <Drawer isOpen={!address && isOpen} placement="right" onClose={onClose}>
      <DrawerContent>
        <DrawerCloseButton onClick={onClose} />
        <DrawerHeader />
        <DrawerBody>{!address && <ConnectWalletsButtons />}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
