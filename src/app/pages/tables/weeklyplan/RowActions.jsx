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
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useCallback, useState, Fragment } from "react";

import { ConfirmModal } from "components/shared/ConfirmModal";
import { Button } from "components/ui";

const confirmMessages = {
  pending: {
    description:
      "Are you sure you want to delete this entry? This action cannot be undone.",
  },
  success: {
    title: "Entry Deleted",
  },
};

export function RowActions({ row, table }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  // DELETE handler
  const handleDelete = useCallback(async () => {
    const { dayName } = row.original;

    setLoading(true);
    setError(false);
    setSuccess(false);

    try {
      // Replace URL with your real delete API endpoint
      const res = await fetch(
        `https://your-api-url/api/weeklyplan?dayName=${encodeURIComponent(dayName)}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Failed to delete entry");

      // Remove row from table data
      table.options.meta?.deleteRow(row);

      setSuccess(true);
      setShowModal(false);
    } catch (err) {
      console.error("Delete error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [row, table]);

  // EDIT handler (example: open edit modal or API call)
  const handleEdit = useCallback(() => {
    // Example: you can open a modal or redirect to edit page here
    alert(`Edit entry for ${row.original.dayName} (implement your edit logic)`);
  }, [row]);

  return (
    <>
      <div className="flex justify-center items-center space-x-2">
        {row.getCanExpand() && (
          <Button
            isIcon
            className="size-7 rounded-full"
            variant="flat"
            onClick={row.getToggleExpandedHandler()}
            aria-label={row.getIsExpanded() ? "Collapse" : "Expand"}
          >
            <ChevronUpIcon
              className={clsx(
                "size-4.5 transition-transform",
                row.getIsExpanded() && "rotate-180"
              )}
            />
          </Button>
        )}

        <Menu as="div" className="relative inline-block text-left">
          <MenuButton
            as={Button}
            variant="flat"
            isIcon
            className="size-7 rounded-full"
            aria-label="Row actions menu"
          >
            <EllipsisHorizontalIcon className="size-4.5" />
          </MenuButton>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <MenuItems className="absolute z-10 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg ltr:right-0 rtl:left-0 dark:border-dark-500 dark:bg-dark-700">
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={handleEdit}
                    className={clsx(
                      "flex h-9 w-full items-center space-x-3 px-3 transition-colors",
                      active && "bg-gray-100 dark:bg-dark-600"
                    )}
                  >
                    <PencilIcon className="size-4.5" />
                    <span>Edit</span>
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={() => setShowModal(true)}
                    className={clsx(
                      "text-red-600 flex h-9 w-full items-center space-x-3 px-3 transition-colors",
                      active && "bg-red-50"
                    )}
                  >
                    <TrashIcon className="size-4.5" />
                    <span>Delete</span>
                  </button>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        messages={confirmMessages}
        onOk={handleDelete}
        confirmLoading={loading}
        state={error ? "error" : success ? "success" : "pending"}
      />
    </>
  );
}
