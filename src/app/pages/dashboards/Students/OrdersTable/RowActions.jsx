// Import Dependencies
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
  // TrashIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
// import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import StudentAttendanceGraph  from "app/pages/charts/studentattendence";

// Local Imports
// import { ConfirmModal } from "components/shared/ConfirmModal";
import { Button } from "components/ui";
import { useState } from "react";

// ----------------------------------------------------------------------

// const confirmMessages = {
//   pending: {
//     description:
//       "Are you sure you want to delete this order? Once deleted, it cannot be restored.",
//   },
//   success: {
//     title: "Order Deleted",
//   },
// };

export function RowActions({ row }) {
  const [showAttendancePopUp,setShowAttendancePopUp]=useState(false);
  const handlePdfPopUpClose=()=>{
    setShowAttendancePopUp(false);
  }
  const handleAttendanceOpen=()=>{
    setShowAttendancePopUp(true);
  }
  // const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  // const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  // const [deleteSuccess, setDeleteSuccess] = useState(false);
  // const [deleteError, setDeleteError] = useState(false);

  // const closeModal = () => {
  //   setDeleteModalOpen(false);
  // };

  // const openModal = () => {
  //   setDeleteModalOpen(true);
  //   setDeleteError(false);
  //   setDeleteSuccess(false);
  // };

  // const handleDeleteRows = useCallback(() => {
  //   setConfirmDeleteLoading(true);
  //   setTimeout(() => {
  //     table.options.meta?.deleteRow(row);
  //     setDeleteSuccess(true);
  //     setConfirmDeleteLoading(false);
  //   }, 1000);
  // }, [row]);

  // const state = deleteError ? "error" : deleteSuccess ? "success" : "pending";

  return (
    <>
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
                row.getIsExpanded() && "rotate-180",
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
                onClick={handleAttendanceOpen}
                  className={clsx(
                    "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors ",
                    focus &&
                      "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
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
                      "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                  )}
                >
                  <PencilIcon className="size-4.5 stroke-1" />
                  <span>Edit</span>
                </button>
              )}
            </MenuItem>
            {/* <MenuItem>
              {({ focus }) => (
                <button
                  onClick={openModal}
                  className={clsx(
                    "this:error flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-hidden transition-colors dark:text-this-light ",
                    focus && "bg-this/10 dark:bg-this-light/10",
                  )}
                >
                  <TrashIcon className="size-4.5 stroke-1" />
                  <span>Delete</span>
                </button>
              )}
            </MenuItem> */}
          </Transition>
        </Menu>
      </div>

    {showAttendancePopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-primary-950 text-lg font-semibold">
                PDF View
              </h2>
              <button
                onClick={handlePdfPopUpClose}
                className="text-primary-600 text-xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto rounded border">
            <StudentAttendanceGraph/>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
};
