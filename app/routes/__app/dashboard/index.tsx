import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getBoardEntryListItems } from "~/models/board.server";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  Select,
  Spacer,
  Stack,
  Tag,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { DEFAULT_CARD_COLOR, GAME_SYSTEM } from "~/constants";
import * as React from "react";
import { useState } from "react";
import InternalLink from "~/components/InternalLink";
import { requireUserId } from "~/session.server";
import { ClientOnly } from "remix-utils";
import dayjs from "dayjs";

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
  const background = useColorModeValue(...DEFAULT_CARD_COLOR);

  const [gameFilter, setGameFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  // const [timeFilter, setTimeFilter] = useState([0, 24]);

  const filteredBoardEntries = loader.userBoardEntries
    .filter((entry) => entry.gameSystem.includes(gameFilter))
    .filter((entry) =>
      entry.location.toLowerCase().includes(locationFilter.toLowerCase())
    )
    .filter((entry) => {
      return dateFilter === ""
        ? entry
        : dayjs(entry.date).diff(dayjs(dateFilter), "day") === 0;
    })
    .filter((entry) => {
      return entry;
    });

  return (
    <>
      <Flex justifyContent="space-between" mt="10" mb="16">
        <Heading as="h1">Find matches</Heading>
        <InternalLink to="new">
          <Button as={"span"} colorScheme="teal">
            + New Entry
          </Button>
        </InternalLink>
      </Flex>

      <HStack spacing={4} mb="8">
        <FormControl>
          <FormLabel>Game</FormLabel>
          <Select
            name="gameSystem"
            bg={gameFilter ? "gray.700" : "gray.900"}
            value={gameFilter}
            onChange={(value) => setGameFilter(value.target.value)}
          >
            <option value="">All</option>
            {Object.entries(GAME_SYSTEM).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Location</FormLabel>
          <Input
            type="text"
            name="location"
            value={locationFilter}
            onChange={(value) => setLocationFilter(value.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Date</FormLabel>
          <Input
            type="date"
            name="date"
            value={dateFilter}
            onChange={(value) => setDateFilter(value.target.value)}
          />
        </FormControl>
        {/*<FormControl>*/}
        {/*  <FormLabel>*/}
        {/*    Time: {timeFilter[0]}:00 - {timeFilter[1]}:00*/}
        {/*  </FormLabel>*/}
        {/*  <RangeSlider*/}
        {/*    name="time"*/}
        {/*    min={0}*/}
        {/*    max={24}*/}
        {/*    step={1}*/}
        {/*    colorScheme={"teal"}*/}
        {/*    defaultValue={timeFilter}*/}
        {/*    onChangeEnd={(value) => setTimeFilter(value)}*/}
        {/*  >*/}
        {/*    <RangeSliderTrack>*/}
        {/*      <RangeSliderFilledTrack />*/}
        {/*    </RangeSliderTrack>*/}
        {/*    <RangeSliderThumb boxSize={6} index={0} />*/}
        {/*    <RangeSliderThumb boxSize={6} index={1} />*/}
        {/*  </RangeSlider>*/}
        {/*</FormControl>*/}
      </HStack>

      {loader.userBoardEntries.length === 0 ? (
        <Text>No board-entries yet</Text>
      ) : (
        <Grid templateColumns="repeat(auto-fit, minmax(20rem, 1fr))" gap={6}>
          {filteredBoardEntries.map((entry) => (
            <GridItem
              rounded={"lg"}
              boxShadow={"lg"}
              bg={background}
              key={entry.id}
            >
              <InternalLink to={entry.id}>
                <Box pos="relative" p="6" h="100%">
                  <Avatar
                    size={"sm"}
                    src={entry.user.avatar || undefined}
                    name={`${entry.user.userName}`}
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
