import { Box, Heading, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import * as React from "react";
import { DEFAULT_CARD_COLOR, DEFAULT_SUBTITLE_COLOR } from "~/constants";

export default function ResetPasswordPage() {
  const background = useColorModeValue(...DEFAULT_CARD_COLOR);
  const subtitleColor = useColorModeValue(...DEFAULT_SUBTITLE_COLOR);

  return (
    <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
      <Stack align={"center"}>
        <Heading fontSize={"4xl"} textAlign={"center"}>
          Reset your password
        </Heading>
        <Text fontSize={"lg"} color={subtitleColor}>
          to continue where you left off 💪🏽
        </Text>
      </Stack>
      <Box rounded={"lg"} bg={background} boxShadow={"lg"} p={8}>
        <Text>Working on it!</Text>
      </Box>
    </Stack>
  );
}
