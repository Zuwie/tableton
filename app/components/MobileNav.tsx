import type { FlexProps } from "@chakra-ui/react";
import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useUser } from "~/utils";
import { FiChevronDown, FiMenu } from "react-icons/fi";
import { ROUTES } from "~/constants";
import React from "react";
import { Form, NavLink } from "@remix-run/react";
import Logo from "~/components/Logo";
import Notifications from "~/components/Notifications";

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

export default function MobileNav({ onOpen, ...rest }: MobileProps) {
  const user = useUser();

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Box display={{ base: "flex", md: "none" }}>
        <Logo />
      </Box>

      <HStack spacing={{ base: "0", md: "6" }}>
        <Notifications />

        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar size={"sm"} src={user.avatar || undefined} />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{user.email}</Text>
                  <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
              py={0}
            >
              <NavLink to={ROUTES.PROFILE}>
                <MenuItem as="span">Profile</MenuItem>
              </NavLink>
              <NavLink to={ROUTES.SETTINGS}>
                <MenuItem as="span">Settings</MenuItem>
              </NavLink>
              <MenuDivider />
              <Form action="/logout" method="post">
                <MenuItem type="submit">Sign Out</MenuItem>
              </Form>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
}
