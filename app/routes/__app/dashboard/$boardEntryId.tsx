import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, NavLink, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { requireUserId } from "~/session.server";
import { deleteBoardEntry, getBoardEntry } from "~/models/board.server";
import { GAME_SYSTEM, ROUTES } from "~/constants";
import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Divider,
  Heading,
  HStack,
  Spacer,
  Stack,
  Tag,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useUser } from "~/utils";
import { FiInbox, FiTrash } from "react-icons/fi";
import { createMatchRequest } from "~/models/matches.server";

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
  const userId = await requireUserId(request);
  invariant(params.boardEntryId, "boardEntryId not found");

  const formData = await request.formData();
  const action = formData.get("_action");

  if (action === "delete") {
    await deleteBoardEntry({ userId, id: params.boardEntryId });
    return redirect("/dashboard");
  }

  if (action === "sendMatchRequest") {
    await createMatchRequest({ userId, id: params.boardEntryId });
  }

  return null;
};

/* A React component that is being exported. */
export default function BoardEntryDetailsPage() {
  const { id } = useUser();
  const data = useLoaderData() as LoaderData;
  const matchIsRequestedByCurrentUser = data.boardEntry?.MatchRequest.some(
    (match) => match.fromUserId === id
  );

  return (
    <>
      <Box mt="10" mb="20">
        <NavLink to={ROUTES.DASHBOARD}>
          <Button as={"span"} colorScheme="teal">
            Back to dashboard
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
          <Stack spacing={2}>
            <HStack spacing={2}>
              <Tag>
                {
                  GAME_SYSTEM[
                    data.boardEntry?.gameSystem as keyof typeof GAME_SYSTEM
                  ]
                }
              </Tag>
              <Spacer />
              <Tag>
                {new Date(data.boardEntry?.date as Date).toLocaleDateString()}
              </Tag>
              <Tag>
                {new Date(data.boardEntry?.date as Date).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </Tag>
            </HStack>
            <HStack>
              <Spacer />
              <Tag>{data.boardEntry?.location}</Tag>
            </HStack>
          </Stack>

          <HStack justifyContent="space-between" gap={4}>
            <Heading as="h1">{data.boardEntry?.title}</Heading>
            <NavLink to={`${ROUTES.PLAYERS}/${data.boardEntry?.user.id}`}>
              <Avatar
                size="md"
                src={data.boardEntry?.user.avatar || undefined}
                name={`${data.boardEntry?.user.firstName} ${data.boardEntry?.user.lastName}`}
              />
            </NavLink>
          </HStack>

          <Text>{data.boardEntry?.body}</Text>

          <Divider />

          <ButtonGroup>
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

            {id === data.boardEntry?.user.id && (
              <Form method="post">
                <Button
                  type="submit"
                  colorScheme="red"
                  name="_action"
                  value="delete"
                >
                  <FiTrash />
                  Delete entry
                </Button>
              </Form>
            )}
          </ButtonGroup>
        </Stack>
      </Box>
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
