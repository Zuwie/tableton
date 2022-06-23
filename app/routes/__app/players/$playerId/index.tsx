import { useLoaderData } from "@remix-run/react";
import {
  getContactInformationForUser,
  getExtendedProfileForUser,
  getUserById,
} from "~/models/user.server";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import {
  Avatar,
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  useClipboard,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { ROUTES } from "~/constants";
import * as React from "react";
import { getUserId } from "~/session.server";
import RemixLink from "~/components/RemixLink";
import { getBoardEntryListItemsFromUser } from "~/models/board.server";
import ProfileGrid from "~/components/ProfileGrid";

export const meta: MetaFunction = () => {
  return {
    title: "Player Profile",
  };
};

type LoaderData = {
  user: Awaited<ReturnType<typeof getUserById>>;
  boardEntries: Awaited<ReturnType<typeof getBoardEntryListItemsFromUser>>;
  extendedProfile: Awaited<ReturnType<typeof getExtendedProfileForUser>>;
  contact: Awaited<ReturnType<typeof getContactInformationForUser>>;
};

/**
 * It loads a player by id
 * @param  - LoaderFunction
 * @returns A function that returns a promise that resolves to a JSON object.
 */
export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.playerId, "playerId not found");

  /* If the user is trying to view their own profile, redirect them to their profile page. */
  const currentUserId = await getUserId(request);
  if (currentUserId === params.playerId) throw redirect(ROUTES.PROFILE);

  const user = await getUserById(params.playerId);
  if (!user) throw new Response("Not Found", { status: 404 });

  const extendedProfile = await getExtendedProfileForUser({
    userId: params.playerId,
  });
  const contact = await getContactInformationForUser({
    userId: params.playerId,
  });
  const boardEntries = await getBoardEntryListItemsFromUser({
    userId: params.playerId,
  });

  return json<LoaderData>({ user, extendedProfile, contact, boardEntries });
};

/**
 * It's a React component that uses the `useLoaderData` hook to get the data from the `Loader` component, and then it
 * renders the player's first name
 * @returns A React element
 */
export default function PlayerDetailsPage() {
  const loader = useLoaderData() as LoaderData;
  const background = useColorModeValue("white", "gray.700");
  const { hasCopied, onCopy } = useClipboard(loader.contact?.discord || "");
  const toast = useToast();

  return (
    <Stack spacing={8}>
      <Box mt="10">
        <RemixLink to={ROUTES.PLAYERS}>
          {/* TODO: adjust link depending on where user came from e.g. dashboardEntry */}
          <Button as={"span"} colorScheme="teal">
            Back to players
          </Button>
        </RemixLink>
      </Box>

      <Stack align={"center"}>
        <HStack>
          <Heading as="h1" fontSize={"4xl"}>
            Profile of {loader.user?.firstName}
          </Heading>
          <Avatar
            size="md"
            src={loader.user?.avatar || undefined}
            name={`${loader.user?.firstName} ${loader.user?.lastName}`}
          />{" "}
        </HStack>
      </Stack>

      <ProfileGrid
        bg={background}
        loader={loader}
        onClick={() => {
          toast({
            title: "Account created.",
            description: "We've created your account for you.",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          onCopy();
        }}
      />
    </Stack>
  );
}
