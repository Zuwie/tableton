import { Text } from "@chakra-ui/react";

export default function StatusDisplayBoard({ status }: { status: Number }) {
  return (
    <>
      {status === 0 ? (
        <Text textColor="green.500">Open</Text>
      ) : (
        <Text textColor="orange.500">Filled</Text>
      )}
    </>
  );
}
