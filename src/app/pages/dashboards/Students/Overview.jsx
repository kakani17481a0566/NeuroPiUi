import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import {
  ArrowRightEndOnRectangleIcon,
  CheckBadgeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Button, Fragment } from "react";
import { Card } from "components/ui";

export function Overview({ data }) {
  const studentData = data?.data || {};

  return (
    <Card className="col-span-12 lg:col-span-8">
      <div className="flex flex-col justify-between px-4 pt-4 sm:flex-row sm:items-start sm:px-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-100">
            Attendance Summary
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Insights for the selected day
          </p>
        </div>
        <ActionMenu />
      </div>

      <hr className="mt-4 border-gray-200 dark:border-dark-700" />

      <div className="mt-4 grid grid-cols-2 gap-3 px-4 sm:mt-5 sm:grid-cols-4 sm:px-5 lg:mt-6">
        <StatBox
          label="Total Students"
          value={studentData?.totalStudents ?? 0}
          Icon={UserGroupIcon}
          iconColor="bg-gray-100 text-gray-600"
        />
        <StatBox
          label="Checked IN"
          value={studentData?.checkedInCount ?? 0}
          Icon={CheckBadgeIcon}
          iconColor="bg-green-100 text-green-700"
        />
        <StatBox
          label="Checked OUT"
          value={studentData?.checkedOutCount ?? 0}
          Icon={ArrowRightEndOnRectangleIcon}
          iconColor="bg-blue-100 text-blue-700"
        />
           <StatBox
          label="Not Marked"
          value={studentData?.notMarkedCount ?? 0}
          Icon={ArrowRightEndOnRectangleIcon}
          iconColor="bg-blue-100 text-blue-700"
        />
      </div>
    </Card>
  );
}

function StatBox({ label, value, Icon, iconColor }) {
  return (
    <div className="rounded-lg bg-white dark:bg-surface-3 p-3 shadow-sm ring-1 ring-gray-200 dark:ring-dark-600 2xl:p-4">
      <div className="flex items-center justify-between space-x-2">
        <div>
          <p className="text-xl font-bold text-gray-800 dark:text-dark-100">
            {value}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-300">{label}</p>
        </div>
        <div
          className={`flex items-center justify-center h-10 w-10 rounded-full ${iconColor}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function ActionMenu() {
  return (
    <Menu as="div" className="relative inline-block text-left ltr:-mr-1.5 rtl:-ml-1.5">
      <MenuButton
        as={Button}
        variant="flat"
        isIcon
        className="size-8 rounded-full"
      >
        <EllipsisHorizontalIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
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
        <MenuItems className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 sm:ltr:left-0 rtl:left-0 sm:rtl:right-0">
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 text-sm tracking-wide transition-colors",
                  focus &&
                    "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                )}
              >
                Action
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 text-sm tracking-wide transition-colors",
                  focus &&
                    "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                )}
              >
                Another action
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 text-sm tracking-wide transition-colors",
                  focus &&
                    "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                )}
              >
                Other action
              </button>
            )}
          </MenuItem>

          <hr className="mx-3 my-1.5 h-px border-gray-150 dark:border-dark-500" />

          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 text-sm tracking-wide transition-colors",
                  focus &&
                    "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                )}
              >
                Separated action
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
