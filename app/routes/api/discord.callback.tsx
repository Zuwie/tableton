import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  addDiscordToUser,
  createUser,
  getUserByEmail,
} from "~/models/user.server";
import { BASE_URL, ROUTES } from "~/constants";
import { createUserSession, getUserId } from "~/session.server";
import type { TokenRequestResult, User as DiscordUser } from "discord-oauth2";

const DiscordOauth2 = require("discord-oauth2");

/**
 * It takes the code from the URL, exchanges it for an access token, uses the access token to get the user's information,
 * creates a user in the database if they don't already exist, and then creates a session for them
 * @param  - `request` - The request object from the client.
 * @returns A promise that resolves to a UserSession
 */
export const loader: LoaderFunction = async ({ request, params }) => {
  const url = new URL(request.url);
  const search = new URLSearchParams(url.search);
  const code = search.get("code");
  const oauth = new DiscordOauth2();
  const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
  const currentUserId = await getUserId(request);

  const tokenRequest: TokenRequestResult = await oauth.tokenRequest({
    clientId: DISCORD_CLIENT_ID,
    clientSecret: DISCORD_CLIENT_SECRET,
    code: code,
    scope: "identify",
    grantType: "authorization_code",
    redirectUri: `${BASE_URL}/api/discord/callback`,
  });

  const userResult: DiscordUser = await oauth.getUser(
    tokenRequest.access_token
  );

  /* If the user is already logged in, then we add the discord information to their
  account and redirect them back to the settings page. */
  if (currentUserId) {
    await addDiscordToUser({
      userId: currentUserId,
      discordId: userResult.id,
      discordRefreshToken: tokenRequest.refresh_token,
    });
    throw redirect(ROUTES.SETTINGS);
  }

  /* Check if user already exists and if so, login when discordId matches otherwise
    let user know that someone has already registered with this email */
  const existingUser = await getUserByEmail(userResult.email as string);

  if (existingUser) {
    if (existingUser.discordId === userResult.id) {
      return createUserSession({
        request,
        userId: existingUser.id,
        remember: false,
        redirectTo: ROUTES.PROFILE,
      });
    } else {
      throw new Error("A user already exists with this email");
    }
  }

  /* Creating a user with the discord information and then creating a session for them. */
  const user = await createUser({
    email: userResult.email as string,
    password: "",
    userName: userResult.username,
    avatar: userResult.avatar?.toString(),
    discordId: userResult.id,
    discordRefreshToken: tokenRequest.refresh_token,
  });

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo: ROUTES.PROFILE,
  });
};
