import {
  ButtonGroup,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Link,
  Stack,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import * as React from "react";
import { getBoardEntryListItemsFromUser } from "~/models/board.server";
import { requireUserId } from "~/session.server";
import { useLoaderData } from "@remix-run/react";
import { ROUTES } from "~/constants";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import StatusDisplay from "~/components/StatusDisplay";
import { getExtendedProfileForUser } from "~/models/user.server";
import RemixLink from "~/components/RemixLink";

export const meta: MetaFunction = () => {
  return {
    title: "Profile",
  };
};

type LoaderData = {
  boardEntries: Awaited<ReturnType<typeof getBoardEntryListItemsFromUser>>;
};

/**
 * It gets the userId from the request, then gets the board entries from the user, then returns the board entries as JSON
 * @param  - LoaderFunction
 * @returns A function that returns a promise that resolves to a json object.
 */
export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const extendedProfile = await getExtendedProfileForUser({ userId });

  /* If the user has not completed the onboarding process, then redirect them to the onboarding page. */
  if (!extendedProfile) throw redirect(ROUTES.ONBOARDING);

  const boardEntries = await getBoardEntryListItemsFromUser({
    userId,
  });

  return json<LoaderData>({ boardEntries });
};

/**
 * It renders a page with a heading, a paragraph, a list of tags, a list of social media links, and a table of board
 * entries
 */
export default function ProfileIndexPage() {
  const background = useColorModeValue("white", "gray.700");
  const loader = useLoaderData() as LoaderData;

  return (
    <Stack spacing={8} mx={"auto"} maxW={"5xl"} py={12}>
      <Stack align={"center"}>
        <Heading as="h1" fontSize={"4xl"}>
          Profile
        </Heading>
        <Text fontSize={"lg"} color={"gray.600"}>
          give other players a heads-up about you 🥸
        </Text>
      </Stack>

      <Grid
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(6, 1fr)"
        gap={4}
      >
        <GridItem
          rowSpan={3}
          colSpan={{ base: 6, xl: 4 }}
          bg={background}
          rounded={"lg"}
          boxShadow={"lg"}
          p={8}
        >
          <Heading fontSize={"3xl"} mb={4}>
            Bio
          </Heading>
          <Text>
            Mauris gravida pulvinar enim quis semper. Praesent pulvinar
            fringilla diam. Proin ornare venenatis condimentum. Aenean egestas
            varius dui, a dictum lacus varius finibus. Morbi vitae euismod
            augue. Praesent ultrices ligula id massa interdum mattis. Etiam a
            leo et elit pretium malesuada. Duis elementum commodo dapibus.
          </Text>
        </GridItem>

        <GridItem
          colSpan={{ base: 6, sm: 3, xl: 2 }}
          bg={background}
          rounded={"lg"}
          boxShadow={"lg"}
          p={8}
        >
          <Heading fontSize={"3xl"} mb={4}>
            Factions
          </Heading>
          <Stack spacing={4}>
            <Tag>Drukhari</Tag>
            <Tag>Harlequins</Tag>
            <Tag>Custodes</Tag>
            <Tag>Chaos Demons</Tag>
          </Stack>
        </GridItem>
        <GridItem
          colSpan={{ base: 6, sm: 3, xl: 2 }}
          bg={background}
          rounded={"lg"}
          boxShadow={"lg"}
          p={8}
        >
          <Heading fontSize={"3xl"} mb={4}>
            Contact
          </Heading>
          <ButtonGroup>
            <Link href={"https://discord.com"} target="_blank">
              <IconButton
                as="span"
                aria-label="Discord link"
                icon={<FaDiscord />}
              />
            </Link>
            <Link href={"https://twitter.com"} target="_blank">
              <IconButton
                as="span"
                aria-label="Twitter link"
                icon={<FaTwitter />}
              />
            </Link>
            <Link href={"https://whatsapp.com"} target="_blank">
              <IconButton
                as="span"
                aria-label="WhatsApp link"
                icon={<IoLogoWhatsapp />}
              />
            </Link>
          </ButtonGroup>
        </GridItem>

        <GridItem
          colSpan={6}
          bg={background}
          rounded={"lg"}
          boxShadow={"lg"}
          p={8}
        >
          <Heading fontSize={"3xl"} mb={4}>
            Active board-entries
          </Heading>
          <TableContainer bg={background} rounded="lg">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Date</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {loader.boardEntries?.map((boardEntry) => (
                  <Tr key={boardEntry.id}>
                    <Td>
                      <RemixLink to={`${ROUTES.DASHBOARD}/${boardEntry.id}`}>
                        {boardEntry.title} <ArrowForwardIcon />
                      </RemixLink>
                    </Td>
                    <Td>{new Date(boardEntry.date).toLocaleDateString()}</Td>
                    <Td>
                      <StatusDisplay status={boardEntry.status} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </GridItem>
      </Grid>
    </Stack>
  );
}
