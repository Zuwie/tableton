import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

import type { User } from "~/models/user.server";
import { json } from "@remix-run/node";

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
 * "If the type of the email parameter is a string, and the string is longer than 3 characters, and the string includes an
 * @ symbol, then the function will return true, otherwise it will return false."
 *
 * The above function is a type guard. It's a function that takes a parameter, and returns true or false depending on
 * whether the parameter is of a certain type
 * @param {unknown} email - unknown - this is the parameter that we're going to validate.
 * @returns A function that takes an email and returns a boolean
 */
export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

/**
 * "If the password is not a string or is empty, return a 400 response with an error message. If the password is less than
 * 8 characters, return a 400 response with an error message."
 *
 * The function is a little more complicated than that, but that's the gist of it
 * @param {unknown} password - unknown
 * @returns A function that takes a password and returns a json object
 */
export function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }
}

/**
 * If the firstName is not a string or is an empty string, return a 400 status code with an error message
 * @param {unknown} firstName - The first name of the user.
 * @returns A function that returns a json object
 */
export function validateFirstName(firstName: unknown) {
  if (typeof firstName !== "string" || firstName.length === 0) {
    return json(
      { errors: { firstName: "Firstname is required" } },
      { status: 400 }
    );
  }
}

/**
 * If the lastName is not a string, return a 400 status code with an error message
 * @param {unknown} lastName - The value of the lastName field in the request body.
 * @returns A function that returns a json object
 */
export function validateLastName(lastName: unknown) {
  if (typeof lastName !== "string") {
    return json(
      { errors: { lastName: "Lastname should only contain letters" } },
      { status: 400 }
    );
  }
}
