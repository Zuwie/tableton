import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import type { User } from "~/models/user.server";
import { getUserById } from "~/models/user.server";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

/* Creating a session storage object. */
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const USER_SESSION_KEY = "userId";

/**
 * It gets the session from the session storage
 * @param {Request} request - Request - The request object that was sent to the server.
 * @returns A promise that resolves to a session object.
 */
export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

/**
 * It gets the user ID from the session
 * @param {Request} request - Request - The request object from the route handler.
 * @returns The user id from the session.
 */
export async function getUserId(
  request: Request
): Promise<User["id"] | undefined> {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}

/**
 * It gets the user id from the request, gets the user from the database, and returns the user. If the user id is not
 * found, it logs the user out
 * @param {Request} request - Request - The request object from the client.
 * @returns The user object
 */
export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (userId === undefined) return null;

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
}

/**
 * It redirects to the login page if the user is not logged in, otherwise it returns the user's ID
 * @param {Request} request - The request object that was passed to the handler.
 * @param {string} redirectTo - The URL to redirect to after the user logs in.
 * @returns The userId is being returned.
 */
export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

/**
 * It returns the user object if the user is logged in, otherwise it throws an error
 * @param {Request} request - Request - The request object from the route handler.
 * @returns The user object
 */
export async function requireUser(request: Request) {
  const userId = await requireUserId(request);

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
}

/**
 * It creates a user session by setting the user ID in the session, and then redirecting to the given URL
 * @param  - request - The request object from the Next.js API.
 * @returns A redirect to the redirectTo url with a cookie set.
 */
export async function createUserSession({
  request,
  userId,
  remember,
  redirectTo,
}: {
  request: Request;
  userId: string;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

/**
 * It gets the session, destroys it, and redirects to the homepage
 * @param {Request} request - The request object that was sent to the server.
 * @returns A redirect to the root path with a cookie that destroys the session.
 */
export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
