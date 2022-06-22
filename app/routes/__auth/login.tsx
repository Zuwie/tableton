import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";

import { createUserSession, getUserId } from "~/session.server";
import { verifyLogin } from "~/models/user.server";
import { safeRedirect, validateEmail, validatePassword } from "~/utils";
import { ROUTES } from "~/constants";

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), ROUTES.DASHBOARD);
  const remember = formData.get("remember");

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 }
    );
  }

  validatePassword(password);

  const user = await verifyLogin(email, password as string);

  if (!user) {
    return json<ActionData>(
      { errors: { email: "Invalid email or password" } },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on",
    redirectTo,
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Login",
  };
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || ROUTES.DASHBOARD;
  const actionData = useActionData() as ActionData;
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
        <Heading fontSize={"4xl"}>Sign in to your account</Heading>
        <Text fontSize={"lg"} color={"gray.600"}>
          to enjoy all of our cool{" "}
          <Link to={ROUTES.FEATURES} color={"blue.400"}>
            features
          </Link>{" "}
          ✌️
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
              <Input
                ref={passwordRef}
                autoComplete="current-password"
                type="password"
                name="password"
              />
              {actionData?.errors?.password && (
                <FormErrorMessage id="password-error">
                  {actionData.errors.password}
                </FormErrorMessage>
              )}
            </FormControl>

            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox name="remember">Remember me</Checkbox>
                <Link to={ROUTES.RESET_PASSWORD} color={"blue.400"}>
                  Forgot password?
                </Link>
              </Stack>
              <Button type="submit" colorScheme="teal">
                Sign in
              </Button>
            </Stack>
            <Stack>
              <Text fontSize={"sm"} align={"center"}>
                Don't have an account?{" "}
                <Link
                  to={{
                    pathname: ROUTES.JOIN,
                    search: searchParams.toString(),
                  }}
                >
                  Sign up
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Form>
      </Box>
    </Stack>
  );
}
