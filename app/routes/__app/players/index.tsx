import {
  Avatar,
  Heading,
  HStack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
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

export const meta: MetaFunction = () => {
  return {
    title: "Players",
  };
};

type LoaderData = {
  users: Awaited<ReturnType<typeof getUsers>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const users = await getUsers();
  return json<LoaderData>({ users });
};

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
                      <HStack>
                        <Avatar
                          name={`${user.firstName} ${user.lastName}`}
                          size="sm"
                          src={user.avatar || undefined}
                        />{" "}
                        <Text>{user.firstName}</Text>
                      </HStack>
                    </Td>
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
