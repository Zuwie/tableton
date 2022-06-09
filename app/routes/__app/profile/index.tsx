import { Heading } from "@chakra-ui/react";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return {
    title: "Profile",
  };
};

export default function ProfileIndexPage() {
  return <Heading>Profile</Heading>;
}
