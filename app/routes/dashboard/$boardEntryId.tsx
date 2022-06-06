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

type LoaderData = {
  boardEntry: Awaited<ReturnType<typeof getBoardEntry>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.boardEntryId, "boardEntryId not found");

  const boardEntry = await getBoardEntry({ userId, id: params.boardEntryId });
  if (!boardEntry) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ boardEntry });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.boardEntryId, "boardEntryId not found");

  await deleteBoardEntry({ userId, id: params.boardEntryId });

  return redirect("/dashboard");
};

export default function BoardEntryDetailsPage() {
  const { id } = useUser();
  const data = useLoaderData() as LoaderData;

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

          <Box pos="relative">
            <Heading as="h1" pr={10}>
              {data.boardEntry?.title}
            </Heading>
            <Avatar
              size={"sm"}
              src={data.boardEntry?.user.avatar || undefined}
              name={`${data.boardEntry?.user.firstName} ${data.boardEntry?.user.lastName}`}
              pos="absolute"
              top={0}
              right={0}
            />
          </Box>

          <Text>{data.boardEntry?.body}</Text>

          {id === data.boardEntry?.user.id && (
            <>
              <Divider />

              <Form method="post">
                <Button type="submit" colorScheme="red">
                  Delete entry
                </Button>
              </Form>
            </>
          )}
        </Stack>
      </Box>
    </>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>BoardEntry not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
