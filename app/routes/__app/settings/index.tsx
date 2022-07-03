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
  useColorModeValue,
} from "@chakra-ui/react";
import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { safeRedirect, useUser } from "~/utils/utils";
import { ROUTES } from "~/constants";
import { createUser, getUserByEmail } from "~/models/user.server";
import { createUserSession } from "~/session.server";
import { Form, useActionData } from "@remix-run/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import * as React from "react";
import { useState } from "react";
import {
  validateEmail,
  validateFirstName,
  validateLastName,
  validatePassword,
} from "~/utils/validateUser";

export const meta: MetaFunction = () => {
  return {
    title: "Settings",
  };
};

interface ActionData {
  errors: {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const redirectTo = safeRedirect(formData.get("redirectTo"), ROUTES.DASHBOARD);

  validateEmail(email);
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
    password,
    firstName,
    lastName,
    (avatar = null)
  );

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo,
  });
};

export default function SettingsIndexPage() {
  const actionData = useActionData() as ActionData;
  const user = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Account Settings</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Form method="post">
            <Stack spacing={4}>
              <HStack>
                <Box>
                  <FormControl id="firstName" isRequired>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      type="text"
                      name="firstName"
                      autoComplete="firstName"
                      value={user.firstName}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="lastName">
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      type="text"
                      name="lastName"
                      autoComplete="lastName"
                      value={user.lastName}
                    />
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
                  value={user.email}
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
                  Update profile
                </Button>
              </Stack>
            </Stack>
          </Form>
        </Box>
      </Stack>
    </>
  );
}
