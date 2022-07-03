import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { requireUserId } from "~/session.server";
import { deleteBoardEntry, getBoardEntry } from "~/models/board.server";
import { GAME_SYSTEM, ROUTES } from "~/constants";
import * as React from "react";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Spacer,
  Stack,
  Tag,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useUser } from "~/utils/utils";
import { FiInbox, FiTrash } from "react-icons/fi";
import { createMatchRequest } from "~/models/matches.server";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import InternalLink from "~/components/InternalLink";
import { HiPlus } from "react-icons/hi";
import { createNotification } from "~/models/notification.server";
import { ClientOnly } from "remix-utils";

export const meta: MetaFunction = () => {
  return {
    title: "Board-Entry-Details",
  };
};

type LoaderData = {
  boardEntry: Awaited<ReturnType<typeof getBoardEntry>>;
};

/**
 * It loads a board entry by id, and returns it as JSON
 * @param  - LoaderFunction
 * @returns The boardEntry is being returned.
 */
export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.boardEntryId, "boardEntryId not found");

  const boardEntry = await getBoardEntry({ id: params.boardEntryId });
  if (!boardEntry) throw new Response("Not Found", { status: 404 });

  return json<LoaderData>({ boardEntry });
};

/**
 * It deletes a board entry and redirects to the dashboard
 * @param  - ActionFunction
 * @returns The redirect function is being returned.
 */
export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.boardEntryId, "boardEntryId not found");
  const userId = await requireUserId(request);
  const boardEntry = await getBoardEntry({ id: params.boardEntryId });

  const formData = await request.formData();
  const action = formData.get("_action");

  if (!boardEntry) throw new Error("boardEntry not found");

  if (action === "delete") {
    await deleteBoardEntry({ userId, id: params.boardEntryId });
    return redirect(ROUTES.DASHBOARD);
  }

  if (action === "sendMatchRequest") {
    await createMatchRequest({ userId, id: params.boardEntryId });
    await createNotification({
      type: "MATCH_REQUEST_NEW",
      userId: boardEntry.user.id,
    });
  }

  return null;
};

/* A React component that is being exported. */
export default function BoardEntryDetailsPage() {
  const { id } = useUser();
  const loader = useLoaderData() as LoaderData;
  const matchIsRequestedByCurrentUser = loader.boardEntry?.matchRequests.some(
    (match) => match.fromUserId === id
  );
  const isOwner = id === loader.boardEntry?.user.id;
  const openMatchRequests = loader.boardEntry?.matchRequests.filter(
    (matchRequest) => matchRequest.status === 0
  ).length;

  const boxBg = useColorModeValue("white", "gray.700");

  return (
    <>
      <Box mt="10" mb="20">
        <InternalLink to={ROUTES.DASHBOARD}>
          <Button as={"span"} colorScheme="teal">
            Back to dashboard
          </Button>
        </InternalLink>
      </Box>

      <Stack
        direction={{ base: "column", md: "row-reverse" }}
        spacing={4}
        maxW={"4xl"}
        mx="auto"
      >
        {isOwner && (
          <VStack spacing={4} alignSelf="flex-start">
            <Box
              rounded={"lg"}
              bg={boxBg}
              boxShadow={"lg"}
              py={12}
              px={6}
              w={"100%"}
            >
              <Stack spacing={10}>
                <Heading fontSize="lg">Match requests</Heading>
                <InternalLink to={ROUTES.MATCH_REQUESTS}>
                  <Box rounded="lg" bg="orange.200" py={2} px={4}>
                    <HStack justifyContent="space-between">
                      {openMatchRequests === 0 ? (
                        <Text>No open match requests</Text>
                      ) : (
                        <Text>Open requests: {openMatchRequests}</Text>
                      )}
                      <ArrowForwardIcon />
                    </HStack>
                  </Box>
                </InternalLink>
              </Stack>
            </Box>
            <Box
              rounded={"lg"}
              bg={boxBg}
              boxShadow={"lg"}
              py={12}
              px={6}
              w={"100%"}
            >
              <Stack spacing={10}>
                <Heading fontSize="lg">Actions</Heading>
                <InternalLink to="edit">Edit</InternalLink>
              </Stack>
            </Box>
          </VStack>
        )}

        <Box
          rounded={"lg"}
          bg={boxBg}
          boxShadow={"lg"}
          maxW={"xl"}
          flexGrow={2}
          mx="auto"
          py={12}
          px={6}
        >
          <Stack spacing={10}>
            <Stack spacing={2}>
              <HStack spacing={2}>
                <Tag>
                  {
                    GAME_SYSTEM[
                      loader.boardEntry?.gameSystem as keyof typeof GAME_SYSTEM
                    ]
                  }
                </Tag>
                <Spacer />
                <ClientOnly>
                  {() => (
                    <Tag>
                      {new Date(
                        loader.boardEntry?.date as Date
                      ).toLocaleDateString()}
                    </Tag>
                  )}
                </ClientOnly>

                <ClientOnly>
                  {() => (
                    <Tag>
                      {new Date(
                        loader.boardEntry?.date as Date
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Tag>
                  )}
                </ClientOnly>
              </HStack>
              <HStack>
                <Spacer />
                <Tag>{loader.boardEntry?.location}</Tag>
              </HStack>
            </Stack>

            <HStack justifyContent="space-between" gap={4}>
              <Heading as="h1">{loader.boardEntry?.title}</Heading>
              <InternalLink
                to={`${ROUTES.PLAYERS}/${loader.boardEntry?.user.id}`}
              >
                <AvatarGroup size="md" max={2}>
                  <Avatar
                    size="md"
                    src={loader.boardEntry?.user.avatar || undefined}
                    name={`${loader.boardEntry?.user.firstName} ${loader.boardEntry?.user.lastName}`}
                  />
                  {loader.boardEntry?.challenger ? (
                    <Avatar
                      size="md"
                      src={loader.boardEntry?.challenger.avatar || undefined}
                      name={`${loader.boardEntry?.challenger.firstName} ${loader.boardEntry?.challenger.lastName}`}
                    />
                  ) : (
                    <Avatar bg="gray.200" icon={<HiPlus />} />
                  )}
                </AvatarGroup>
              </InternalLink>
            </HStack>

            <Text>{loader.boardEntry?.body}</Text>

            <Divider />

            <Stack flexWrap="wrap" gap={2}>
              <Form method="post">
                <Button
                  colorScheme="teal"
                  gap={2}
                  type="submit"
                  name="_action"
                  value="sendMatchRequest"
                  disabled={matchIsRequestedByCurrentUser}
                >
                  <FiInbox />
                  {matchIsRequestedByCurrentUser
                    ? "Match has been requested"
                    : "Send match request"}
                </Button>
              </Form>

              {isOwner && (
                <Form method="post">
                  <Button
                    colorScheme="red"
                    gap={2}
                    type="submit"
                    name="_action"
                    value="delete"
                  >
                    <FiTrash />
                    Delete entry
                  </Button>
                </Form>
              )}
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </>
  );
}

/**
 * It takes an error object as a prop, logs the error to the console, and renders a div with the error message
 * @param  - { error: Error }
 * @returns A React component that displays an error message.
 */
export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <div>An unexpected error occurred: {error.message}</div>;
}

/**
 * It catches errors and renders a different component based on the error status
 * @returns A React component that renders a div with the text "BoardEntry not found" if the status is 404, and throws an
 * error otherwise.
 */
export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>BoardEntry not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
