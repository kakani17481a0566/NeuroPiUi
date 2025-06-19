import {
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import { useCallback, useState } from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useClick,
  useDismiss,
  useInteractions,
} from "@floating-ui/react";

import { Button } from "components/ui";
import { ConfirmModal } from "components/shared/ConfirmModal";
// import clsx from "clsx";

// ----------------------------------------------------------------------

const confirmMessages = {
  pending: {
    description: "Are you sure you want to delete this role? Once deleted, it cannot be restored.",
  },
  success: {
    title: "Role Deleted",
  },
};

export function RowActions({ row, table }) {
  const [open, setOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  const {
    refs,
    floatingStyles,
    context,
  } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(6), flip(), shift()],
    placement: "bottom-end",
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  const handleDeleteRows = useCallback(() => {
    setConfirmDeleteLoading(true);
    setTimeout(() => {
      table.options.meta?.deleteRow(row);
      setDeleteSuccess(true);
      setConfirmDeleteLoading(false);
    }, 1000);
  }, [row, table]);

  const handleView = () => {
    table.options.meta?.setSelectedRole(row.original);
    table.options.meta?.setDrawerOpen(true);
    table.options.meta?.setEditMode(false);
    setOpen(false);
  };

  const handleEdit = () => {
    table.options.meta?.setSelectedRole(row.original);
    table.options.meta?.setDrawerOpen(true);
    table.options.meta?.setEditMode(true);
    setOpen(false);
  };

  const openModal = () => {
    setDeleteModalOpen(true);
    setDeleteError(false);
    setDeleteSuccess(false);
    setOpen(false);
  };

  const closeModal = () => setDeleteModalOpen(false);
  const state = deleteError ? "error" : deleteSuccess ? "success" : "pending";

  return (
    <>
      <div className="flex justify-center">
        <Button
          isIcon
          className="size-7 rounded-full"
          variant="flat"
          ref={refs.setReference}
          {...getReferenceProps()}
        >
          <EllipsisHorizontalIcon className="size-4.5" />
        </Button>

        {open && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-50 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg dark:border-dark-500 dark:bg-dark-750"
          >
            <button
              onClick={handleView}
              className="flex w-full items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-600"
            >
              <EyeIcon className="size-4.5" />
              <span>View</span>
            </button>
            <button
              onClick={handleEdit}
              className="flex w-full items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-600"
            >
              <PencilIcon className="size-4.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={openModal}
              className="flex w-full items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-600/20"
            >
              <TrashIcon className="size-4.5" />
              <span>Delete</span>
            </button>
          </div>
        )}
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
  row: PropTypes.object.isRequired,
  table: PropTypes.object.isRequired,
};
