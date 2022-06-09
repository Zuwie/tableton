import { useLoaderData } from "@remix-run/react";
import { getUserById } from "~/models/user.server";
import type { LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { json } from "@remix-run/node";

type LoaderData = {
  player: Awaited<ReturnType<typeof getUserById>>;
};

/**
 * It loads a player by id
 * @param  - LoaderFunction
 * @returns A function that returns a promise that resolves to a JSON object.
 */
export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.playerId, "playerId not found");

  const player = await getUserById(params.playerId);
  if (!player) throw new Response("Not Found", { status: 404 });

  return json<LoaderData>({ player });
};

/**
 * It's a React component that uses the `useLoaderData` hook to get the data from the `Loader` component, and then it
 * renders the player's first name
 * @returns A React element
 */
export default function PlayerDetailsPage() {
  const data = useLoaderData() as LoaderData;

  return <>yo {data.player?.firstName}</>;
}
