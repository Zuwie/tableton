import { NavLink, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getBoardEntryListItems } from "~/models/board.server";
import { requireUserId } from "~/session.server";
import { Box, Button, Grid, GridItem, Heading, Text } from "@chakra-ui/react";

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
      <Heading as="h1">Find matches</Heading>

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
              borderWidth="1px"
              borderRadius="lg"
            >
              <NavLink
                to={entry.id}
                className={({ isActive }) =>
                  `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                }
              >
                <Box p="6">
                  <Heading as="h3">{entry.title}</Heading>
                </Box>
              </NavLink>
            </GridItem>
          ))}
        </Grid>
      )}
      <NavLink to="new">
        <Button as={"span"}>+ New Entry</Button>
      </NavLink>
    </>
  );
}
