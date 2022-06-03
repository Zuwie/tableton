import { Outlet } from "@remix-run/react";
import UserPanel from "~/components/UserPanel";

export default function Profile() {
  return <UserPanel children={<Outlet />} />;
}
