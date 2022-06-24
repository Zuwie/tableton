import { Text } from "@chakra-ui/react";

export default function StatusDisplayMatchRequests({
  status,
}: {
  status: Number;
}) {
  function renderDisplay() {
    switch (status) {
      case 1:
        return <Text textColor="green.500">Accepted</Text>;
      case 2:
        return <Text textColor="red.500">Declined</Text>;
      default:
        return <Text textColor="orange.500">Unanswered</Text>;
    }
  }

  return <>{renderDisplay()}</>;
}
