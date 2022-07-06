import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { BASE_URL } from "~/constants";

export const loader: LoaderFunction = async ({ request }) => {
  const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
  const redirectUrl = encodeURIComponent(`${BASE_URL}/api/discord/callback`);

  return redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${redirectUrl}&response_type=code&scope=identify%20email`
  );
};
