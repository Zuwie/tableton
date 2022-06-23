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
} from "@chakra-ui/react";
import { FACTIONS, ROUTES } from "~/constants";
import { FaDiscord, FaEnvelope, FaPhone } from "react-icons/fa";
import { FiTwitter } from "react-icons/fi";
import RemixLink from "~/components/RemixLink";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import StatusDisplay from "~/components/StatusDisplay";
import * as React from "react";
import type {
  getContactInformationForUser,
  getExtendedProfileForUser,
} from "~/models/user.server";
import type { getBoardEntryListItemsFromUser } from "~/models/board.server";

type LoaderData = {
  boardEntries: Awaited<ReturnType<typeof getBoardEntryListItemsFromUser>>;
  extendedProfile: Awaited<ReturnType<typeof getExtendedProfileForUser>>;
  contact: Awaited<ReturnType<typeof getContactInformationForUser>>;
};

export default function ProfileGrid(props: {
  bg: string;
  loader: LoaderData;
  onClick: () => void;
}) {
  return (
    // TODO: add name of user
    <Grid
      templateRows="repeat(2, 1fr)"
      templateColumns="repeat(6, 1fr)"
      gap={4}
    >
      <GridItem
        rowSpan={3}
        colSpan={{ base: 6, xl: 4 }}
        bg={props.bg}
        rounded={"lg"}
        boxShadow={"lg"}
        p={8}
      >
        <Heading fontSize={"3xl"} mb={4}>
          Bio
        </Heading>
        <Text>
          {props.loader.extendedProfile?.biography ||
            "No biography has been filled out."}
        </Text>
      </GridItem>

      <GridItem
        colSpan={{ base: 6, sm: 3, xl: 2 }}
        bg={props.bg}
        rounded={"lg"}
        boxShadow={"lg"}
        p={8}
      >
        <Heading fontSize={"3xl"} mb={4}>
          Factions
        </Heading>
        <Stack spacing={4}>
          {/* TODO: render all factions when multiple factions are implemented */}
          {props.loader.extendedProfile?.faction ? (
            <Tag>
              {
                FACTIONS[
                  props.loader.extendedProfile?.faction as keyof typeof FACTIONS
                ]
              }
            </Tag>
          ) : (
            <Text>No faction has been selected.</Text>
          )}
        </Stack>
      </GridItem>
      <GridItem
        colSpan={{ base: 6, sm: 3, xl: 2 }}
        bg={props.bg}
        rounded={"lg"}
        boxShadow={"lg"}
        p={8}
      >
        <Heading fontSize={"3xl"} mb={4}>
          Contact
        </Heading>
        <ButtonGroup>
          {!props.loader.contact && <Text>No contact has been given.</Text>}

          {props.loader.contact?.discord && (
            <IconButton
              as="span"
              aria-label="Link to user's discord"
              icon={<FaDiscord />}
              onClick={props.onClick}
            />
          )}

          {props.loader.contact?.phone && (
            <Link href={`tel:${props.loader.contact.phone}`} target="_blank">
              <IconButton
                as="span"
                aria-label="Link to user's phone number"
                icon={<FaPhone />}
              />
            </Link>
          )}

          {props.loader.contact?.twitter && (
            <Link href={`tel:${props.loader.contact.twitter}`} target="_blank">
              <IconButton
                as="span"
                aria-label="Link to user's twitter account"
                icon={<FiTwitter />}
              />
            </Link>
          )}

          {props.loader.contact?.email && (
            <Link href={`mailto:${props.loader.contact.email}`} target="_blank">
              <IconButton
                as="span"
                aria-label="Link to user's email"
                icon={<FaEnvelope />}
              />
            </Link>
          )}
        </ButtonGroup>
      </GridItem>

      <GridItem colSpan={6} bg={props.bg} rounded={"lg"} boxShadow={"lg"} p={8}>
        <Heading fontSize={"3xl"} mb={4}>
          Active board-entries
        </Heading>
        <TableContainer bg={props.bg} rounded="lg">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Date</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {props.loader.boardEntries?.map((boardEntry) => (
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
  );
}
