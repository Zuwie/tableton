import { getUsers } from "~/models/user.server";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { cors } from "remix-utils";

type LoaderData = {
  users: Awaited<ReturnType<typeof getUsers>>;
};

/**
 * It gets a list of users from the database, and returns a JSON response with the list of users
 * @param  - LoaderFunction
 * @returns A function that returns a promise that resolves to a response object.
 */
export const loader: LoaderFunction = async ({ request }) => {
  const users = await getUsers();
  return await cors(request, json<LoaderData>({ users }));
};