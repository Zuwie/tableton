import { Link } from "@remix-run/react";
import { ROUTES } from "~/constants";
import { Popover } from "@headlessui/react";
import { MenuIcon } from "@heroicons/react/outline";
import { useOptionalUser } from "~/utils";
import LogoutButton from "~/components/LogoutButton";

export default function NavDesktop() {
  const user = useOptionalUser();

  return (
    <header className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="flex items-center justify-between border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
        <div className="flex justify-start lg:w-0 lg:flex-1">
          <Link to={ROUTES.ROOT}>
            <span className="sr-only">Home</span>
            <img
              className="h-8 w-auto sm:h-10"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              alt=""
            />
          </Link>
        </div>

        <div className="-my-2 -mr-2 md:hidden">
          <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
            <span className="sr-only">Open menu</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </Popover.Button>
        </div>

        <nav className="hidden space-x-10 md:flex">
          <Link
            to={ROUTES.DASHBOARD}
            className="text-base font-medium text-gray-500 hover:text-gray-900"
          >
            Dashboard
          </Link>
          <a
            href="#"
            className="text-base font-medium text-gray-500 hover:text-gray-900"
          >
            Docs
          </a>
        </nav>

        <div className="hidden items-center justify-end gap-8 md:flex md:flex-1 lg:w-0">
          {!user ? (
            <>
              <Link
                to={ROUTES.LOGIN}
                className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
              >
                Sign in
              </Link>
              <Link
                to={ROUTES.JOIN}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Sign up
              </Link>
            </>
          ) : (
            <LogoutButton />
          )}
        </div>
      </div>
    </header>
  );
}
