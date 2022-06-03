import type { FlexProps } from "@chakra-ui/react";
import { Flex, Icon, Link, Text } from "@chakra-ui/react";
import type { ReactText } from "react";
import React from "react";
import type { IconType } from "react-icons";
import RemixLink from "~/components/RemixLink";

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  href: string;
}

export default function NavItem({
  icon,
  children,
  href,
  ...rest
}: NavItemProps) {
  return (
    <RemixLink to={href}>
      <Text
        as="span"
        style={{ textDecoration: "none" }}
        _focus={{ boxShadow: "none" }}
      >
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: "green.400",
            color: "white",
          }}
          {...rest}
        >
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: "white",
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Text>
    </RemixLink>
  );
}
