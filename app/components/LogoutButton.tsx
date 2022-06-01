import { Form } from "@remix-run/react";
import { Button } from "@chakra-ui/react";

export default function LogoutButton() {
  return (
    <Form action="/logout" method="post">
      <Button
        type={"submit"}
        fontWeight={600}
        color={"white"}
        bg={"green.600"}
        _hover={{ bg: "green.700" }}
      >
        Logout
      </Button>
    </Form>
  );
}
