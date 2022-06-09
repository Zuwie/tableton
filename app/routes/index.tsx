import Header from "~/components/Header";
import { Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import LandingFeatures from "~/components/LandingFeatures";
import Footer from "~/components/Footer";
import { getUserId } from "~/session.server";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { ROUTES } from "~/constants";
import RemixLink from "~/components/RemixLink";

/**
 * If the user is logged in, redirect to the dashboard. Otherwise, do nothing
 * @param  - LoaderFunction
 * @returns The loader function is returning a promise that resolves to null.
 */
export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) throw redirect(ROUTES.DASHBOARD);
  return null;
};

export default function RootIndexPage() {
  return (
    <>
      <Header />
      <Container maxW={"3xl"} minH={"100vh"}>
        <Stack
          as={Box}
          textAlign={"center"}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
          >
            Connect with <br />
            <Text as={"span"} color={"teal.400"}>
              local players
            </Text>
          </Heading>
          <Text color={"gray.500"}>
            You want to satisfy your urge of playing your favorite tabletop
            game? Find players, battle with or against each other and stay in
            contact!
          </Text>
          <Stack
            direction={"column"}
            spacing={4}
            align={"center"}
            alignSelf={"center"}
            position={"relative"}
          >
            <RemixLink to={ROUTES.JOIN}>
              <Button
                as="span"
                colorScheme={"teal"}
                rounded={"full"}
                size={"lg"}
                py={6}
                px={8}
              >
                Get Started
              </Button>
            </RemixLink>
            <Button variant={"link"} colorScheme={"blue"} size={"sm"}>
              Learn more
            </Button>
          </Stack>
        </Stack>
      </Container>
      <LandingFeatures />
      <Footer />
    </>
  );
}
