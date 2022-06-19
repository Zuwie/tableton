import React from "react";
import type { BoxProps } from "@chakra-ui/react";
import {
  Box,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { FiClipboard, FiCompass, FiSettings, FiStar } from "react-icons/fi";
import type { IconType } from "react-icons";
import { ROUTES } from "~/constants";
import MobileNav from "~/components/MobileNav";
import NavItem from "../components/NavItem";
import { Outlet } from "@remix-run/react";
import Logo from "~/components/Logo";

interface LinkItemProps {
  name: string;
  icon: IconType;
  href: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Dashboard", icon: FiClipboard, href: ROUTES.DASHBOARD },
  { name: "Players", icon: FiCompass, href: ROUTES.PLAYERS },
  { name: "League", icon: FiStar, href: ROUTES.PLAYERS },
  { name: "Settings", icon: FiSettings, href: ROUTES.SETTINGS },
];

export default function __app() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>

      <MobileNav onOpen={onOpen} />

      <Box ml={{ base: 0, md: 60 }} p="8">
        <Outlet />
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Logo />
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>

      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} href={link.href}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};
