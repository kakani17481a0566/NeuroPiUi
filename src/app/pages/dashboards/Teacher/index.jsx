import { Fragment, useEffect, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

import { Page } from "components/shared/Page";
import { WorkingHours } from "./WorkingHours";
import { Students } from "./Students";
import { Calendar } from "./Calendar";
import { WeeklyTimeTable } from "./WeeklyTimeTable";
import { Classes } from "./Classes";

export default function Teacher() {
  const [selectedView, setSelectedView] = useState("Week");

  useEffect(() => {
    const savedView = localStorage.getItem("timetable-view");
    if (savedView) setSelectedView(savedView);
  }, []);

  const handleViewChange = (view) => {
    setSelectedView(view);
    localStorage.setItem("timetable-view", view);
  };

  return (
    <Page title="Teacher Dashboard">
      {/* Sticky Header with Dropdown */}
      <div className="sticky top-0 z-40 flex flex-wrap items-center gap-4 px-4 pt-4 pb-2 sm:px-5 lg:px-6 bg-white dark:bg-dark-800">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-dark-100">
          Timetable View
        </h1>

        <Menu as="div" className="relative inline-block text-left">
          <MenuButton
            aria-label="Select timetable view"
            className="inline-flex min-w-[6rem] items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
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
            <MenuItems className="absolute left-0 z-50 mt-2 w-32 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-dark-700">
              {["Week", "Term"].map((view) => (
                <MenuItem key={view} as={Fragment}>
                  {({ active, close }) => (
                    <button
                      onClick={() => {
                        handleViewChange(view);
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

      {/* Main Grid Layout */}
      <div className="transition-content mt-4 grid w-full grid-cols-12 gap-4 px-4 pb-8 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
        <div className="col-span-12 lg:col-span-8 xl:col-span-9">
          <Classes />
          <div className="mt-4">
            <WeeklyTimeTable key={selectedView} view={selectedView} />
          </div>
        </div>

        <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:sticky lg:top-20 lg:col-span-4 lg:grid-cols-1 lg:gap-6 lg:self-start xl:col-span-3">
          <WorkingHours />
          <Students />
          <Calendar />
        </div>
      </div>
    </Page>
  );
}
