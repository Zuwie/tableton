import { useMatches } from "@remix-run/react";
import { useEffect, useMemo } from "react";

import type { User } from "~/models/user.server";
import { useDataRefresh } from "remix-utils";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.email === "string";
}

/**
 * It returns the user from the root data, if it exists and is a user
 * @returns A user object or undefined
 */
export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

/**
 * `useUser` is a hook that returns the user from the root loader, or throws an error if the user is not found
 * @returns A user object
 */
export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

/**
 * "Get a random entry from an array."
 *
 * The function takes an array as an argument and returns a random entry from that array
 * @param {Type[]} entry - The array you want to get a random entry from.
 * @returns A random entry from the array.
 */
export function getRandomEntry<Type>(entry: Type[]) {
  return entry[Math.floor(Math.random() * entry.length)];
}

/**
 * Every 5 seconds, refresh the data.
 */
export function useDataRefreshOnInterval() {
  let { refresh } = useDataRefresh();
  useEffect(() => {
    let interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [refresh]);
}
