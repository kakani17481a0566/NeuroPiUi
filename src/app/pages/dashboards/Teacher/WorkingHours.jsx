// Import Dependencies
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { ClockIcon } from "@heroicons/react/24/outline"; // Outline icon
import clsx from "clsx";
import { Fragment } from "react";

// Local Imports
import { Button, Card, Circlebar } from "components/ui";

// ----------------------------------------------------------------------

export function WorkingHours() {
  return (
    <Card className="pb-5">
      <div className="relative flex items-center justify-between px-4 py-3 pt-3">
        {/* Left: Icon */}
        <ClockIcon className="text-primary-600 dark:text-primary-400 h-5 w-5" />

        {/* Center: Absolute centered text */}
        <span className="text-sm-plus text-primary-600 dark:text-primary-400 absolute left-1/2 -translate-x-1/2 font-medium tracking-wide">
          Working Hours
        </span>

        {/* Right: Menu */}
        <ActionMenu />
      </div>

      <div className="flex justify-center py-2">
        <Circlebar variant="soft" isActive color="info" size={38} value={70}>
          <span className="text-2xl font-medium">70%</span>
        </Circlebar>
      </div>

      <div className="text-xs-plus dark:text-dark-300 mt-4 px-4 text-center text-gray-600 sm:px-5">
        Working hours calculated based on your activity
      </div>
    </Card>
  );
}

function ActionMenu() {
  return (
    <Menu
      as="div"
      className="relative inline-block text-left ltr:-mr-1.5 rtl:-ml-1.5"
    >
      <MenuButton
        as={Button}
        variant="flat"
        isIcon
        className="size-8 rounded-full"
      >
        <EllipsisHorizontalIcon className="size-5" />
      </MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
      >
        <MenuItems className="dark:border-dark-500 dark:bg-dark-700 absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden ltr:right-0 rtl:left-0 dark:shadow-none">
          {["Action", "Another action", "Other action"].map((label) => (
            <MenuItem key={label}>
              {({ focus }) => (
                <button
                  className={clsx(
                    "flex h-9 w-full items-center px-3 tracking-wide transition-colors outline-none",
                    focus &&
                      "dark:bg-dark-600 dark:text-dark-100 bg-gray-100 text-gray-800",
                  )}
                >
                  <span>{label}</span>
                </button>
              )}
            </MenuItem>
          ))}
          <hr className="border-gray-150 dark:border-dark-500 mx-3 my-1.5 h-px" />
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 tracking-wide transition-colors outline-none",
                  focus &&
                    "dark:bg-dark-600 dark:text-dark-100 bg-gray-100 text-gray-800",
                )}
              >
                <span>Separated action</span>
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
