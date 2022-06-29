import type { ReactNode } from "react";
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";

export default function LandingFeatures() {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#1A202C"
          fillOpacity="1"
          d="M0,320L60,277.3C120,235,240,149,360,144C480,139,600,213,720,224C840,235,960,181,1080,165.3C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        ></path>
      </svg>
      <Box bg={"gray.800"} position={"relative"}>
        <Container maxW={"6xl"} zIndex={10} position={"relative"} centerContent>
          <Stack direction={{ base: "column", lg: "row" }}>
            <Stack
              flex={1}
              color={"gray.400"}
              justify={{ lg: "center" }}
              py={{ base: 4, md: 20 }}
            >
              <Box mb={{ base: 8, md: 20 }}>
                <Text
                  fontFamily={"heading"}
                  fontWeight={700}
                  textTransform={"uppercase"}
                  mb={3}
                  fontSize={"xl"}
                  color={"gray.500"}
                >
                  Features
                </Text>
                <Heading
                  color={"white"}
                  mb={5}
                  fontSize={{ base: "3xl", md: "5xl" }}
                >
                  21st century player finder
                </Heading>
                <Text fontSize={"xl"} color={"gray.400"}>
                  Donec magna nisl, finibus eu felis sed, semper viverra tortor.
                  Aenean at libero vel nisi pellentesque sollicitudin. Maecenas
                  scelerisque libero eu mauris ultricies faucibus. Suspendisse
                  sed sodales quam.
                </Text>
              </Box>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                {stats.map((stat) => (
                  <Box key={stat.title}>
                    <Text
                      fontFamily={"heading"}
                      fontSize={"3xl"}
                      color={"white"}
                      mb={3}
                    >
                      {stat.title}
                    </Text>
                    <Text fontSize={"xl"} color={"gray.400"}>
                      {stat.content}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Stack>
          </Stack>
        </Container>
      </Box>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#1A202C"
          fillOpacity="1"
          d="M0,192L48,208C96,224,192,256,288,234.7C384,213,480,139,576,106.7C672,75,768,85,864,106.7C960,128,1056,160,1152,181.3C1248,203,1344,213,1392,218.7L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        ></path>
      </svg>
    </>
  );
}

const StatsText = ({ children }: { children: ReactNode }) => (
  <Text as={"span"} fontWeight={700} color={"white"}>
    {children}
  </Text>
);

const stats = [
  {
    title: "6+",
    content: (
      <>
        <StatsText>Game-Systems</StatsText> supported and more to come
      </>
    ),
  },
  {
    title: "24/7",
    content: (
      <>
        <StatsText>Available</StatsText> for you to plan your next match
      </>
    ),
  },
  // {
  //   title: "13%",
  //   content: (
  //     <>
  //       <StatsText>Farms</StatsText> in North America has chosen NewLife™ as
  //       their management solution
  //     </>
  //   ),
  // },
  // {
  //   title: "25+",
  //   content: (
  //     <>
  //       <StatsText>Players</StatsText> currently registered and monitored by the
  //       NewLife™ software
  //     </>
  //   ),
  // },
];
