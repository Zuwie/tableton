import Header from "~/components/Header";
import { Flex, useColorModeValue } from "@chakra-ui/react";
import * as React from "react";
import { Outlet } from "@remix-run/react";
import Footer from "~/components/Footer";

export default function __auth() {
  return (
    <>
      <Header />

      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.900")}
      >
        <Outlet />
      </Flex>

      <Footer />
    </>
  );
}
