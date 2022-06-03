import { Outlet } from "@remix-run/react";
import UserPanel from "~/components/UserPanel";

export default function Players() {
  return <UserPanel children={<Outlet />} />;
}
