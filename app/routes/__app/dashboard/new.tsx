import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";
import { requireUserId } from "~/session.server";
import { createBoardEntry } from "~/models/board.server";
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
    title: "Create a new board-entry",
  };
};

type ActionData = {
  errors?: {
    title?: string;
    body?: string;
    gameSystem?: string;
    location?: string;
    date?: string;
  };
};

/**
 * It takes the form data from the request, validates it, and then creates a new board entry
 * @param  - `title` - The title of the board entry
 * @returns A function that takes an object with a request property and returns a promise that resolves to a redirect to
 * the dashboard with the id of the newly created board entry.
 */
export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");
  const gameSystem = formData.get("gameSystem");
  const location = formData.get("location");
  const date = formData.get("date");
  const time = formData.get("time");

  if (!validateTitle(title)) {
    return json(
      {
        errors: {
          title: `Title is too short. It should at least be 8 letters long`,
        },
      },
      { status: 400 }
    );
  }
  if (!validateBody(body)) {
    return json(
      {
        errors: {
          body: `Body is too short. It should at least be 10 letters long`,
        },
      },
      { status: 400 }
    );
  }
  if (!validateGameSystem(gameSystem)) {
    return json(
      { errors: { body: "GameSystem is required" } },
      { status: 400 }
    );
  }
  if (!validateLocation(location)) {
    return json({ errors: { body: "Location is required" } }, { status: 400 });
  }
  if (!validateDate(date)) {
    return json({ errors: { body: "Date is required" } }, { status: 400 });
  }
  if (!validateTime(time)) {
    return json({ errors: { body: "Time is required" } }, { status: 400 });
  }

  const dateFormat = new Date(date + " " + time);

  const boardEntry = await createBoardEntry({
    title,
    body,
    gameSystem,
    location,
    date: dateFormat,
    userId,
    status: 0,
  });

  return redirect(`${ROUTES.DASHBOARD}/${boardEntry.id}`);
};

/* A React component that renders a form to create a new board entry. */
export default function NewBoardEntryPage() {
  const actionData = useActionData() as ActionData;
  const titleRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);
  const locationRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
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
                <Input ref={titleRef} name="title" />
                {actionData?.errors?.title && (
                  <FormErrorMessage>{actionData.errors.title}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                isRequired
                isInvalid={!!actionData?.errors?.gameSystem}
              >
                <FormLabel>Select the game you want to play</FormLabel>
                <Select name="gameSystem">
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
                  <Input type="date" name="date" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Time</FormLabel>
                  <Input type="time" name="time" pattern="[0-9]{2}:[0-9]{2}" />
                </FormControl>
              </HStack>

              <FormControl
                isRequired
                isInvalid={!!actionData?.errors?.location}
              >
                <FormLabel>Location</FormLabel>
                <Input ref={locationRef} name="location" />
                {actionData?.errors?.location && (
                  <FormErrorMessage>
                    {actionData.errors.location}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl isRequired isInvalid={!!actionData?.errors?.body}>
                <FormLabel>Add any additional information here</FormLabel>
                <Textarea ref={bodyRef} name="body" />
                {actionData?.errors?.body && (
                  <FormErrorMessage>{actionData.errors.body}</FormErrorMessage>
                )}
              </FormControl>
            </Stack>

            <Button type="submit" colorScheme="teal">
              Create new entry
            </Button>
          </Stack>
        </Form>
      </Box>
    </>
  );
}
