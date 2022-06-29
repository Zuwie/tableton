import { Box, Heading, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import * as React from "react";

export default function AboutPage() {
  return (
    <Stack spacing={8} mx={"auto"} w="100%" maxW={"xl"} py={12} px={6}>
      <Stack align={"center"}>
        <Heading as="h1" fontSize={"4xl"} textAlign={"center"}>
          About
        </Heading>
      </Stack>

      <Box
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        p={8}
      >
        <Stack spacing={6}>
          <Heading>Why did I create this app?</Heading>
          <Text>
            In 2021 I joined a local Discord-group by randomly talking to a
            player in a local game store. Joining that discord opened a whole
            world of players and community feeling for me which I would have
            missed out on if he didn't mention it. Players without a local
            Discord or game-store have a hard time finding other potential
            players and getting some games done.
          </Text>
          <Heading>Why not just use Discord?</Heading>
          <Text>
            Discord is a great tool for a community but when it comes down to
            getting a match done on a specific date/time it can lead to a lot of
            back and forth between players to get basic info out of each other.
            Especially when players want to plan a match a few weeks ahead it
            mostly gets buried in the never seen history of a chat.
          </Text>
        </Stack>
      </Box>
    </Stack>
  );
}
