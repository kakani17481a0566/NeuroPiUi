// RowActions.jsx

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
  LinkIcon} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Vimeo from '@u-wave/react-vimeo';


// Local Imports
// import { ConfirmModal } from "components/shared/ConfirmModal";
import { Button } from "components/ui";
import { pdfjs } from "react-pdf";
// import { Document, Page } from "react-pdf";
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


// ----------------------------------------------------------------------



export function RowActions({ row }) {

    const [showPdfViewerModal, setShowPdfViewerModal] = useState(false);
  const[pdfPath, setPdfPath] = useState("");
  const [showVideoModal, setShowVideoModal] = useState(false);
  

 const handleViewPdfPopup = useCallback(() => {
    setShowPdfViewerModal(true);
    setPdfPath(row.original.column8) // Set the PDF path from row data or a default path  
  }, []);
 

 
  

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
            className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg dark:border-dark-500 dark:bg-dark-750 ltr:right-0 rtl:left-0"
          >
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={handleViewPdfPopup}
                  className={clsx(
                    "flex h-9 w-full items-center space-x-3 px-3",
                    focus && "bg-gray-100 dark:bg-dark-600"
                  )}
                >
                  <EyeIcon className="size-4.5 stroke-1" />
                  <span>Lesson Plan</span>
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={() =>
                    setShowVideoModal(true)}
                  className={clsx(
                    "flex h-9 w-full items-center space-x-3 px-3",
                    focus && "bg-gray-100 dark:bg-dark-600"
                  )}
                >
                  <LinkIcon className="size-4.5 stroke-1" />
                  <span>Resourses</span>
                </button>
              )}
            </MenuItem>
            {/* <MenuItem>
              {({ focus }) => (
                <button
                  onClick={openModal}
                  className={clsx(
                    "flex h-9 w-full items-center space-x-3 px-3 text-red-600",
                    focus && "bg-red-100 dark:bg-red-600/10"
                  )}
                >
                  <TrashIcon className="size-4.5 stroke-1" />
                  <span>Assignment</span>
                </button>
              )}
            </MenuItem> */}
          </Transition>
        </Menu>
      </div>

      

      {showPdfViewerModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-4 max-w-3xl w-full relative shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">PDF View </h2>
                    <button
                      onClick={() => setShowPdfViewerModal(false)}
                      className="text-red-500 font-bold text-xl"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="flex justify-between mb-2">
                    <iframe
                      src={pdfPath}
                      className="w-full h-[70vh] border rounded"
                      title="PDF Viewer"
                    ></iframe>

                  </div>
                </div>
              </div>
            )}
            {showVideoModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-white rounded-lg p-4 max-w-3xl w-full relative shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-lg font-semibold">Video Player</h2>
                          <button
                            onClick={() => setShowVideoModal(false)}
                            className="text-red-500 font-bold text-xl"
                          >
                            &times;
                          </button>
                        </div>
                        <div className="w-full aspect-video rounded overflow-hidden border">
                          <Vimeo
                            video="785969913" 
                            width="100%"
                            height="100%"
                            responsive
                            autoplay
                          />
                        </div>
                      </div>
                    </div>
                  )}
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object.isRequired,
  table: PropTypes.object.isRequired,
};
