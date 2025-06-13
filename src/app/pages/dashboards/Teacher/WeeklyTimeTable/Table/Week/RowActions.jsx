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
  LinkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Vimeo from "@u-wave/react-vimeo";

import { Button } from "components/ui";
import { fetchWeeklyTimeTableData } from "./data";

export function RowActions({ row }) {
  const [showPdfViewerModal, setShowPdfViewerModal] = useState(false);
  const [showResourcePopup, setShowResourcePopup] = useState(false);
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [pdfPath, setPdfPath] = useState("");
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [videoId, setVideoId] = useState(null); // Vimeo video ID should be number/string
  const [openedFromResources, setOpenedFromResources] = useState(false);

  const [showAssignmentsPopup, setShowAssignmentsPopup] = useState(false);
  const [assignments, setAssignments] = useState([]);

  // Normalize URL helper
  const normalizeUrl = (url) => {
    if (!url) return "";
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  };

  // Extract Vimeo video ID from URL if possible
  const extractVimeoId = (url) => {
    if (!url) return null;
    // Vimeo URLs formats:
    // https://vimeo.com/123456789 or https://player.vimeo.com/video/123456789
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return match ? match[1] : null;
  };

  // Show PDF from column8
  const handleViewPdfPopup = useCallback(() => {
    setShowPdfViewerModal(true);
    setOpenedFromResources(false);
    setPdfPath(normalizeUrl(row.original.column8));
  }, [row.original.column8]);

  const handlepdfResource = (pdf) => {
    setShowPdfViewerModal(true);
    setShowResourcePopup(false);
    setPdfPath(normalizeUrl(pdf.link));
  };

  const handleClosePopup = () => {
    setShowResourcePopup(false);
  };

  // Load resources async
  const handleViewResourcePopup = async () => {
    setOpenedFromResources(true);
    setShowResourcePopup(true);
    setLoadingResources(true);
    try {
      const resourceList = await fetchWeeklyTimeTableData();
      setResources(resourceList.resources);
    } catch (err) {
      console.error("Failed to fetch resources:", err);
      setResources([]);
    } finally {
      setLoadingResources(false);
    }
  };

  // On clicking a video resource, extract Vimeo ID and open player
  const handleResourceClick = (res) => {
    const vimeoId = extractVimeoId(res.link);
    if (vimeoId) {
      setVideoId(vimeoId);
      setShowVideoPlayer(true);
    } else {
      alert("Invalid Vimeo video link");
    }
  };

  const handlePdfPopUpClose = () => {
    setShowPdfViewerModal(false);
    if (openedFromResources) {
      setShowResourcePopup(true);
    }
  };

  // Parse assignments correctly: line format: "Wk01 WS: 01: https://..."
  const handleViewAssignmentsPopup = () => {
    if (!row.original.column9) {
      setAssignments([]);
      setShowAssignmentsPopup(true);
      return;
    }

    const parsedAssignments = row.original.column9
      .split("\n")
      .map((line) => {
        // Split into parts by colon
        // e.g. ["Wk01 WS", " 01", " https://..."]
        const parts = line.split(":").map((p) => p.trim());

        if (parts.length < 3) return null;

        // Join first two parts as name: "Wk01 WS: 01"
        const name = parts.slice(0, 2).join(":");
        const link = parts.slice(2).join(":");

        const isUrl = /^https?:\/\//i.test(link);

        return {
          name,
          link: isUrl ? link : null,
          rawText: line,
        };
      })
      .filter(Boolean);

    setAssignments(parsedAssignments);
    setShowAssignmentsPopup(true);
  };

  // View assignment PDF by link
  const handleAssignmentView = (link) => {
    setPdfPath(normalizeUrl(link));
    setShowAssignmentsPopup(false);
    setShowPdfViewerModal(true);
  };

  return (
    <>
      {/* Expand Button */}
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
                row.getIsExpanded() && "rotate-180",
              )}
            />
          </Button>
        )}

        {/* Actions Menu */}
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
            className="dark:border-dark-500 dark:bg-dark-750 absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg ltr:right-0 rtl:left-0"
          >
            {/* Lesson Plan */}
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={handleViewPdfPopup}
                  className={clsx(
                    "flex h-9 w-full items-center space-x-3 px-3",
                    active && "dark:bg-dark-600 bg-gray-100",
                  )}
                >
                  <EyeIcon className="size-4.5 stroke-1" />
                  <span>Lesson Plan</span>
                </button>
              )}
            </MenuItem>

            {/* Resources */}
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={handleViewResourcePopup}
                  className={clsx(
                    "flex h-9 w-full items-center space-x-3 px-3",
                    active && "dark:bg-dark-600 bg-gray-100",
                  )}
                >
                  <LinkIcon className="size-4.5 stroke-1" />
                  <span>Resources</span>
                </button>
              )}
            </MenuItem>

            {/* Assignments */}
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={handleViewAssignmentsPopup}
                  className={clsx(
                    "flex h-9 w-full items-center space-x-3 px-3",
                    active && "dark:bg-dark-600 bg-gray-100",
                  )}
                >
                  <LinkIcon className="size-4.5 stroke-1" />
                  <span>Assignments</span>
                </button>
              )}
            </MenuItem>
          </Transition>
        </Menu>
      </div>

      {/* PDF Viewer Modal */}
      {showPdfViewerModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="relative w-full max-w-3xl rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">PDF View</h2>
              <button
                onClick={handlePdfPopUpClose}
                className="text-xl font-bold text-red-500"
                aria-label="Close PDF viewer"
              >
                &times;
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto rounded border">
              <iframe
                src={pdfPath}
                className="h-[70vh] w-full"
                title="PDF Viewer"
                sandbox="allow-scripts allow-same-origin"
                frameBorder="0"
              />
            </div>
          </div>
        </div>
      )}

      {/* Resources Modal */}
      {showResourcePopup && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Resources</h2>

            {loadingResources ? (
              <p>Loading...</p>
            ) : resources ? (
              <table className="w-full table-fixed border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="w-1/2 border-b p-2 text-center align-middle">
                      PDF Resources
                    </th>
                    <th className="w-1/2 border-b p-2 text-center align-middle">
                      Video Resources
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const pdfResources = resources.anx || [];
                    const mp4Resources = resources.mp4 || [];
                    const maxLength = Math.max(
                      pdfResources.length,
                      mp4Resources.length,
                    );

                    return Array.from({ length: maxLength }).map((_, index) => {
                      const pdf = pdfResources[index];
                      const video = mp4Resources[index];

                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border-b p-2 text-center align-middle break-words">
                            {pdf ? (
                              <button
                                onClick={() => handlepdfResource(pdf)}
                                className="block max-w-full truncate text-blue-600 underline"
                                title={pdf.name}
                              >
                                {pdf.name}
                              </button>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="border-b p-2 text-center align-middle break-words">
                            {video ? (
                              <button
                                onClick={() => handleResourceClick(video)}
                                className="block max-w-full truncate text-blue-600 underline"
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
              className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
              onClick={handleClosePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Assignments Modal */}
      {showAssignmentsPopup && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm">
          <div className="relative w-full max-w-4xl overflow-auto rounded-lg bg-white p-6 shadow-lg max-h-[80vh]">
            <h2 className="mb-4 text-lg font-semibold">Assignments</h2>

            {assignments.length === 0 ? (
              <p>No assignments found.</p>
            ) : (
              <table className="w-full border table-fixed">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Worksheet Name</th>
                    <th className="border p-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(({ name, link, rawText }, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border p-2 break-words">{name}</td>
                      <td className="border p-2 text-center">
                        {link ? (
                          <button
                            className="text-blue-600 underline"
                            onClick={() => handleAssignmentView(link)}
                          >
                            View
                          </button>
                        ) : (
                          <span>{rawText}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <button
              className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
              onClick={() => setShowAssignmentsPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Vimeo Video Player */}
      {showVideoPlayer && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="relative w-full max-w-3xl rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Video Player</h2>
              <button
                onClick={() => setShowVideoPlayer(false)}
                className="text-xl font-bold text-red-500"
                aria-label="Close video player"
              >
                &times;
              </button>
            </div>
            <div className="aspect-video w-full overflow-hidden rounded border">
              <Vimeo video={videoId} width="100%" height="100%" responsive autoplay />
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
