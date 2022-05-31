import { Popover } from "@headlessui/react";
import {
  BookmarkAltIcon,
  CalendarIcon,
  ShieldCheckIcon,
  SupportIcon,
} from "@heroicons/react/outline";
import NavDesktop from "~/components/NavDesktop";
import NavMobile from "~/components/NavMobile";

const resources = [
  {
    name: "Help Center",
    description:
      "Get all of your questions answered in our forums or contact support.",
    href: "#",
    icon: SupportIcon,
  },
  {
    name: "Guides",
    description:
      "Learn how to maximize our platform to get the most out of it.",
    href: "#",
    icon: BookmarkAltIcon,
  },
  {
    name: "Events",
    description:
      "See what meet-ups and other events we might be planning near you.",
    href: "#",
    icon: CalendarIcon,
  },
  {
    name: "Security",
    description: "Understand how we take your privacy seriously.",
    href: "#",
    icon: ShieldCheckIcon,
  },
];

export default function Header() {
  return (
    <Popover className="relative bg-white">
      <NavDesktop />
      <NavMobile />
    </Popover>
  );
}
