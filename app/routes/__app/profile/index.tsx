import {
  Heading,
  Stack,
  Text,
  useClipboard,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import * as React from "react";
import { getBoardEntryListItemsFromUser } from "~/models/board.server";
import { requireUserId } from "~/session.server";
import { useLoaderData } from "@remix-run/react";
import { ROUTES } from "~/constants";
import {
  getContactInformationForUser,
  getExtendedProfileForUser,
} from "~/models/user.server";
import ProfileGrid from "~/components/ProfileGrid";

export const meta: MetaFunction = () => {
  return {
    title: "Profile",
  };
};

type LoaderData = {
  boardEntries: Awaited<ReturnType<typeof getBoardEntryListItemsFromUser>>;
  extendedProfile: Awaited<ReturnType<typeof getExtendedProfileForUser>>;
  contact: Awaited<ReturnType<typeof getContactInformationForUser>>;
};

/**
 * It gets the userId from the request, then gets the board entries from the user, then returns the board entries as JSON
 * @param  - LoaderFunction
 * @returns A function that returns a promise that resolves to a json object.
 */
export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const extendedProfile = await getExtendedProfileForUser({ userId });
  const contact = await getContactInformationForUser({ userId });

  /* If the user has not completed the onboarding process, then redirect them to the onboarding page. */
  if (!extendedProfile) throw redirect(ROUTES.ONBOARDING);

  const boardEntries = await getBoardEntryListItemsFromUser({
    userId,
  });

  return json<LoaderData>({ boardEntries, extendedProfile, contact });
};

/**
 * It renders a page with a heading, a paragraph, a list of tags, a list of social media links, and a table of board
 * entries
 */
export default function ProfileIndexPage() {
  const background = useColorModeValue("white", "gray.700");
  const loader = useLoaderData() as LoaderData;
  const { hasCopied, onCopy } = useClipboard(loader.contact?.discord || "");
  const toast = useToast();

  return (
    <Stack spacing={8} mx={"auto"} maxW={"5xl"} py={12}>
      <Stack align={"center"}>
        <Heading as="h1" fontSize={"4xl"}>
          Profile
        </Heading>
        <Text fontSize={"lg"} color={"gray.600"}>
          give other players a heads-up about you 🥸
        </Text>
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
