import { Page } from "components/shared/Page";
import { Button } from "components/ui";
// import EditForm from "./editForm"; // verify this path is correct
//import OrdersDatatableV2 from "app/pages/tables/UserList"; // verify this path is correct
import { ActivitiesTable } from "./ActivitiesTable";

import { EditForm } from "./editForm";

import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";

import { useDisclosure } from "hooks";

export default function Test() {
  const [isOpen, { open, close }] = useDisclosure(false);

  return (
    <Page title="Homepage">
      <div className="transition-content w-full px-[var(--margin-x)] pt-5 lg:pt-6">
        <div className="min-w-0">
          <h2 className="dark:text-dark-50 truncate text-xl font-medium tracking-wide text-gray-800">
            User List
          </h2>

          <div className="mt-4">
            {" "}
            {/* Added margin top for better spacing */}
            <Button onClick={open}>Left Drawer</Button>
            <ActivitiesTable onEdit={open} />
            <Transition appear show={isOpen} as={Fragment}>
              <Dialog as="div" className="relative z-[100]" onClose={close}>
                <TransitionChild
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-gray-900/50 backdrop-blur transition-opacity dark:bg-black/40" />
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
                  <DialogPanel className="dark:bg-dark-700 fixed top-0 right-0 flex h-full w-200 transform-gpu flex-col bg-white transition-transform duration-200">
                    <EditForm />
                  </DialogPanel>
                </TransitionChild>
              </Dialog>
            </Transition>
          </div>
        </div>
      </div>
    </Page>
  );
}
