import dayjs from "dayjs";
import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import axios from "axios";
import { Button, GhostSpinner } from "components/ui";
import { Transition, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  ArrowUpTrayIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { CiViewTable } from "react-icons/ci";
import clsx from "clsx";
import { ConfirmModal } from "components/shared/ConfirmModal";
import toast from "react-hot-toast";

export function SelectedRowsActions({ table }) {
  const [checkLoading, setCheckLoading] = useState(false);
  const [confirmType, setConfirmType] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const selectedRows = table.getSelectedRowModel().rows;

  const eligibleForCheckIn = selectedRows.some((row) => {
    const { fromTime } = row.original;
    return !fromTime || fromTime === "Not marked";
  });

  const eligibleForCheckOut = selectedRows.some((row) => {
    const { fromTime, toTime } = row.original;
    return fromTime && fromTime !== "Not marked" && (!toTime || toTime === "Not marked");
  });

  const handleBulkCheck = async (type) => {
    setShowConfirmModal(false);
    setCheckLoading(true);

    const now = dayjs().format("HH:mm:ss");
    const today = dayjs().format("YYYY-MM-DD");

    const entries = selectedRows
      .filter((row) => {
        const { fromTime, toTime } = row.original;
        if (type === "in") return !fromTime || fromTime === "Not marked";
        if (type === "out")
          return fromTime && fromTime !== "Not marked" && (!toTime || toTime === "Not marked");
        return false;
      })
      .map((row) => ({
        studentId: row.original.studentId,
        fromTime: type === "in" ? now : "00:00:00",
        toTime: type === "out" ? now : "00:00:00",
      }));

    if (!entries.length) {
      toast.error("No eligible students found for this action.");
      setCheckLoading(false);
      return;
    }

    const payload = {
      date: today,
      userId: 1,
      branchId: 1,
      tenantId: 1,
      entries,
    };

    try {
      await axios.post(
        "https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/StudentAttendance/mark-attendance",
        payload
      );
      table.options.meta?.fetchData?.();
      toast.success(`Check-${type === "in" ? "In" : "Out"} successful for ${entries.length} students.`);
    } catch (err) {
      console.error(`Bulk check-${type} failed:`, err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setCheckLoading(false);
    }
  };

  const totalSelected = selectedRows.length;
  const alreadyCheckedIn = selectedRows.filter(
    (row) => row.original.fromTime && row.original.fromTime !== "Not marked"
  ).length;
  const alreadyCheckedOut = selectedRows.filter(
    (row) => row.original.toTime && row.original.toTime !== "Not marked"
  ).length;

  const eligibleCount =
    confirmType === "in"
      ? totalSelected - alreadyCheckedIn
      : selectedRows.filter(
          (row) =>
            row.original.fromTime &&
            row.original.fromTime !== "Not marked" &&
            (!row.original.toTime || row.original.toTime === "Not marked")
        ).length;

  const confirmMessages = {
    pending: {
      title: "Confirm Bulk Marking",
      description: `You selected ${totalSelected} students.\n\n` +
        `✔️ Already Checked-In: ${alreadyCheckedIn}\n` +
        `✔️ Already Checked-Out: ${alreadyCheckedOut}\n\n` +
        `👉 Eligible for ${
          confirmType === "in" ? "Check-In" : "Check-Out"
        }: ${eligibleCount}`,
      actionText: confirmType === "in" ? "Confirm Check-In" : "Confirm Check-Out",
    },
    success: {
      title: "Marked Successfully",
    },
  };

  return (
    <>
      <Transition
        as={Fragment}
        show={table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()}
        enter="transition-all duration-200"
        enterFrom="opacity-0 translate-y-4"
        enterTo="opacity-100 translate-y-0"
        leave="transition-all duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-4"
      >
        <div className="sticky inset-x-0 bottom-0 z-10 flex items-center justify-center px-2 sm:px-4">
          <div className="hidden w-full max-w-xl rounded-lg bg-gray-800 px-3 py-2 text-sm font-medium text-gray-100 shadow-md dark:bg-dark-50 dark:text-dark-900 sm:block sm:py-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-center sm:text-left">
                <span>{selectedRows.length} Selected</span>{" "}
                <span className="max-sm:hidden">from {table.getCoreRowModel().rows.length}</span>
              </p>

              <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
                <Button
                  onClick={() => {
                    setConfirmType("in");
                    setShowConfirmModal(true);
                  }}
                  className={clsx(
                    "min-h-[44px] w-full sm:w-auto rounded-full px-3 py-1.5 text-xs-plus transition active:scale-95",
                    checkLoading && "pointer-events-none opacity-60"
                  )}
                  color="success"
                  disabled={checkLoading || !eligibleForCheckIn}
                >
                  {checkLoading && confirmType === "in" ? (
                    <GhostSpinner className="size-3.5 shrink-0 border-2" variant="soft" />
                  ) : (
                    <>
                      <ArrowDownCircleIcon className="size-4 text-primary-600" />
                      <span className="text-primary-950">Check-In All</span>
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => {
                    setConfirmType("out");
                    setShowConfirmModal(true);
                  }}
                  className={clsx(
                    "min-h-[44px] w-full sm:w-auto rounded-full px-3 py-1.5 text-xs-plus transition active:scale-95",
                    checkLoading && "pointer-events-none opacity-60"
                  )}
                  color="warning"
                  disabled={checkLoading || !eligibleForCheckOut}
                >
                  {checkLoading && confirmType === "out" ? (
                    <GhostSpinner className="size-3.5 shrink-0 border-2" variant="soft" />
                  ) : (
                    <>
                      <ArrowUpCircleIcon className="size-4 text-primary-600" />
                      <span className="text-primary-950">Check-Out All</span>
                    </>
                  )}
                </Button>

                <Menu as="div" className="relative inline-block text-left">
                  <MenuButton
                    as={Button}
                    className="min-h-[44px] rounded-full px-3 py-1.5 text-xs-plus"
                  >
                    <EllipsisHorizontalIcon className="size-4" />
                    <span className="max-sm:hidden"> More</span>
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
                    <MenuItems
                      anchor={{ to: "top end", gap: "8px" }}
                      className="absolute z-100 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 text-xs-plus text-gray-600 shadow-soft outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-750 dark:text-dark-200 dark:shadow-none"
                    >
                      <MenuItem>
                        {({ focus }) => (
                          <button
                            className={clsx(
                              "flex h-9 w-full items-center space-x-3 px-3 transition-colors",
                              focus && "bg-gray-100 dark:bg-dark-600"
                            )}
                          >
                            <ArrowUpTrayIcon className="size-4.5 text-primary-600" />
                            <span className="text-primary-950">Export CSV</span>
                          </button>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ focus }) => (
                          <button
                            className={clsx(
                              "flex h-9 w-full items-center space-x-3 px-3 transition-colors",
                              focus && "bg-gray-100 dark:bg-dark-600"
                            )}
                          >
                            <ArrowUpTrayIcon className="size-4.5 text-primary-600" />
                            <span className="text-primary-950">Export PDF</span>
                          </button>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ focus }) => (
                          <button
                            className={clsx(
                              "flex h-9 w-full items-center space-x-3 px-3 transition-colors",
                              focus && "bg-gray-100 dark:bg-dark-600"
                            )}
                          >
                            <CiViewTable className="size-4.5 text-primary-600" />
                            <span className="text-primary-950">Save as View</span>
                          </button>
                        )}
                      </MenuItem>
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <ConfirmModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        messages={confirmMessages}
        onOk={() => handleBulkCheck(confirmType)}
        confirmLoading={checkLoading}
        state="pending"
      />
    </>
  );
}

SelectedRowsActions.propTypes = {
  table: PropTypes.object,
};
