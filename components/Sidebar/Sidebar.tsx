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
  closeEvent: any;
};

export const Sidebar = ({ isOpen, closeEvent }: SidebarProps) => {
  const address = useAddress();
  const { onClose } = useDisclosure();

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={closeEvent}>
      <DrawerContent>
        <DrawerCloseButton onClick={onClose} />
        <DrawerHeader />
        <DrawerBody>{!address && <ConnectWalletsButtons />}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
