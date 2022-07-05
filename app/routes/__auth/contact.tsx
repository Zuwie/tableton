import {
  Box,
  Heading,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import { CONTACT, DEFAULT_CARD_COLOR } from "~/constants";

export default function ContactPage() {
  const background = useColorModeValue(...DEFAULT_CARD_COLOR);

  return (
    <Stack spacing={8} mx={"auto"} w="100%" maxW={"xl"} py={12} px={6}>
      <Stack align={"center"}>
        <Heading as="h1" fontSize={"4xl"} textAlign={"center"}>
          Contact
        </Heading>
        <Text fontSize={"lg"} color={"gray.600"}>
          the sole developer and owner of this project 💬
        </Text>
      </Stack>

      <Box rounded={"lg"} bg={background} boxShadow={"lg"} p={8}>
        <Stack spacing={6}>
          <Heading fontSize={"lg"} textAlign={"center"}>
            You have suggestion? Feedback? I greatly appreciate it and look
            forward to have a chat!
          </Heading>
          <Text>
            You can either reach me on{" "}
            <Link
              href={`https://discord.com/channels/@me/${CONTACT.DISCORD}`}
              fontWeight={"bold"}
            >
              Discord
            </Link>{" "}
            <Link href={CONTACT.EMAIL} fontWeight={"bold"}>
              Email
            </Link>{" "}
            or{" "}
            <Link href={CONTACT.TWITTER} fontWeight={"bold"}>
              Twitter
            </Link>{" "}
            and I will try to get back to you within a day.
          </Text>
        </Stack>
      </Box>
    </Stack>
  );
}
