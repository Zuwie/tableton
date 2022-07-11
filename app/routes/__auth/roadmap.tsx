import {
  Box,
  Heading,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import { CheckIcon, SettingsIcon } from "@chakra-ui/icons";
import { DEFAULT_CARD_COLOR, DEFAULT_SUBTITLE_COLOR } from "~/constants";

export default function RoadmapPage() {
  const background = useColorModeValue(...DEFAULT_CARD_COLOR);
  const subtitleColor = useColorModeValue(...DEFAULT_SUBTITLE_COLOR);

  return (
    <Stack spacing={8} mx={"auto"} w="100%" maxW={"lg"} py={12} px={6}>
      <Stack align={"center"}>
        <Heading as="h1" fontSize={"4xl"} textAlign={"center"}>
          Roadmap
        </Heading>
        <Text fontSize={"lg"} color={subtitleColor}>
          see what is planned for the future 👀
        </Text>
      </Stack>

      <Box rounded={"lg"} bg={background} boxShadow={"lg"} p={8}>
        <List spacing={4}>
          <ListItem>
            <ListIcon as={CheckIcon} color="green.500" /> Filters for board
          </ListItem>
          <ListItem>
            <ListIcon as={CheckIcon} color="green.500" /> Connect with Discord
          </ListItem>
          <ListItem>
            <ListIcon as={CheckIcon} color="green.500" /> Notifications
          </ListItem>
          <ListItem>
            <ListIcon as={SettingsIcon} color="orange.500" /> Player Profile
            Factions
          </ListItem>
          <ListItem>
            <ListIcon as={SettingsIcon} color="orange.500" /> Share
            Board-Entries on Social-Media
          </ListItem>
          <ListItem>
            <ListIcon as={SettingsIcon} color="orange.500" /> Support multiple
            languages
          </ListItem>
          <ListItem>
            <ListIcon as={SettingsIcon} color="orange.500" /> Discord Bot
            (automatically post new entries)
          </ListItem>
          <ListItem>
            <ListIcon as={SettingsIcon} color="orange.500" /> Chat for users
          </ListItem>
          <ListItem>
            <ListIcon as={SettingsIcon} color="orange.500" /> Achievement system
          </ListItem>
          <ListItem>
            <ListIcon as={SettingsIcon} color="orange.500" /> Upload army list
          </ListItem>
          <ListItem>
            <ListIcon as={SettingsIcon} color="orange.500" /> Match history with
            score
          </ListItem>
          <ListItem>
            <ListIcon as={SettingsIcon} color="orange.500" /> Report user
          </ListItem>
        </List>
      </Box>
    </Stack>
  );
}
