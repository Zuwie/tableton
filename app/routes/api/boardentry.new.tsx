import type { ActionFunction } from "@remix-run/node";
import type { createBoardEntry } from "~/models/board.server";

type ActionData = {
  boardEntry: Awaited<ReturnType<typeof createBoardEntry>>;
};

/**
 * It gets a list of users from the database, and returns a JSON response with the list of users
 * @param  - LoaderFunction
 * @returns A function that returns a promise that resolves to a response object.
 */
export const action: ActionFunction = async ({ request, params }) => {
  console.log("request", request);
  console.log("params", params);
  // @ts-ignore
  // const { id, title, content } = request.body;
  //
  // const user = await getUserByDiscordId(id);

  return "yo";
  // const boardEntry = await createBoardEntry({
  //   title,
  //   body: content,
  //   gameSystem: "WARHAMMER_40k",
  //   location: "Bot Town",
  //   date: new Date(),
  //   status: 0,
  //   // @ts-ignore
  //   userId: user.id,
  // });
  // return await cors(request, json<ActionData>({ boardEntry }));
};
