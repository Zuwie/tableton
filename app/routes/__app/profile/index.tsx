import { Box, Heading, Stack, useColorModeValue } from "@chakra-ui/react";
import type { MetaFunction } from "@remix-run/node";
import * as React from "react";

export const meta: MetaFunction = () => {
  return {
    title: "Profile",
  };
};

export default function ProfileIndexPage() {
  return (
    <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
      <Stack align={"center"}>
        <Heading fontSize={"4xl"}>Profile</Heading>
      </Stack>
      <Box
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        p={8}
      >
        Favorite Faction
      </Box>
    </Stack>
  );
}
