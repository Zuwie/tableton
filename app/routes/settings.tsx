import { Outlet } from "@remix-run/react";
import UserPanel from "~/components/UserPanel";

export default function Settings() {
  return <UserPanel children={<Outlet />} />;
}
