import { Link as RemixLink } from "@remix-run/react";
import type { LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import { Link as ChakraLink } from "@chakra-ui/react";
import * as React from "react";
import type { RemixLinkProps } from "@remix-run/react/components";

export default function InternalLink(props: RemixLinkProps & ChakraLinkProps) {
  return (
    <ChakraLink as={RemixLink} {...props}>
      {props.children}
    </ChakraLink>
  );
}
