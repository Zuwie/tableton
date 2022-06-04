import { Outlet } from "@remix-run/react";
import UserPanel from "~/components/UserPanel";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return {
    title: "Settings",
  };
};

export default function Settings() {
  return <UserPanel children={<Outlet />} />;
}
