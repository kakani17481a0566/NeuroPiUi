import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  ChevronUpIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import dayjs from "dayjs";

// Local Imports
import { ConfirmModal } from "components/shared/ConfirmModal";
import { Button } from "components/ui";

const confirmMessages = {
  pending: {
    description:
      "Are you sure you want to delete this order? Once deleted, it cannot be restored.",
  },
  success: {
    title: "Order Deleted",
  },
};

export function RowActions({ row, table }) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [hasCheckedOut, setHasCheckedOut] = useState(false);

  const student = row.original;

  useEffect(() => {
    if (student.fromTime && student.fromTime !== "Not marked") setHasCheckedIn(true);
    if (student.toTime && student.toTime !== "Not marked") setHasCheckedOut(true);
  }, [student]);

  const closeModal = () => setDeleteModalOpen(false);
  const openModal = () => {
    setDeleteModalOpen(true);
    setDeleteError(false);
    setDeleteSuccess(false);
  };

  const handleDeleteRows = useCallback(() => {
    setConfirmDeleteLoading(true);
    setTimeout(() => {
      table.options.meta?.deleteRow(row);
      setDeleteSuccess(true);
      setConfirmDeleteLoading(false);
    }, 1000);
  }, [row]);

  const state = deleteError ? "error" : deleteSuccess ? "success" : "pending";

  const handleCheck = async (type) => {
    const now = dayjs().format("HH:mm:ss");
    const today = dayjs().format("YYYY-MM-DD");

    const payload = {
      date: today,
      userId: 1,
      branchId: 1,
      tenantId: 1,
      entries: [
        {
          studentId: student.studentId,
          fromTime: type === "in" ? now : "00:00:00",
          toTime: type === "out" ? now : "00:00:00",
        },
      ],
    };

    try {
      await axios.post("https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/StudentAttendance/mark-attendance", payload);
      if (type === "in") setHasCheckedIn(true);
      if (type === "out") setHasCheckedOut(true);
        table.options.meta?.fetchData?.();

    } catch (err) {
      console.error("Attendance marking failed:", err);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center space-y-1">
        <div className="flex space-x-2">
          <Button
            color="success"
            variant="soft"
            className="rounded-full border border-this-darker/40 dark:border-this-lighter/30 px-2 text-xs"
            onClick={() => handleCheck("in")}
            disabled={hasCheckedIn}
          >
            Check-In
          </Button>
          <Button
            color="warning"
            variant="soft"
            className="rounded-full border border-this-darker/40 dark:border-this-lighter/30 px-2 text-xs"
            onClick={() => handleCheck("out")}
            disabled={!hasCheckedIn || hasCheckedOut}
          >
            Check-Out
          </Button>
        </div>

        <div className="flex justify-center">
          {row.getCanExpand() ? (
            <Button
              isIcon
              className="size-7 rounded-full"
              variant="flat"
              onClick={row.getToggleExpandedHandler()}
            >
              <ChevronUpIcon
                className={clsx(
                  "size-4.5 transition-transform",
                  row.getIsExpanded() && "rotate-180"
                )}
              />
            </Button>
          ) : null}
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton
              as={Button}
              variant="flat"
              isIcon
              className="size-7 rounded-full"
            >
              <EllipsisHorizontalIcon className="size-4.5" />
            </MenuButton>
            <Transition
              as={MenuItems}
              enter="transition ease-out"
              enterFrom="opacity-0 translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-2"
              className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-750 dark:shadow-none ltr:right-0 rtl:left-0"
            >
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={clsx(
                      "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors ",
                      focus &&
                        "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                    )}
                  >
                    <EyeIcon className="size-4.5 stroke-1" />
                    <span>View</span>
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={clsx(
                      "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors ",
                      focus &&
                        "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                    )}
                  >
                    <PencilIcon className="size-4.5 stroke-1" />
                    <span>Edit</span>
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={openModal}
                    className={clsx(
                      "this:error flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-hidden transition-colors dark:text-this-light ",
                      focus && "bg-this/10 dark:bg-this-light/10"
                    )}
                  >
                    <TrashIcon className="size-4.5 stroke-1" />
                    <span>Delete</span>
                  </button>
                )}
              </MenuItem>
            </Transition>
          </Menu>
        </div>
      </div>

      <ConfirmModal
        show={deleteModalOpen}
        onClose={closeModal}
        messages={confirmMessages}
        onOk={handleDeleteRows}
        confirmLoading={confirmDeleteLoading}
        state={state}
      />
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
};
