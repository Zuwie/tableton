import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react";
import { Form } from "@remix-run/react";
import * as React from "react";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { FACTIONS, ROUTES } from "~/constants";
import { useOptionalUser, validateEmail } from "~/utils";
import { requireUserId } from "~/session.server";
import {
  createContactInformation,
  createExtendedProfile,
  getContactInformationForUser,
  getExtendedProfileForUser,
} from "~/models/user.server";
import InternalLink from "~/components/InternalLink";
import { PhoneIcon } from "@chakra-ui/icons";
import { FaDiscord, FaEnvelope, FaTwitter } from "react-icons/fa";

export const meta: MetaFunction = () => {
  return {
    title: "Onboarding",
  };
};

type ActionData = {
  errors?: {
    discord?: string;
    email?: string;
  };
};

/**
 * It takes a request, validates the request, and then creates a new extended profile
 * @param  - `request` - the request object
 * @returns A redirect to the dashboard
 */
export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const faction = formData.get("faction");
  const biography = formData.get("biography");

  const phone = formData.get("phone");
  const discord = formData.get("discord");
  const email = formData.get("email");
  const twitter = formData.get("twitter");

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 }
    );
  }

  if (
    typeof faction !== "string" ||
    typeof biography !== "string" ||
    typeof phone !== "string" ||
    typeof discord !== "string" ||
    typeof twitter !== "string"
  ) {
    return;
  }

  await createExtendedProfile({
    faction,
    biography,
    userId,
  });
  await createContactInformation({
    phone,
    discord,
    email,
    twitter,
    userId,
  });

  return redirect(ROUTES.PROFILE);
};

/**
 * If the user has an extended profile or contact information, redirect them to the dashboard. Otherwise, return null
 * @param  - LoaderFunction
 * @returns A redirect to the dashboard if the user has an extended profile or contact information.
 */
export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const extendedProfile = await getExtendedProfileForUser({ userId });
  const contactInformation = await getContactInformationForUser({ userId });
  if (extendedProfile || contactInformation) return redirect(ROUTES.DASHBOARD);
  return null;
};

/**
 * We're using the `useOptionalUser` hook to get the current user, then we're using the `Form` component to create a form
 * that allows the user to submit their profile information
 */
export default function OnboardingPage() {
  const user = useOptionalUser();

  return (
    <Stack spacing={8} mx={"auto"} maxW={"lg"} w="100%" py={12}>
      <Stack align={"center"}>
        <Heading fontSize={"4xl"} textAlign={"center"}>
          Setup your profile now
        </Heading>
        <Text fontSize={"lg"} color={"gray.600"} textAlign={"center"}>
          or do it later in your{" "}
          <InternalLink
            to={ROUTES.PROFILE}
            _hover={{ textDecoration: "underline" }}
          >
            profile
          </InternalLink>
        </Text>
      </Stack>

      <Box
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        p={8}
      >
        <Form method="post">
          <Stack spacing={4}>
            <FormControl id="factions">
              <FormLabel>List your favorite faction here</FormLabel>
              <Select name="faction">
                {Object.entries(FACTIONS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl id="biography">
              <FormLabel>Bio</FormLabel>
              <Textarea name="biography" />
            </FormControl>

            <Heading fontSize="md" pt={4}>
              How do you want to get contacted?
            </Heading>
            <Tabs variant="enclosed" isFitted>
              <TabList>
                <Tab>
                  <PhoneIcon /> <VisuallyHidden>Phone</VisuallyHidden>
                </Tab>
                <Tab>
                  <FaDiscord /> <VisuallyHidden>Discord</VisuallyHidden>
                </Tab>
                <Tab>
                  <FaEnvelope /> <VisuallyHidden>E-Mail</VisuallyHidden>
                </Tab>
                <Tab>
                  <Text>
                    <FaTwitter /> <VisuallyHidden>Twitter</VisuallyHidden>
                  </Text>
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Stack spacing={4}>
                    <FormControl id="contactPhone">
                      <FormLabel>Phone</FormLabel>
                      <Input type="text" name="phone" />
                      <FormHelperText>e.g. +436761234567</FormHelperText>
                    </FormControl>
                  </Stack>
                </TabPanel>
                <TabPanel>
                  <FormControl id="contactDiscord">
                    <FormLabel>Discord</FormLabel>
                    <Input type="text" name="discord" />
                    <FormHelperText>e.g. Aquila#3729</FormHelperText>
                  </FormControl>
                </TabPanel>
                <TabPanel>
                  <FormControl id="contactEmail">
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      name="email"
                      defaultValue={user?.email}
                    />
                    <FormHelperText>e.g. example@gmail.com</FormHelperText>
                  </FormControl>
                </TabPanel>
                <TabPanel>
                  <FormControl id="contactTwitter">
                    <FormLabel>Twitter</FormLabel>
                    <Input type="text" name="twitter" />
                    <FormHelperText>
                      e.g. https://twitter.com/RS_Webdev
                    </FormHelperText>
                  </FormControl>
                </TabPanel>
              </TabPanels>
            </Tabs>

            <Stack spacing={10} pt={2}>
              <Button
                type="submit"
                loadingText="Submitting"
                size="lg"
                colorScheme="teal"
              >
                Submit
              </Button>
            </Stack>
          </Stack>
        </Form>
      </Box>
    </Stack>
  );
}
