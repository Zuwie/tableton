import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, NavLink, useActionData } from "@remix-run/react";
import * as React from "react";
import { requireUserId } from "~/session.server";
import { createBoardEntry } from "~/models/board.server";
import { ROUTES } from "~/constants";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";

type ActionData = {
  errors?: {
    title?: string;
    body?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");

  if (typeof title !== "string" || title.length === 0) {
    return json<ActionData>(
      { errors: { title: "Title is required" } },
      { status: 400 }
    );
  }

  if (typeof body !== "string" || body.length === 0) {
    return json<ActionData>(
      { errors: { body: "Body is required" } },
      { status: 400 }
    );
  }

  const boardEntry = await createBoardEntry({ title, body, userId });

  return redirect(`/dashboard/${boardEntry.id}`);
};

export default function NewBoardEntryPage() {
  const actionData = useActionData() as ActionData;
  const titleRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);

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

              <FormControl isRequired isInvalid={!!actionData?.errors?.body}>
                <FormLabel>Body</FormLabel>
                <Textarea ref={bodyRef} name="body" />
                {actionData?.errors?.body && (
                  <FormErrorMessage>{actionData.errors.body}</FormErrorMessage>
                )}
              </FormControl>
            </Stack>

            <Button
              type="submit"
              bg={"teal.400"}
              color={"white"}
              _hover={{
                bg: "teal.500",
              }}
            >
              Create new entry
            </Button>
          </Stack>
        </Form>
      </Box>
    </>
  );
}
