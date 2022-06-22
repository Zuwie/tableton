import { NavLink, useLoaderData } from "@remix-run/react";
import { getUserById } from "~/models/user.server";
import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import {
  Avatar,
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ROUTES } from "~/constants";
import * as React from "react";
import { requireUserId } from "~/session.server";

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

  const userId = await requireUserId(request);
  if (userId === params.playerId) throw redirect(ROUTES.PROFILE);

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

  return (
    <>
      {/* TODO: adjust link depending on where user came from e.g. dashboardEntry */}
      <Box mt="10" mb="20">
        <NavLink to={ROUTES.PLAYERS}>
          <Button as={"span"} colorScheme="teal">
            Back to players
          </Button>
        </NavLink>
      </Box>

      <Box
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        maxW={"xl"}
        mx="auto"
        py={12}
        px={6}
      >
        <Stack spacing={10}>
          <HStack justifyContent="space-between" gap={4}>
            <Heading as="h1">{data.player?.firstName}</Heading>
            <Avatar
              size="md"
              src={data.player?.avatar || undefined}
              name={`${data.player?.firstName} ${data.player?.lastName}`}
            />{" "}
          </HStack>

          <Stack spacing={2}>
            <Heading as="h2" size="md">
              Bio
            </Heading>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Accusamus, assumenda aut corporis cumque eaque facere fuga fugiat
              harum id illum incidunt minus nemo nostrum officiis quasi sed unde
              velit voluptates?
            </Text>
          </Stack>
        </Stack>
      </Box>
    </>
  );
}
