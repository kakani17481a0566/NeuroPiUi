// ───────────────────────────────────────────────
// ✅ Component Imports
// ───────────────────────────────────────────────

import { Fragment, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

import { Page } from "components/shared/Page";
import { WorkingHours } from "./WorkingHours";
import { Students } from "./Students";
import { Calendar } from "./Calendar";
import { WeeklyTimeTable } from "./WeeklyTimeTable";
import { Classes } from "./Classes";

// ───────────────────────────────────────────────
// ✅ Main Component: Teacher Dashboard
// ───────────────────────────────────────────────

export default function Teacher() {
  const [selectedView, setSelectedView] = useState("Week");

  return (
    <Page title="Teacher Dashboard">
      {/* Dropdown: Week / Term Switch */}
      {/* Dropdown: Week / Term Switch */}
<div className="flex items-center gap-4 px-4 pt-4 sm:px-5 lg:px-6">
  <h1 className="text-lg font-semibold text-gray-800 dark:text-dark-100">
    Timetable View
  </h1>

  <Menu as="div" className="relative inline-block text-left">
    <MenuButton className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
      {selectedView}
      <ChevronDownIcon className="h-4 w-4" />
    </MenuButton>

    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <MenuItems className="absolute left-0 z-10 mt-2 w-32 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-dark-700">
        {["Week", "Term"].map((view) => (
          <MenuItem key={view} as={Fragment}>
            {({ active, close }) => (
              <button
                onClick={() => {
                  setSelectedView(view);
                  close();
                }}
                className={clsx(
                  active ? "bg-gray-100 dark:bg-dark-600" : "",
                  "w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-white"
                )}
              >
                {view}
              </button>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Transition>
  </Menu>
</div>


      {/* Grid Layout */}
      <div className="grid grid-cols-12 gap-4 px-4 pb-8 pt-4 sm:gap-5 lg:gap-6 sm:px-5 lg:px-6">
        {/* Main Section */}
        <div className="col-span-12 xl:col-span-10 lg:col-span-9">
          <Classes />
          <div className="mt-4">
            <WeeklyTimeTable view={selectedView} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-3 xl:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-1 lg:gap-6 lg:sticky lg:top-20 lg:self-start">
          <WorkingHours />
          <Students />
          <Calendar />
        </div>
      </div>
    </Page>
  );
}
