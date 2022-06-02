import { NavLink, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getBoardEntryListItems } from "~/models/board.server";
import { requireUserId } from "~/session.server";
import { Button, Heading, Text } from "@chakra-ui/react";

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
      <Heading as="h1">This is the board</Heading>

      {loader.userBoardEntries.length === 0 ? (
        <Text>No board-entries yet</Text>
      ) : (
        <ol>
          {loader.userBoardEntries.map((entry) => (
            <li key={entry.id}>
              <NavLink
                to={entry.id}
                className={({ isActive }) =>
                  `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                }
              >
                {entry.title}
              </NavLink>
            </li>
          ))}
        </ol>
      )}
      <NavLink to="new">
        <Button as={"span"}>+ New Entry</Button>
      </NavLink>
    </>
  );
}
