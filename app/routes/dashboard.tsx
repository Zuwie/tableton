import { Outlet } from "@remix-run/react";
import UserPanel from "~/components/UserPanel";

export default function BoardPage() {
  return <UserPanel children={<Outlet />} />;
}
