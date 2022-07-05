import Header from "~/components/Header";
import { Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import LandingFeatures from "~/components/LandingFeatures";
import Footer from "~/components/Footer";
import { getUserId } from "~/session.server";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { ROUTES } from "~/constants";
import InternalLink from "~/components/InternalLink";

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
            fontWeight={"extrabold"}
            fontSize={{ base: "4xl", sm: "6xl", md: 100 }}
            lineHeight={"110%"}
            bgGradient="linear(to-l, #7928CA, teal.500)"
            bgClip="text"
            className={"animate-bg-text"}
          >
            Connect with <br />
            local players
          </Heading>
          <Text color={"gray"} fontSize={{ base: "lg", md: "xl" }}>
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
            <InternalLink to={ROUTES.JOIN}>
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
            </InternalLink>
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
