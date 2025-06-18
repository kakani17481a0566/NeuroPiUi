import PropTypes from "prop-types";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

// Local Imports
import { Avatar, Button } from "components/ui";

export function Right({ isOpen, onClose, role, isEditMode, onSave }) {
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    if (role) {
      setFormData({ name: role.name || "" });
    }
  }, [role]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`https://localhost:7202/api/Role/tenant/1/id/${role.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, updatedBy: 1 }),
      });

      if (res.ok) {
        toast.success("Role updated successfully");
        onSave?.();
        onClose();
      } else {
        toast.error("Failed to update role");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  if (!isOpen || !role) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur dark:bg-black/40" />
        </TransitionChild>

        <TransitionChild
          as={Fragment}
          enter="ease-out transform-gpu transition-transform duration-200"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in transform-gpu transition-transform duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <DialogPanel className="fixed right-0 top-0 flex h-full w-72 flex-col bg-white dark:bg-dark-700">
            <div className="h-24">
              <img
                className="h-full w-full object-cover object-center"
                src="/images/800x600.png"
                alt="profile background"
              />
            </div>

            <div className="flex space-x-4 px-4">
              <Avatar size={20} src="/images/200x200.png" className="-mt-5" />
              <div className="mt-2 w-full min-w-0">
                <div className="flex justify-between">
                  <h4 className="truncate text-base font-medium text-gray-800 dark:text-dark-50">
                    {isEditMode ? "Edit Role" : "Role Details"}
                  </h4>
                  <Button onClick={onClose} variant="flat" isIcon className="size-6 rounded-full">
                    <XMarkIcon className="size-4.5" />
                  </Button>
                </div>
                <span className="text-xs-plus text-primary-600 dark:text-primary-400">
                  ID: {role.id}
                </span>
              </div>
            </div>

            <hr className="mx-5 my-4 border-gray-200 dark:border-dark-500" />

            {isEditMode ? (
              <div className="p-4 space-y-5">
                <div>
                  <h5 className="text-sm font-medium text-gray-500 dark:text-dark-200 mb-1">
                    Role Name
                  </h5>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter role name"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-dark-500 dark:bg-dark-600 dark:text-dark-50 dark:placeholder-dark-400"
                  />
                </div>

                <Button onClick={handleSubmit} color="primary" className="w-full">
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                <p className="text-sm text-gray-700 dark:text-dark-200">
                  <strong>Role Name:</strong> {role.name}
                </p>
                <p className="text-sm text-gray-700 dark:text-dark-200">
                  <strong>Role ID:</strong> {role.id}
                </p>
              </div>
            )}
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

Right.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  role: PropTypes.object,
  isEditMode: PropTypes.bool,
  onSave: PropTypes.func,
};
