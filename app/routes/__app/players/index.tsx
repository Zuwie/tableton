import {
  Avatar,
  Heading,
  HStack,
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
import { getUsers } from "~/models/user.server";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { GAME_SYSTEM } from "~/constants";
import RemixLink from "~/components/RemixLink";

export const meta: MetaFunction = () => {
  return {
    title: "Players",
  };
};

type LoaderData = {
  users: Awaited<ReturnType<typeof getUsers>>;
};

/**
 * It returns a JSON response with a list of users
 * @param  - LoaderFunction
 * @returns A function that returns a promise that resolves to a json object.
 */
export const loader: LoaderFunction = async ({ request }) => {
  const users = await getUsers();
  return json<LoaderData>({ users });
};

/* A React component that is exported as the default export. */
export default function PlayersIndexPage() {
  const loader = useLoaderData() as LoaderData;
  const backGround = useColorModeValue("white", "gray.800");

  return (
    <>
      <Heading as="h1" mt="10" mb="20">
        Players
      </Heading>

      <TableContainer bg={backGround} rounded="lg">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Firstname</Th>
              <Th>Preferred Game-System</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loader.users.length === 0 ? (
              <Text>No players to display</Text>
            ) : (
              <>
                {loader.users.map((user) => (
                  <Tr key={user.id}>
                    <Td>
                      <RemixLink to={user.id}>
                        <HStack>
                          <Avatar
                            size="sm"
                            src={user.avatar || undefined}
                            name={`${user.firstName} ${user.lastName}`}
                          />{" "}
                          <Text>{user.firstName}</Text>
                        </HStack>
                      </RemixLink>
                    </Td>
                    {/* TODO: make dynamic and support multiple game-systems */}
                    <Td>{GAME_SYSTEM.WARHAMMER_40K}</Td>
                  </Tr>
                ))}
              </>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
