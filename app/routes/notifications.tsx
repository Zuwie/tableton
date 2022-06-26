import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getNotificationForUser } from "~/models/notification.server";
import { requireUserId } from "~/session.server";

/**
 * `LoaderDataNotifications` is an object with a property called `notifications` that is the result of the
 * `getNotificationForUser` function.
 * @property notifications - This is the data that will be loaded by the loader.
 */
export type LoaderDataNotifications = {
  notifications: Awaited<ReturnType<typeof getNotificationForUser>>;
};

/**
 * It gets the userId from the request, then gets the notifications for that userId, and then returns the notifications as
 * JSON
 * @param  - LoaderFunction
 * @returns The loader function is returning a function that takes a request object and returns a promise that resolves to
 * a json object.
 */
export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const notifications = await getNotificationForUser({ userId });

  return json<LoaderDataNotifications>({ notifications });
};
