import { NavLink, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getBoardEntryListItems } from "~/models/board.server";
import { requireUserId } from "~/session.server";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Stack,
  Tag,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { GAME_SYSTEM } from "~/constants";

type LoaderData = {
  userBoardEntries: Awaited<ReturnType<typeof getBoardEntryListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const userBoardEntries = await getBoardEntryListItems({ userId });
  return json<LoaderData>({ userBoardEntries });
};

export default function DashboardIndexPage() {
  const loader = useLoaderData() as LoaderData;
  const backGround = useColorModeValue("white", "gray.700");

  return (
    <>
      <Flex justifyContent="space-between" mt="10" mb="20">
        <Heading as="h1">Find matches</Heading>
        <NavLink to="new">
          <Button as={"span"} colorScheme="teal">
            + New Entry
          </Button>
        </NavLink>
      </Flex>

      {loader.userBoardEntries.length === 0 ? (
        <Text>No board-entries yet</Text>
      ) : (
        <Grid templateColumns="repeat(auto-fit, minmax(20rem, 1fr))" gap={6}>
          {loader.userBoardEntries.map((entry) => (
            <GridItem
              rounded={"lg"}
              boxShadow={"lg"}
              bg={backGround}
              key={entry.id}
            >
              <NavLink to={entry.id}>
                <Box p="6" h="100%" pos="relative">
                  <Avatar
                    size={"sm"}
                    src={entry.user.avatar || undefined}
                    name={`${entry.user.firstName} ${entry.user.lastName}`}
                    pos="absolute"
                    top={6}
                    right={6}
                  />

                  <Stack spacing={4}>
                    <Heading as="h3" pr={10}>
                      {entry.title}
                    </Heading>

                    <HStack spacing={4}>
                      <Tag>
                        {
                          GAME_SYSTEM[
                            entry.gameSystem as keyof typeof GAME_SYSTEM
                          ]
                        }
                      </Tag>
                      <Tag>{new Date(entry.date).toLocaleDateString()}</Tag>
                    </HStack>
                  </Stack>
                </Box>
              </NavLink>
            </GridItem>
          ))}
        </Grid>
      )}
    </>
  );
}
