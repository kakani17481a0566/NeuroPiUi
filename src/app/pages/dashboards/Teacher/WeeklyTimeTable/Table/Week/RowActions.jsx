import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  EyeIcon,
  LinkIcon,
  DocumentIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

import {
  ChevronUpIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

import clsx from "clsx";
import { useCallback, useState } from "react";
// import {useNavigate} from 'react-router-dom';
import PropTypes from "prop-types";
import Vimeo from "@u-wave/react-vimeo";

import { Button } from "components/ui";
import { fetchWeeklyTimeTableData } from "./data";
// import Attendance from "app/pages/dashboards/Teacher/WeeklyTimeTable/Table/Attendance";
import Grades from "app/pages/tables/Grades";
import Att from "app/pages/tables/Att";

export function RowActions({ row }) {
  const [showPdfViewerModal, setShowPdfViewerModal] = useState(false);
  const [showResourcePopup, setShowResourcePopup] = useState(false);
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [pdfPath, setPdfPath] = useState("");
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [linkId, setlinkId] = useState("");
  const [openedFromResources, setOpenedFromResources] = useState(false);
  const [openedFromAssignments, setOpenedFromAssignments] = useState(false);
  const [studentAttendancePopUp, setStudentAttendancePopUp] = useState(false);
  const [showWorkShopPopup, setShowWorkShopPopup] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [showAssignmentsPopUp, setShowAssignmentsPopUp] = useState(false);

  const normalizeUrl = (url) => {
    if (!url) return "";
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  };

  const handleViewPdfPopup = useCallback(() => {
    setShowPdfViewerModal(true);
    setOpenedFromResources(false);
    setOpenedFromAssignments(false);
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
  //  const navigate = useNavigate();

  const handleViewResourcePopup = async () => {
    setOpenedFromResources(true);
    setShowResourcePopup(true);
    setLoadingResources(true);
    setOpenedFromAssignments(false);
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

  const handleResourceClick = (res) => {
    setlinkId(res.link);
    setShowVideoPlayer(true);
  };

  const handleViewAttendancePopup = () => {
    setStudentAttendancePopUp(true);
  };
  const handleAssignMarks = () => {
    console.log(row);
    setShowAssignmentsPopUp(true);
  };

  const handlePdfPopUpClose = () => {
    setShowPdfViewerModal(false);
    if (openedFromResources) setShowResourcePopup(true);
    if (openedFromAssignments) setShowWorkShopPopup(true);
  };

  const handleAssignmentView = (link) => {
    setPdfPath(normalizeUrl(link));
    setShowWorkShopPopup(false);
    setShowPdfViewerModal(true);
  };

  const handleViewWorkSheetPopUp = () => {
    if (!row.original.column9) {
      setAssignments([]);
      setShowWorkShopPopup(true);
      setOpenedFromAssignments(true);
      setShowResourcePopup(false);
      return;
    }

    const parsedAssignments = row.original.column9
      .split("\n")
      .map((link, index) => {
        const cleanLink = link.trim();
        if (!cleanLink || !/^https?:\/\//i.test(cleanLink)) return null;

        return {
          name: `Worksheet ${index + 1}`,
          link: cleanLink,
          rawText: cleanLink,
        };
      })
      .filter(Boolean);

    setAssignments(parsedAssignments);
    setShowWorkShopPopup(true);
    setOpenedFromAssignments(true);
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
                row.getIsExpanded() && "rotate-180",
              )}
            />
          </Button>
        )}

        <Menu
          as="div"
          className="text-col relative z-20 inline-block text-left"
        >
          <MenuButton
            as={Button}
            variant="flat"
            isIcon
            className="size-7 touch-manipulation rounded-full"
            onMouseDown={(e) => e.preventDefault()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
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
            className="dark:border-dark-500 dark:bg-dark-100 absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg ltr:right-0 rtl:left-0"
          >
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={handleViewPdfPopup}
                  className={clsx(
                    "flex h-9 w-full items-center space-x-3 px-3",
                    active && "bg-gray-100 dark:bg-purple-50",
                  )}
                >
                  <EyeIcon className="text-primary-600 size-4.5 stroke-[1.5]" />

                  <span className="text-primary-950">Lesson Plan</span>
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={handleViewResourcePopup}
                  className={clsx(
                    "flex h-9 w-full items-center space-x-3 px-3",
                    active && "bg-gray-100 dark:bg-purple-50",
                  )}
                >
                  <LinkIcon className="text-primary-600 size-4.5 stroke-[1.5]" />

                  <span className="text-primary-950">Resources</span>
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={handleViewWorkSheetPopUp}
                  className={clsx(
                    "flex h-9 w-full items-center space-x-3 px-3",
                    active && "bg-gray-100 dark:bg-purple-50",
                  )}
                >
                  <DocumentIcon className="text-primary-600 size-4.5 stroke-[1.5]" />

                  <span className="text-primary-950">WorkSheets</span>
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={handleViewAttendancePopup}
                  className={clsx(
                    "flex h-9 w-full items-center space-x-3 px-3",
                    active && "bg-gray-100 dark:bg-purple-50",
                  )}
                >
                  <UserGroupIcon className="text-primary-600 size-4.5 stroke-[1.5]" />
                  <span className="text-primary-950">Attendance</span>
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={handleAssignMarks}
                  className={clsx(
                    "flex h-9 w-full items-center space-x-3 px-3",
                    active && "bg-gray-100 dark:bg-purple-50",
                  )}
                >
                  <ClipboardDocumentListIcon className="text-primary-600 size-4.5 stroke-[1.5]" />

                  <span className="text-primary-950">Assignment</span>
                </button>
              )}
            </MenuItem>
          </Transition>
        </Menu>
      </div>

      {/* Modals: PDF Viewer, Resources, Assignments, Video, Attendance */}
      {showPdfViewerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-primary-950 text-lg font-semibold">
                PDF View
              </h2>
              <button
                onClick={handlePdfPopUpClose}
                className="text-primary-600 text-xl font-bold"
                aria-label="Close"
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

      {showResourcePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl overflow-auto rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-primary-950 mb-4 text-lg font-semibold">
              Resources
            </h2>
            {loadingResources ? (
              <p>Loading...</p>
            ) : (
              <table className="w-full table-fixed border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-primary-950 w-1/2 border-b p-2">PDF</th>
                    <th className="text-primary-950 w-1/2 border-b p-2">
                      Video
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const pdf = resources.anx || [];
                    const mp4 = resources.mp4 || [];
                    const len = Math.max(pdf.length, mp4.length);
                    return Array.from({ length: len }).map((_, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="border-b p-2 text-center">
                          {pdf[i] ? (
                            <button
                              onClick={() => handlepdfResource(pdf[i])}
                              className="text-primary-950 underline"
                            >
                              {pdf[i].name}
                            </button>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="border-b p-2 text-center">
                          {mp4[i] ? (
                            <button
                              onClick={() => handleResourceClick(mp4[i])}
                              className="text-primary-950 underline"
                            >
                              {mp4[i].name}
                            </button>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            )}
            <button
              className="bg-primary-600 mt-4 rounded px-4 py-2 text-white"
              onClick={handleClosePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showWorkShopPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative max-h-[80vh] w-full max-w-4xl overflow-auto rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Assignments</h2>
            {assignments.length === 0 ? (
              <p>No assignments found.</p>
            ) : (
              <table className="w-full table-fixed border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Name</th>
                    <th className="border p-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(({ name, link, rawText }, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border p-2">{name}</td>
                      <td className="border p-2 text-center">
                        {link ? (
                          <button onClick={() => handleAssignmentView(link)}>
                            View
                          </button>
                        ) : (
                          rawText
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button
              className="bg-primary-600 text-primary-950 mt-4 rounded px-4 py-2"
              onClick={() => setShowWorkShopPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showVideoPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-purple-950">Video</h2>
              <button
                onClick={() => setShowVideoPlayer(false)}
                className="text-primary-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="aspect-video w-full overflow-hidden rounded border">
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

      {studentAttendancePopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-primary-950 dark:text-primary-950 text-lg font-semibold">
                Attendance
              </h2>
              <button
                onClick={() => setStudentAttendancePopUp(false)}
                className="text-primary-600 text-xl font-bold hover:text-red-600"
                aria-label="Close Attendance Modal"
              >
                &times;
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto rounded border">
              <Att />
            </div>
          </div>
        </div>
      )}
      {showAssignmentsPopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-primary-950 text-lg font-semibold">
                Assignments
              </h2>
              <button
                onClick={() => setShowAssignmentsPopUp(false)}
                className="text-primary-600 text-xl font-bold hover:text-red-600"
                aria-label="Close Assignments Modal"
              >
                &times;
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto rounded border">
              <Grades
                timeTableId={row.original.timeTableId}
                assessmentStatusCode={row.original.assessmentStausCodeId}
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
