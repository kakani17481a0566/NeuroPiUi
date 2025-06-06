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
import { useCallback, useState } from "react";

import { ConfirmModal } from "components/shared/ConfirmModal";
import { Button } from "components/ui";

const confirmMessages = {
  pending: {
    description:
      "Are you sure you want to delete this user? Once deleted, it cannot be restored.",
  },
  success: {
    title: "User Deleted",
  },
};

export function RowActions({ row, table }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleDelete = useCallback(async () => {
    const { userId, tenantId } = row.original;

    setLoading(true);
    setError(false);
    setSuccess(false);

    try {
      const res = await fetch(
        // `https://localhost:7171/api/User?id=${userId}&tenantId=${tenantId}`,
        `https://localhost:7202/api/User?id=${userId}&tenantId=${tenantId}`,

        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Failed to delete user");

      table.options.meta?.deleteRow(row);
      setSuccess(true);
    } catch (err) {
      console.error("Delete error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [row, table]);

  const state = error ? "error" : success ? "success" : "pending";
  
  const handleEdit = useCallback(async () => {
    const { userId, tenantId } = row.original;

    try {
      const response = await fetch(
        // `https://localhost:7171/api/User?id=${userId}&tenantId=${tenantId}`,

        `https://localhost:7202/api/User?id=${userId}&tenantId=${tenantId}`,

        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify({
            username: row.original.username,
            firstName: row.original.firstName,
            middleName: row.original.middleName,
            lastName: row.original.lastName,
            email: row.original.email,
            password: row.original.password,
            mobileNumber: row.original.mobileNumber,
            alternateNumber: row.original.alternateNumber,
            dateOfBirth: row.original.dateOfBirth,
            address: row.original.address,
            updatedBy:userId ,
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user.");
      }

      const result = await response.json();
      console.log("User updated:", result);
      // Optionally show a success toast here
    } catch (error) {
      console.error("Edit error:", error);
      // Optionally show an error toast here
    }
  }, [row]);


  return (
    <>
      <div className="flex justify-center">
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

        <Menu as="div" className="relative inline-block text-left">
          <MenuButton as={Button} variant="flat" isIcon className="size-7 rounded-full">
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
            className="absolute z-10 mt-1.5 min-w-[10rem] rounded-lg border bg-white py-1 shadow-lg ltr:right-0 rtl:left-0"
          >
            <MenuItem>
              {({ focus }) => (
                <button
                  className={clsx(
                    "flex h-9 w-full items-center space-x-3 px-3 transition-colors",
                    focus && "bg-gray-100"
                  )}
                >
                  <EyeIcon className="size-4.5" />
                  <span>View</span>
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={handleEdit}
                  className={clsx(
                    "flex h-9 w-full items-center space-x-3 px-3 transition-colors",
                    focus && "bg-gray-100"
                  )}
                >
                  <PencilIcon className="size-4.5" />
                  <span>Edit</span>
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={() => setShowModal(true)}
                  className={clsx(
                    "text-red-600 flex h-9 w-full items-center space-x-3 px-3 transition-colors",
                    focus && "bg-red-50"
                  )}
                >
                  <TrashIcon className="size-4.5" />
                  <span>Delete</span>
                </button>
              )}
            </MenuItem>
          </Transition>
        </Menu>
      </div>

      <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        messages={confirmMessages}
        onOk={handleDelete}
        confirmLoading={loading}
        state={state}
      />
    </>
  );
}
