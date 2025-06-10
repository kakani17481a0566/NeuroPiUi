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
  LinkIcon
} from "@heroicons/react/24/outline";
import { useCallback, useState } from "react";


import clsx from "clsx";
// import { useCallback, useState } from "react";
import PropTypes from "prop-types";

// Local Imports
// import { ConfirmModal } from "components/shared/ConfirmModal";
import { Button } from "components/ui";
import { pdfjs } from "react-pdf";
import { Document, Page } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// ----------------------------------------------------------------------

// const confirmMessages = {
//   pending: {
//     description:
//       "Are you sure you want to delete this row? Once deleted, it cannot be restored.",
//   },
//   success: {
//     title: "Row Deleted",
//   },
// };

export function RowActions({ row }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
    const [showPdfViewerModal, setShowPdfViewerModal] = useState(false);
      function nextPage() {
    setPageNumber((v) => ++v);
  }
  function prevPage() {
    setPageNumber((v) => --v);
  }
    const pdfPath = "https://drive.google.com/file/d/1-apEdtuKa0-0Lm0-VF0KXWmgYsyIhWCu/view?usp=sharing";


     function onDocumentLoadSuccess({ numPages }) {
            setNumPages(numPages);
          }
            const handleViewPdfPopup = useCallback(() => {
              setShowPdfViewerModal(true);
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
                  onClick={() =>
                    console.log("👁️ View clicked:", row.original)
                  }
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
                  onClick={ handleViewPdfPopup}
                  className={clsx(
                    "flex h-9 w-full items-center space-x-3 px-3",
                    focus && "bg-gray-100 dark:bg-dark-600"
                  )}
                >
                  <LinkIcon className="size-4.5 stroke-1" />
                  <span>Resource Link</span>
                </button>
              )}
            </MenuItem>

          </Transition>
        </Menu>
      </div>

      {/* <ConfirmModal
        show={deleteModalOpen}
        onClose={closeModal}
        messages={confirmMessages}
        onOk={handleDeleteRows}
        confirmLoading={confirmDeleteLoading}
        state={state}
      /> */}
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
              <button
                onClick={prevPage}
                disabled={pageNumber <= 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={nextPage}
                disabled={pageNumber >= (numPages ?? -1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="overflow-auto max-h-[70vh] border rounded">
              <Document
                file={pdfPath}
                onLoadSuccess={onDocumentLoadSuccess}
                className="my-react-pdf"
              >
                <Page pageNumber={pageNumber} />
              </Document>
            </div>
            <p className="mt-2 text-center text-sm">
              Page {pageNumber} of {numPages}
            </p>
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
