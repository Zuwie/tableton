import { Button } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { ROUTES } from "~/constants";
import { FaDiscord } from "react-icons/fa";
import * as React from "react";

export default function DiscordButton({ buttonText }: { buttonText: string }) {
  return (
    <Button
      size={"lg"}
      w={"100%"}
      as={Link}
      to={ROUTES.DISCORD_AUTH}
      leftIcon={<FaDiscord />}
      bgGradient="linear(to-r, #5865F2, #7928CA)"
      mb={4}
      _hover={{ bgGradient: "linear(to-r, teal.500, #7928CA)" }}
    >
      {buttonText}
    </Button>
  );
}
