import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { logout } from "~/session.server";

/**
 * It takes a request object, and returns the result of calling the logout function with that request object
 * @param  - `request` - The request object from the client.
 * @returns The logout function is being returned.
 */
export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};
