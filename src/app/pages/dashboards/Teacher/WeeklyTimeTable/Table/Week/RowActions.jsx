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
import clsx from "clsx";
import { useCallback, useState } from "react";
// import clsx from "clsx";
// import { useCallback, useState } from "react";
import PropTypes from "prop-types";
// import { Document, Page } from "react-pdf";
// import { pdfjs } from "react-pdf";
import Vimeo from '@u-wave/react-vimeo';






import { Button } from "components/ui";
import { fetchWeeklyTimeTableData } from "./data";




export function RowActions({ row }) {
  const [showPdfViewerModal, setShowPdfViewerModal] = useState(false);
  // const [numPages] = useState();
  // const [pageNumber, setPageNumber] = useState(1);
  const [showResourcePopup, setShowResourcePopup] = useState(false);
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [pdfPath, setPdfPath] = useState("");
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [linkId, setlinkId] = useState("");
  const [openedFromResources, setOpenedFromResources] = useState(false);

  const handleViewPdfPopup = useCallback(() => {
    setShowPdfViewerModal(true);
    setOpenedFromResources(false);
    setPdfPath(row.original.column8);
  }, []);
  const handlepdfResource = (pdf) => {
    setShowPdfViewerModal(true);
    setShowResourcePopup(false);
    setPdfPath(pdf.link);
  }
  const handleClosePopup = () => {
    setShowResourcePopup(false);
  };


  const handleViewResourcePopup = async () => {
    setOpenedFromResources(true);
    setShowResourcePopup(true);
    setLoadingResources(true);
    try {
      const resourceList = await fetchWeeklyTimeTableData(); // get from API
      setResources(resourceList.resources);
      console.log(resources);
    } catch (err) {
      console.error("Failed to fetch resources:", err);
      setResources([]);
    } finally {
      setLoadingResources(false);
    }
  };

  const handleResourceClick = (res) => {
    setlinkId(res.link);
    setShowVideoPlayer(true);
  };
  const handlePdfPopUpClose = () => {
    setShowPdfViewerModal(false);
    if (openedFromResources) {
      setShowResourcePopup(true);
    }
  };

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
                  onClick={handleViewResourcePopup}
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
          </Transition>
        </Menu>
      </div>

      {showPdfViewerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 max-w-3xl w-full relative shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">PDF View </h2>
              <button
                onClick={handlePdfPopUpClose}
                className="text-red-500 font-bold text-xl"
              >
                &times;
              </button>
            </div>
            <div className="overflow-auto max-h-[70vh] border rounded">
              <iframe
                src={pdfPath}
                className="w-full h-[70vh]"
                title="PDF Viewer"
                sandbox="allow-scripts allow-same-origin"
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        </div>
      )}
      {showResourcePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full shadow-lg relative overflow-hidden">
            <h2 className="text-lg font-semibold mb-4">Resources</h2>

            {loadingResources ? (
              <p>Loading...</p>
            ) : resources ? (
              <table className="w-full border table-fixed">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-center w-1/2 border-b align-middle">PDF Resources</th>
                    <th className="p-2 text-center w-1/2 border-b align-middle">Video Resources</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const pdfResources = [...(resources.anx || [])];
                    const mp4Resources = resources.mp4 || [];
                    const maxLength = Math.max(pdfResources.length, mp4Resources.length);

                    return Array.from({ length: maxLength }).map((_, index) => {
                      const pdf = pdfResources[index];
                      const video = mp4Resources[index];

                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="p-2 border-b text-center align-middle break-words">
                            {pdf ? (
                              <button
                                onClick={() => handlepdfResource(pdf)}
                                className="text-blue-600 underline block truncate max-w-full"
                                title={pdf.name}
                              >
                                {pdf.name}
                              </button>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="p-2 border-b text-center align-middle break-words">
                            {video ? (
                              <button
                                onClick={() => handleResourceClick(video)}
                                className="text-blue-600 underline block truncate max-w-full"
                                title={video.name}
                              >
                                {video.name}
                              </button>
                            ) : (
                              "-"
                            )}
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            ) : (
              <p>No resources found.</p>
            )}
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={handleClosePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showVideoPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 max-w-3xl w-full relative shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Video Player</h2>
              <button
                onClick={() => setShowVideoPlayer(false)}
                className="text-red-500 font-bold text-xl"
              >
                &times;
              </button>
            </div>
            <div className="w-full aspect-video rounded overflow-hidden border">
              <Vimeo
                video={linkId}
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
