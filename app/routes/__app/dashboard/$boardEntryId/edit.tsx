import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import * as React from "react";
import { useEffect } from "react";
import { requireUserId } from "~/session.server";
import { getBoardEntry, updateBoardEntry } from "~/models/board.server";
import { GAME_SYSTEM, ROUTES } from "~/constants";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Select,
  Stack,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import InternalLink from "~/components/InternalLink";
import invariant from "tiny-invariant";
import {
  validateBody,
  validateDate,
  validateGameSystem,
  validateLocation,
  validateTime,
  validateTitle,
} from "~/utils/validateBoardEntry";

export const meta: MetaFunction = () => {
  return {
    title: "Edit board-entry",
  };
};

type LoaderData = {
  boardEntry: Awaited<ReturnType<typeof getBoardEntry>>;
};

type ActionData = {
  errors?: {
    title?: string;
    body?: string;
    gameSystem?: string;
    location?: string;
    date?: string;
    time?: string;
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.boardEntryId, "boardEntryId not found");

  const boardEntry = await getBoardEntry({ id: params.boardEntryId });
  if (!boardEntry) throw new Response("Not Found", { status: 404 });

  return json<LoaderData>({ boardEntry });
};

/**
 * It takes the form data from the request, validates it, and then creates a new board entry
 * @param  - `title` - The title of the board entry
 * @returns A function that takes an object with a request property and returns a promise that resolves to a redirect to
 * the dashboard with the id of the newly created board entry.
 */
export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.boardEntryId, "boardEntryId not found");
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const gameSystem = formData.get("gameSystem") as string;
  const location = formData.get("location") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;

  validateTitle(title);
  validateBody(body);
  validateGameSystem(gameSystem);
  validateLocation(location);
  validateDate(date);
  validateTime(time);

  const dateFormat = new Date(date + " " + time);

  const boardEntry = await updateBoardEntry({
    id: params.boardEntryId,
    title,
    body,
    gameSystem,
    location,
    date: dateFormat,
  });

  return redirect(`${ROUTES.DASHBOARD}/${boardEntry.id}`);
};

/* A React component that renders a form to create a new board entry. */
export default function EditBoardEntryPage() {
  const loader = useLoaderData() as LoaderData;
  const actionData = useActionData() as ActionData;
  const titleRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);
  const locationRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    }
  }, [actionData]);

  return (
    <>
      <Box mt="10" mb="20">
        <InternalLink to={ROUTES.DASHBOARD}>
          <Button as={"span"} colorScheme="teal">
            Back to dashboard
          </Button>
        </InternalLink>
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
        <Form method="post">
          <Stack spacing={10}>
            <Stack spacing={4}>
              <FormControl isRequired isInvalid={!!actionData?.errors?.title}>
                <FormLabel>Title</FormLabel>
                <Input
                  ref={titleRef}
                  name="title"
                  defaultValue={loader.boardEntry?.title}
                />
                {actionData?.errors?.title && (
                  <FormErrorMessage>{actionData.errors.title}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                isRequired
                isInvalid={!!actionData?.errors?.gameSystem}
              >
                <FormLabel>Select the game you want to play</FormLabel>
                <Select
                  name="gameSystem"
                  defaultValue={loader.boardEntry?.gameSystem}
                >
                  {Object.entries(GAME_SYSTEM).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Select>
                {actionData?.errors?.gameSystem && (
                  <FormErrorMessage>
                    {actionData.errors.gameSystem}
                  </FormErrorMessage>
                )}
              </FormControl>

              <HStack>
                <FormControl isRequired>
                  <FormLabel>Date</FormLabel>
                  <Input
                    type="date"
                    name="date"
                    defaultValue={new Date(loader.boardEntry?.date)
                      .toISOString()
                      .substr(0, 10)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Time</FormLabel>
                  <Input
                    type="time"
                    name="time"
                    pattern="[0-9]{2}:[0-9]{2}"
                    defaultValue={new Date(loader.boardEntry?.date)
                      .toISOString()
                      .substr(11, 8)}
                  />
                </FormControl>
              </HStack>

              <FormControl
                isRequired
                isInvalid={!!actionData?.errors?.location}
              >
                <FormLabel>Location</FormLabel>
                <Input
                  ref={locationRef}
                  name="location"
                  defaultValue={loader.boardEntry?.location}
                />
                {actionData?.errors?.location && (
                  <FormErrorMessage>
                    {actionData.errors.location}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl isRequired isInvalid={!!actionData?.errors?.body}>
                <FormLabel>Add any additional information here</FormLabel>
                <Textarea
                  ref={bodyRef}
                  name="body"
                  defaultValue={loader.boardEntry?.body}
                />
                {actionData?.errors?.body && (
                  <FormErrorMessage>{actionData.errors.body}</FormErrorMessage>
                )}
              </FormControl>
            </Stack>

            <Button type="submit" colorScheme="teal">
              Submit changes
            </Button>
          </Stack>
        </Form>
      </Box>
    </>
  );
}
