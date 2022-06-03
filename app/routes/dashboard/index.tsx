import { NavLink, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getBoardEntryListItems } from "~/models/board.server";
import { requireUserId } from "~/session.server";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
} from "@chakra-ui/react";

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
        <Grid templateColumns="repeat(4, 1fr)" gap={6}>
          {loader.userBoardEntries.map((entry) => (
            <GridItem
              w="100%"
              bg="white"
              key={entry.id}
              maxW="sm"
              borderWidth="3px"
              borderRadius="lg"
            >
              <NavLink to={entry.id}>
                <Box p="6">
                  <Heading as="h3">{entry.title}</Heading>
                </Box>
              </NavLink>
            </GridItem>
          ))}
        </Grid>
      )}
    </>
  );
}
