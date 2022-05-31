import { Popover } from "@headlessui/react";
import NavDesktop from "~/components/NavDesktop";
import NavMobile from "~/components/NavMobile";

export default function Header() {
  return (
    <Popover className="relative bg-white">
      <NavDesktop />
      <NavMobile />
    </Popover>
  );
}
