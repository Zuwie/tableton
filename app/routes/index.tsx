import Header from "~/components/Header";
import { Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";

export default function LoginIndexPage() {
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
            <Text as={"span"} color={"green.400"}>
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
            spacing={3}
            align={"center"}
            alignSelf={"center"}
            position={"relative"}
          >
            <Button
              colorScheme={"green"}
              bg={"green.400"}
              rounded={"full"}
              size={"lg"}
              py={6}
              px={8}
              _hover={{
                bg: "green.500",
              }}
            >
              Get Started
            </Button>
            <Button variant={"link"} colorScheme={"blue"} size={"sm"}>
              Learn more
            </Button>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
