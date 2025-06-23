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
import { Button } from "components/ui";
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
      {/* Header with Dropdown (Not sticky) */}
      <div className="flex flex-wrap items-center gap-4 px-4 pt-4 pb-2 sm:px-5 lg:px-6 bg-white dark:bg-dark-800 border-b border-gray-100 dark:border-dark-500">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-dark-100">
          Timetable View
        </h1>

        <div className="relative z-30 w-full sm:w-auto">
          <Menu as="div" className="relative inline-block text-start w-full">
            <MenuButton
              as={Button}
              color="primary"
              className="space-x-2 w-full sm:w-auto"
            >
              {({ open }) => (
                <>
                  <span>{selectedView}</span>
                  <ChevronDownIcon
                    className={clsx(
                      "size-4 transition-transform",
                      open && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                </>
              )}
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
              <MenuItems className="absolute right-0 z-[100] mt-1.5 min-w-[11rem] rounded-lg border border-gray-300 bg-white py-1 font-medium shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-700 dark:shadow-none">
                {["Week", "Term"].map((view) => (
                  <MenuItem key={view}>
                    {({ focus }) => (
                      <button
                        onClick={() => handleViewChange(view)}
                        className={clsx(
                          "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                          focus && "bg-primary-600 text-white"
                        )}
                      >
                        <span>{view}</span>
                      </button>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Transition>
          </Menu>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="transition-content mt-4 grid w-full grid-cols-12 gap-4 px-4 pb-8 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
        <div className="col-span-12 lg:col-span-8 xl:col-span-9">
          <Classes />
          <div className="mt-4">
            <WeeklyTimeTable key={selectedView} view={selectedView} />
          </div>
        </div>

        <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:col-span-4 lg:grid-cols-1 lg:gap-6 xl:col-span-3">
          <WorkingHours />
          <Students />
          <Calendar />
        </div>
      </div>
    </Page>
  );
}
