import { Outlet } from "@remix-run/react";
import UserPanel from "~/components/UserPanel";
import type { MetaFunction } from "@remix-run/node";

export default function Profile() {
  return <UserPanel children={<Outlet />} />;
}

export const meta: MetaFunction = () => {
  return {
    title: "Profile",
  };
};
