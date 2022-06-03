import { Button, Heading, useColorMode } from "@chakra-ui/react";

export default function SettingsIndexPage() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Heading>Account Settings</Heading>
      <Button onClick={toggleColorMode}>
        Toggle {colorMode === "light" ? "Dark" : "Light"}
      </Button>
    </>
  );
}
