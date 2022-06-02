import { Form } from "@remix-run/react";

export default function LogoutButton() {
  return (
    <Form action="/logout" method="post">
      <button type="submit">Sign out</button>
    </Form>
  );
}
