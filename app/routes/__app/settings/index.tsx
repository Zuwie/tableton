import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useUser } from "~/utils/utils";
import { getUserById, updateUser } from "~/models/user.server";
import { requireUserId } from "~/session.server";
import { Form, useActionData } from "@remix-run/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import * as React from "react";
import { useState } from "react";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "~/utils/validateUser";
import { DEFAULT_CARD_COLOR } from "~/constants";

export const meta: MetaFunction = () => {
  return {
    title: "Settings",
  };
};

interface ActionData {
  errors: {
    email?: string;
    password?: string;
    userName?: string;
  };
}

/**
 * It creates a new user and then creates a new session for that user
 * @param  - ActionFunction - This is a type that is defined in the `@types/server` package. It's a function that takes an
 * object with a `request` property and returns a `Promise<ActionData>`.
 * @returns A function that takes an object with a request property and returns a promise that resolves to an object with a
 * status property and a json property.
 */
export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const userName = formData.get("userName");

  if (!validateEmail(email)) {
    return json({ errors: { email: "Email is invalid" } }, { status: 400 });
  }

  /**
   * Only attempt to change password if user
   * added a value to the input-element
   */
  if (typeof password !== "string")
    return json({
      errors: {
        password: "Password must be a string.",
      },
    });
  if (password?.length > 0) {
    if (!validatePassword(password)) {
      return json(
        {
          errors: {
            password:
              "Password should contain at least 8 letters. " +
              "Leave empty if you didn't intend to change it.",
          },
        },
        { status: 400 }
      );
    }
  }

  if (!validateUsername(userName)) {
    return json(
      { errors: { userName: "Username must contain at least 2 letters" } },
      { status: 400 }
    );
  }

  const existingUser = await getUserById(userId);

  if (existingUser && existingUser.id !== userId) {
    return json<ActionData>(
      { errors: { email: "A user already exists with this email" } },
      { status: 400 }
    );
  }

  const user = await updateUser({
    email,
    userName,
    password,
    userId,
  });

  return null;
};

export default function SettingsIndexPage() {
  const actionData = useActionData() as ActionData;
  const user = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const background = useColorModeValue(...DEFAULT_CARD_COLOR);

  return (
    <Stack spacing={8} mx={"auto"} maxW={"md"} py={12}>
      <Stack align={"center"}>
        <Heading fontSize={"4xl"}>Account Settings</Heading>
        <Button onClick={toggleColorMode}>
          Toggle {colorMode === "light" ? "Dark" : "Light"}
        </Button>
      </Stack>
      <Box rounded={"lg"} bg={background} boxShadow={"lg"} p={8}>
        <Form method="post">
          <Stack spacing={4}>
            <Box>
              <FormControl
                id="userName"
                isRequired
                isInvalid={!!actionData?.errors?.userName}
              >
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  name="userName"
                  defaultValue={user.userName}
                />
                {actionData?.errors?.userName && (
                  <FormErrorMessage>
                    {actionData.errors.userName}
                  </FormErrorMessage>
                )}
              </FormControl>
            </Box>

            <FormControl
              id="email"
              isRequired
              isInvalid={!!actionData?.errors?.email}
            >
              <FormLabel>Email address</FormLabel>
              <Input
                ref={emailRef}
                autoComplete="email"
                type="email"
                name="email"
                defaultValue={user.email}
              />
              {actionData?.errors?.email && (
                <FormErrorMessage>{actionData.errors.email}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl
              id="password"
              isInvalid={!!actionData?.errors?.password}
            >
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  name="password"
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {actionData?.errors?.password && (
                <FormErrorMessage id="password-error">
                  {actionData.errors.password}
                </FormErrorMessage>
              )}
            </FormControl>

            <Stack spacing={10} pt={2}>
              <Button
                type="submit"
                loadingText="Submitting"
                size="lg"
                colorScheme="teal"
              >
                Update profile
              </Button>
            </Stack>
          </Stack>
        </Form>
      </Box>
    </Stack>
  );
}
