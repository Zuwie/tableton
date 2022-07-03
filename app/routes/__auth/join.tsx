import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";
import { useState } from "react";
import { createUserSession, getUserId } from "~/session.server";
import { createUser, getUserByEmail } from "~/models/user.server";
import { safeRedirect } from "~/utils/utils";
import { ROUTES } from "~/constants";

import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
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
  validateFirstName,
  validateLastName,
  validatePassword,
} from "~/utils/validateUser";

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
    firstName?: string;
    lastName?: string;
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
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const redirectTo = safeRedirect(
    formData.get("redirectTo"),
    ROUTES.ONBOARDING
  );

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 }
    );
  }

  validatePassword(password);
  validateFirstName(firstName);
  validateLastName(lastName);

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json<ActionData>(
      { errors: { email: "A user already exists with this email" } },
      { status: 400 }
    );
  }

  let avatar;
  const user = await createUser(
    email,
    password as string,
    firstName as string,
    lastName as string,
    (avatar = null)
  );

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

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
      <Stack align={"center"}>
        <Heading fontSize={"4xl"} textAlign={"center"}>
          Sign up
        </Heading>
        <Text fontSize={"lg"} color={"gray.600"}>
          to enjoy all of our cool features ✌️
        </Text>
      </Stack>

      <Box
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        p={8}
      >
        <Form method="post">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type="text"
                    name="firstName"
                    autoComplete="firstName"
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName">
                  <FormLabel>Last Name</FormLabel>
                  <Input type="text" name="lastName" autoComplete="lastName" />
                </FormControl>
              </Box>
            </HStack>

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

            <Stack spacing={10} pt={2}>
              <Button
                type="submit"
                loadingText="Submitting"
                size="lg"
                colorScheme="teal"
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
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
