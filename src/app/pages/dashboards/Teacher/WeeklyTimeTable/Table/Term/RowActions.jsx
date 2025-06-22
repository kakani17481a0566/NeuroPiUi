// RowActions.jsx using @floating-ui/react for better dropdown handling

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
import {
  ChevronUpIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useCallback, useState } from "react";
import PropTypes from "prop-types";
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
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(6), flip(), shift()],
    whileElementsMounted: autoUpdate,
    placement: "bottom-end",
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

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

  return (
    <>
      <div className="flex justify-center gap-1">
        {row.getCanExpand() && (
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
        )}

        <Button
          isIcon
          variant="flat"
          className="size-7 rounded-full"
          ref={refs.setReference}
          {...getReferenceProps()}
        >
          <EllipsisHorizontalIcon className="size-4.5" />
        </Button>

        {isOpen && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="absolute z-50 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg dark:border-dark-500 dark:bg-dark-750"
          >
            <button
              className="flex w-full items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-dark-600"
            >
              <EyeIcon className="size-4.5 stroke-1" />
              <span>View</span>
            </button>
            <button
              className="flex w-full items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-dark-600"
            >
              <PencilIcon className="size-4.5 stroke-1" />
              <span>Edit</span>
            </button>
            <button
              onClick={openModal}
              className="flex w-full items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <TrashIcon className="size-4.5 stroke-1" />
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
  row: PropTypes.object,
  table: PropTypes.object,
};
