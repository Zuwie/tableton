import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getUserByDiscordId } from "~/models/user.server";
import { cors } from "remix-utils";
import { createBoardEntry } from "~/models/board.server";

type ActionData = {
  boardEntry: Awaited<ReturnType<typeof createBoardEntry>>;
};

/**
 * It gets a list of users from the database, and returns a JSON response with the list of users
 * @param  - LoaderFunction
 * @returns A function that returns a promise that resolves to a response object.
 */
export const action: ActionFunction = async ({ request, params }) => {
  const { id, title, content } = await request.json();

  const user = await getUserByDiscordId(id);

  if (!user) throw new Error("User with given discord-id doesn't exist.");

  const boardEntry = await createBoardEntry({
    title,
    body: content,
    gameSystem: "WARHAMMER_40k",
    location: "Bot Town",
    date: new Date(),
    status: 0,
    userId: user.id,
  });
  return await cors(request, json<ActionData>({ boardEntry }));
};
