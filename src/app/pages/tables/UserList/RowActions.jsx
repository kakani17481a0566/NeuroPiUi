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
import { pdfjs } from "react-pdf";
import { Document, Page } from "react-pdf";
import Vimeo from '@u-wave/react-vimeo';




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
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  function nextPage() {
    setPageNumber((v) => ++v);
  }
  function prevPage() {
    setPageNumber((v) => --v);
  }


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
  const [showPdfViewerModal, setShowPdfViewerModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  //   const pdfPath = "/public/sample.pdf";

  const pdfPath = "https://drive.google.com/file/d/1LeSR1WhBKEaNFnkljfFSThrbIZ4QRblK/view?usp=sharing";


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
            updatedBy: userId,
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
  // const renderingpdf=()=>{
  //   alert("pdf is openeing");
  // }
  const handleViewPdfPopup = useCallback(() => {
    setShowPdfViewerModal(true);
  }, []);

  const handleVideoPopup = useCallback(() => {
    setShowVideoModal(true);
  }, []);

  /**
   * Closes the PDF viewer modal.
   */
  // const handleClosePdfViewerModal = useCallback(() => {
  //   setShowPdfViewerModal(false);
  // }, []);

  /**
   * Triggers the download of the PDF file.
   */
  // const handleDownloadPdf = useCallback(() => {
  //   const link = document.createElement('a');
  //   link.href = pdfPath;
  //   link.download = 'sample.pdf'; // Desired filename for download
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // }, [pdfPath]);



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
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={handleViewPdfPopup}
                  className={clsx(
                    "text-red-600 flex h-9 w-full items-center space-x-3 px-3 transition-colors",
                    focus && "bg-red-50"
                  )}
                >
                  {/* <TrashIcon className="size-4.5" /> */}
                  <span>Pdf</span>
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={handleVideoPopup}
                  className={clsx(
                    "text-red-600 flex h-9 w-full items-center space-x-3 px-3 transition-colors",
                    focus && "bg-red-50"
                  )}
                >
                  {/* <TrashIcon className="size-4.5" /> */}
                  <span>Video</span>
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
