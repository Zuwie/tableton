import {
  acceptMatchRequest,
  deleteMatchRequest,
  getMatchRequestForUser,
} from "~/models/matches.server";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import {
  Avatar,
  Heading,
  HStack,
  IconButton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import { Form, NavLink, useLoaderData } from "@remix-run/react";
import { ROUTES } from "~/constants";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

export const meta: MetaFunction = () => {
  return {
    title: "Match Requests",
  };
};

type LoaderData = {
  matchRequests: Awaited<ReturnType<typeof getMatchRequestForUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const matchRequests = await getMatchRequestForUser({ userId });

  return json<LoaderData>({ matchRequests });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get("_action");
  const boardEntryId = formData.get("boardEntryId");

  if (typeof boardEntryId !== "string")
    throw new Error("boardEntryId is required");

  if (action === "delete") {
    await deleteMatchRequest({ id: boardEntryId });
    return redirect(ROUTES.MATCH_REQUESTS);
  }

  if (action === "accept") {
    await acceptMatchRequest({ id: boardEntryId });
    return redirect(ROUTES.MATCH_REQUESTS);
  }

  return null;
};

export default function MatchRequestsPage() {
  const loader = useLoaderData() as LoaderData;
  const background = useColorModeValue("white", "gray.800");

  return (
    <>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Heading as={"h1"} fontSize={"4xl"} textAlign={"center"}>
          Match Requests
        </Heading>
      </Stack>

      <TableContainer bg={background} rounded="lg">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>From</Th>
              <Th>BoardEntry</Th>
              <Th>Requested at</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loader.matchRequests.map((matchRequest) => (
              <Tr key={matchRequest.id}>
                <Td>
                  <NavLink to={`${ROUTES.PLAYERS}/${matchRequest.fromUser.id}`}>
                    <HStack>
                      <Avatar
                        size="sm"
                        src={matchRequest.fromUser.avatar || undefined}
                        name={`${matchRequest.fromUser.firstName} ${matchRequest.fromUser.lastName}`}
                      />{" "}
                      <Text>{matchRequest.fromUser.firstName}</Text>
                    </HStack>
                  </NavLink>
                </Td>
                <Td>
                  <NavLink
                    to={`${ROUTES.DASHBOARD}/${matchRequest.boardEntry.id}`}
                  >
                    {matchRequest.boardEntry.title}
                  </NavLink>
                </Td>
                <Td>{new Date(matchRequest.createdAt).toLocaleDateString()}</Td>
                <Td>
                  <HStack>
                    <Form method="post">
                      <input
                        type="hidden"
                        name="boardEntryId"
                        value={matchRequest.id}
                      />
                      <IconButton
                        type="submit"
                        name="_action"
                        value="accept"
                        colorScheme="green"
                        aria-label="Accept match request"
                        isDisabled={matchRequest.status === 2}
                        icon={<CheckIcon />}
                      />
                    </Form>
                    <Form method="post">
                      <input
                        type="hidden"
                        name="boardEntryId"
                        value={matchRequest.id}
                      />
                      <IconButton
                        type="submit"
                        name="_action"
                        value="delete"
                        colorScheme="red"
                        aria-label="Decline match request"
                        isDisabled={matchRequest.status === 1}
                        icon={<CloseIcon />}
                      />
                    </Form>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
