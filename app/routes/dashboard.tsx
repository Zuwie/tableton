import { Outlet } from "@remix-run/react";
import UserPanel from "~/components/UserPanel";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return {
    title: "Dashboard",
  };
};

export default function BoardPage() {
  return <UserPanel children={<Outlet />} />;
}
