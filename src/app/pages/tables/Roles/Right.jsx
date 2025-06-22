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
import { Button } from "components/ui";

export function Right({ isOpen, onClose, role, onSave, viewMode = false }) {
  const [formData, setFormData] = useState({ name: "" });
  const isCreating = !role;

  useEffect(() => {
    setFormData({ name: role?.name || "" });
  }, [role]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const userId = parseInt(localStorage.getItem("userId"), 10);
    const tenantId = parseInt(localStorage.getItem("tenantId"), 10);

    if (!formData.name.trim()) {
      toast.error("Role name is required");
      return;
    }

    if (!userId || !tenantId) {
      console.error("Missing userId or tenantId:", { userId, tenantId });
      toast.error("Session error: user or tenant info missing");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      ...(role ? { updatedBy: userId } : { createdBy: userId, tenantId }),
    };

    const url = role
      ? `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/Role/tenant/${tenantId}/id/${role.id}`
      : `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/Role`;

    const method = role ? "PUT" : "POST";

    try {
      console.log(`[${method}] URL:`, url);
      console.log("Payload:", payload);

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      console.log("Raw Response:", text);

      let result;
      try {
        result = JSON.parse(text);
      } catch {
        console.error("Failed to parse JSON:", text);
        toast.error("Unexpected response from server");
        return;
      }

      console.log("Parsed Result:", result);

      if (res.ok && result.statusCode === 200) {
        toast.success(isCreating ? "Role created successfully" : "Role updated successfully");
        onSave?.();
        onClose();
      } else {
        console.error("API Error:", result);
        toast.error(result.message || result.error || "Failed to save role");
      }
    } catch (err) {
      console.error("Network error:", err);
      toast.error("Something went wrong while saving");
    }
  };

  if (!isOpen) return null;

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
          <DialogPanel className="fixed right-0 top-0 h-full w-full max-w-sm sm:max-w-xs bg-white dark:bg-dark-700 flex flex-col shadow-lg">
            <div className="flex space-x-4 px-4 pt-5">
              <div className="mt-2 w-full min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="truncate text-base font-medium text-gray-800 dark:text-dark-50">
                      {isCreating
                        ? "Create Role"
                        : viewMode
                        ? "View Role"
                        : "Edit Role"}
                    </h4>
                    {!isCreating && (
                      <span className="text-xs-plus text-primary-600 dark:text-primary-400">
                        Tenant: {role?.tenantName || "N/A"}
                      </span>
                    )}
                  </div>
                  <Button onClick={onClose} variant="flat" isIcon className="size-6 rounded-full">
                    <XMarkIcon className="size-5" />
                  </Button>
                </div>
              </div>
            </div>

            <hr className="mx-5 my-4 border-gray-200 dark:border-dark-500" />

            <div className="flex-1 overflow-y-auto px-4 pb-6">
              <div className="space-y-5">
                <div>
                  <h5 className="text-sm font-medium text-gray-500 dark:text-dark-200 mb-1">
                    Role Name
                  </h5>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={viewMode}
                    placeholder="Enter role name"
                    className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none ${
                      viewMode
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-dark-600"
                        : "bg-white dark:bg-dark-600 dark:text-dark-50"
                    } border-gray-300 dark:border-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500`}
                  />
                </div>

                {!viewMode && (
                  <Button onClick={handleSubmit} color="primary" className="w-full">
                    {isCreating ? "Create Role" : "Save Changes"}
                  </Button>
                )}
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

Right.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  role: PropTypes.object,
  onSave: PropTypes.func,
  viewMode: PropTypes.bool,
};
