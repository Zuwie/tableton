import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XIcon } from "@heroicons/react/outline";
import { Link } from "@remix-run/react";
import { ROUTES } from "~/constants";

export default function NavMobile() {
  return (
    <Transition
      as={Fragment}
      enter="duration-200 ease-out"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="duration-100 ease-in"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <Popover.Panel
        focus
        className="absolute inset-x-0 top-0 origin-top-right transform p-2 transition md:hidden"
      >
        <header className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="px-5 pt-5 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                  alt="Workflow"
                />
              </div>
              <div className="-mr-2">
                <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Close menu</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </Popover.Button>
              </div>
            </div>
          </div>

          <div className="space-y-6 py-6 px-5">
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              <Link
                to={ROUTES.DASHBOARD}
                className="text-base font-medium text-gray-500 hover:text-gray-900"
              >
                Dashboard
              </Link>

              <a
                href="#"
                className="text-base font-medium text-gray-900 hover:text-gray-700"
              >
                Docs
              </a>
            </div>

            <div>
              <Link
                to={ROUTES.JOIN}
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Sign up
              </Link>
              <p className="mt-6 text-center text-base font-medium text-gray-500">
                Existing customer?{" "}
                <Link
                  to={ROUTES.LOGIN}
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </header>
      </Popover.Panel>
    </Transition>
  );
}
