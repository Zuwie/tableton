import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getBoardEntryListItems } from "~/models/board.server";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Spacer,
  Stack,
  Tag,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { GAME_SYSTEM } from "~/constants";
import * as React from "react";
import InternalLink from "~/components/InternalLink";
import { requireUserId } from "~/session.server";
import { ClientOnly } from "remix-utils";

export const meta: MetaFunction = () => {
  return {
    title: "Dashboard",
  };
};

type LoaderData = {
  userBoardEntries: Awaited<ReturnType<typeof getBoardEntryListItems>>;
};

/**
 * It gets the user's board entries and returns them as JSON
 * @param  - LoaderFunction - This is the type of the function that will be called when the page is loaded.
 * @returns The userBoardEntries are being returned.
 */
export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const userBoardEntries = await getBoardEntryListItems();
  return json<LoaderData>({ userBoardEntries });
};

export default function DashboardIndexPage() {
  const loader = useLoaderData() as LoaderData;
  const backGround = useColorModeValue("white", "gray.700");

  return (
    <>
      <Flex justifyContent="space-between" mt="10" mb="20">
        <Heading as="h1">Find matches</Heading>
        <InternalLink to="new">
          <Button as={"span"} colorScheme="teal">
            + New Entry
          </Button>
        </InternalLink>
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
              <InternalLink to={entry.id}>
                <Box pos="relative" p="6" h="100%">
                  <Avatar
                    size={"sm"}
                    src={entry.user.avatar || undefined}
                    name={`${entry.user.firstName} ${entry.user.lastName}`}
                    pos="absolute"
                    top={6}
                    right={6}
                  />

                  <Stack spacing={4} justifyContent="space-between" h="100%">
                    <Heading as="h3" pr={10}>
                      {entry.title}
                    </Heading>

                    <Stack spacing={2}>
                      <HStack spacing={2}>
                        <Tag>
                          {
                            GAME_SYSTEM[
                              entry.gameSystem as keyof typeof GAME_SYSTEM
                            ]
                          }
                        </Tag>
                        <Spacer />
                        <ClientOnly>
                          {() => (
                            <Tag>
                              {new Date(entry.date).toLocaleDateString()}
                            </Tag>
                          )}
                        </ClientOnly>
                        <ClientOnly>
                          {() => (
                            <Tag>
                              {new Date(entry.date).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Tag>
                          )}
                        </ClientOnly>
                      </HStack>
                      <HStack>
                        <Spacer />
                        <Tag>{entry.location}</Tag>
                      </HStack>
                    </Stack>
                  </Stack>
                </Box>
              </InternalLink>
            </GridItem>
          ))}
        </Grid>
      )}
    </>
  );
}
