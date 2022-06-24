import {
  getMatchRequestById,
  getMatchRequestForUser,
  updateMatchRequestStatus,
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
import { Form, useLoaderData } from "@remix-run/react";
import { ROUTES } from "~/constants";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import RemixLink from "~/components/RemixLink";
import { updateBoardEntry } from "~/models/board.server";
import StatusDisplayMatchRequests from "~/components/StatusDisplayMatchRequests";

export const meta: MetaFunction = () => {
  return {
    title: "Match Requests",
  };
};

type LoaderData = {
  matchRequests: Awaited<ReturnType<typeof getMatchRequestForUser>>;
};

/**
 * It gets the userId from the request, then gets the match requests for that user, and returns the match requests as JSON
 * @param  - LoaderFunction - This is the type of the loader function. It's a function that takes a single parameter, which
 * is an object with a single property, `request`.
 * @returns A loader function that returns a promise that resolves to a loader data object.
 */
export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const matchRequests = await getMatchRequestForUser({ userId });

  return json<LoaderData>({ matchRequests });
};

/**
 * It takes a form submission, and depending on the action, either marks the match request as accepted or declined
 * @param  - `action` - The name of the action function.
 * @returns The return value is a function that takes an object with a request property.
 */
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get("_action");
  const matchRequestId = formData.get("matchRequestId");

  if (typeof matchRequestId !== "string")
    throw new Error("matchRequestId is required");

  const matchRequest = await getMatchRequestById({ id: matchRequestId });
  if (!matchRequestId)
    throw new Error("matchRequestId does not match any existing entries");

  if (action === "delete") {
    await updateMatchRequestStatus({ id: matchRequestId, status: 2 });
    return redirect(ROUTES.MATCH_REQUESTS);
  }

  if (action === "accept") {
    await updateBoardEntry({
      id: matchRequest?.boardEntryId,
      challengerId: matchRequest?.fromUserId,
      status: 1,
    });
    await updateMatchRequestStatus({ id: matchRequestId, status: 1 });
    return redirect(ROUTES.MATCH_REQUESTS);
  }

  return null;
};

/* It's a React component that displays the match requests for the user. */
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
                  <RemixLink
                    to={`${ROUTES.PLAYERS}/${matchRequest.fromUser.id}`}
                  >
                    <HStack>
                      <Avatar
                        size="sm"
                        src={matchRequest.fromUser.avatar || undefined}
                        name={`${matchRequest.fromUser.firstName} ${matchRequest.fromUser.lastName}`}
                      />{" "}
                      <Text>{matchRequest.fromUser.firstName}</Text>
                    </HStack>
                  </RemixLink>
                </Td>
                <Td>
                  <RemixLink
                    to={`${ROUTES.DASHBOARD}/${matchRequest.boardEntry.id}`}
                  >
                    {matchRequest.boardEntry.title}
                  </RemixLink>
                </Td>
                <Td>{new Date(matchRequest.createdAt).toLocaleDateString()}</Td>
                <Td>
                  {matchRequest.status === 0 ? (
                    <HStack>
                      <Form method="post">
                        <input
                          type="hidden"
                          name="matchRequestId"
                          value={matchRequest.id}
                        />
                        <IconButton
                          type="submit"
                          name="_action"
                          value="accept"
                          colorScheme="green"
                          aria-label="Accept match request"
                          icon={<CheckIcon />}
                        />
                      </Form>
                      <Form method="post">
                        <input
                          type="hidden"
                          name="matchRequestId"
                          value={matchRequest.id}
                        />
                        <IconButton
                          type="submit"
                          name="_action"
                          value="delete"
                          colorScheme="red"
                          aria-label="Decline match request"
                          icon={<CloseIcon />}
                        />
                      </Form>
                    </HStack>
                  ) : (
                    <StatusDisplayMatchRequests status={matchRequest.status} />
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
