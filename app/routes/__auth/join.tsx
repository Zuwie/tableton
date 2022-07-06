import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";
import { useState } from "react";
import { createUserSession, getUserId } from "~/session.server";
import { createUser, getUserByEmail } from "~/models/user.server";
import { safeRedirect } from "~/utils/utils";
import {
  DEFAULT_CARD_COLOR,
  DEFAULT_SUBTITLE_COLOR,
  ROUTES,
} from "~/constants";

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
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import InternalLink from "~/components/InternalLink";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "~/utils/validateUser";
import { FaDiscord } from "react-icons/fa";

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up",
  };
};

/**
 * If the user is logged in, redirect to the home page, otherwise return an empty object
 * @param  - LoaderFunction: This is the type of the loader function.
 * @returns An object with a key of "userId" and a value of the userId.
 */
export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

interface ActionData {
  errors: {
    email?: string;
    password?: string;
    userName?: string;
  };
}

/**
 * It creates a new user account and then creates a new session for that user
 * @param  - ActionFunction - This is a function that takes an object with a request property and returns a Promise that
 * resolves to an ActionData object.
 * @returns A function that takes an object with a request property and returns a promise that resolves to an object with
 * an errors property and a status property.
 */
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const userName = formData.get("userName");
  const redirectTo = safeRedirect(
    formData.get("redirectTo"),
    ROUTES.ONBOARDING
  );

  if (!validateEmail(email)) {
    return json({ errors: { email: "Email is invalid" } }, { status: 400 });
  }
  if (!validatePassword(password)) {
    return json(
      { errors: { password: "Password should contain at least 8 letters" } },
      { status: 400 }
    );
  }
  if (!validateUsername(userName)) {
    return json(
      { errors: { userName: "Username must contain at least 2 letters" } },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json<ActionData>(
      { errors: { email: "A user already exists with this email" } },
      { status: 400 }
    );
  }

  const user = await createUser({
    email,
    password,
    userName,
  });

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo,
  });
};

/**
 * It renders a form that allows a user to sign up for an account
 */
export default function JoinPage() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData() as ActionData;
  const [showPassword, setShowPassword] = useState(false);
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const background = useColorModeValue(...DEFAULT_CARD_COLOR);
  const subtitleColor = useColorModeValue(...DEFAULT_SUBTITLE_COLOR);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Stack spacing={8} mx={"auto"} maxW={"lg"} w={"100%"} py={12} px={6}>
      <Stack align={"center"}>
        <Heading fontSize={"4xl"} textAlign={"center"}>
          Sign up
        </Heading>
        <Text fontSize={"lg"} color={subtitleColor}>
          to enjoy all of our cool features ✌️
        </Text>
      </Stack>

      <Box rounded={"lg"} bg={background} boxShadow={"lg"} p={8}>
        <Button
          size={"lg"}
          w={"100%"}
          as={Link}
          to={ROUTES.DISCORD_AUTH}
          leftIcon={<FaDiscord />}
          bgGradient="linear(to-r, #5865F2, #7928CA)"
          mb={4}
          _hover={{ bgGradient: "linear(to-r, teal.500, #7928CA)" }}
        >
          Signup with Discord
        </Button>

        <Form method="post">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <Stack spacing={4}>
            <FormControl
              id="userName"
              isRequired
              isInvalid={!!actionData?.errors?.userName}
            >
              <FormLabel>Username</FormLabel>
              <Input type="text" name="userName" autoComplete="userName" />
              {actionData?.errors?.userName && (
                <FormErrorMessage>
                  {actionData.errors.userName}
                </FormErrorMessage>
              )}
            </FormControl>

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
              />
              {actionData?.errors?.email && (
                <FormErrorMessage>{actionData.errors.email}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl
              id="password"
              isRequired
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

            <Stack pt={6}>
              <Button
                type="submit"
                loadingText="Submitting"
                size="lg"
                colorScheme="teal"
              >
                Sign up
              </Button>
            </Stack>
            <Stack>
              <Text fontSize={"sm"} align={"center"}>
                Already a user?{" "}
                <InternalLink
                  to={{
                    pathname: ROUTES.LOGIN,
                    search: searchParams.toString(),
                  }}
                  color={"blue.400"}
                >
                  Login
                </InternalLink>
              </Text>
            </Stack>
          </Stack>
        </Form>
      </Box>
    </Stack>
  );
}
