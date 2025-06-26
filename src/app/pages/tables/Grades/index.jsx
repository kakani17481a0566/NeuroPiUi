import {
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "components/ui";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useLockScrollbar, useLocalStorage, useDidUpdate } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import axios from "axios";
import { fetchGradesList } from "./GradesList";

import {
  Spinner,
  Table,
  THead,
  TBody,
  Th,
  Tr,
  Td,
  Avatar,
} from "components/ui";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { BASE_URL } from "constants/apis";

export default function Grades({ timeTableId, assessmentStatusCode }) {
  const [students, setStudents] = useState([]);
  const [originalStudents, setOriginalStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gradesList, setGradesList] = useState([]);
  const [setStatusButtons] = useState([]);
  const [setError] = useState(null);
  const [assessmentIdMap, setAssessmentIdMap] = useState({});
  const [isInProgress, setIsInProgress] = useState(false);
  const [gradeId, setGradeId] = useState(0);
  const [gradeName, setGradeName] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const tenantId = 1;
  const branchId = 1;
  // const timeTableId = 4;
  const conductedById = 1;
  console.log(assessmentStatusCode, timeTableId);

  const handleSave = async () => {
    try {
      const originalMap = Object.fromEntries(
        originalStudents.map((s) => [s.studentId, s]),
      );
      setAlertMessage("");

      const changedStudents = students
        .map((student) => {
          const original = originalMap[student.studentId];
          const changedGrades = Object.entries(student.assessmentGrades)
            .filter(
              ([key, grade]) =>
                grade.gradeId !== original?.assessmentGrades?.[key]?.gradeId,
            )
            .map(([key, grade]) => ({
              assessmentId: assessmentIdMap[key],
              gradeId: grade.gradeId,
            }));

          if (!changedGrades.length) return null;

          return {
            studentId: student.studentId,
            grades: changedGrades,
          };
        })
        .filter(Boolean);
      alert;
      if (!changedStudents.length)
        return toast.error("Nothing to be saved ", {
          className: "soft-color",
        });

      const payload = {
        timeTableId,
        tenantId,
        branchId,
        conductedById,
        students: changedStudents,
      };

      ///AssessmentMatrix/timetable/2/tenant/1/course/1/branch/1

      setIsLoading(true);
      await axios.post(
        "https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/DailyAssessment/save-matrix",
        payload,
      );
      toast.success("Grades saved successfully!", {
        className: "soft-color",
      });

      setOriginalStudents(JSON.parse(JSON.stringify(students)));
    } catch (err) {
      console.error("Save failed", err);
      toast.error("Save failed. Please try again. ", {
        className: "soft-color",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStyle = useCallback((status) => {
    const colorMap = {
      NOTSTARTED: "bg-gray-500",
      INPROGRESS: "bg-yellow-500",
      PENDING: "bg-orange-500",
      COMPLETED: "bg-green-600",
    };
    const key = status.toUpperCase().replace(/[\s_-]/g, "");
    return colorMap[key] || "bg-blue-500";
  }, []);

  const getGradeColorStyle = useCallback((grade) => {
    const map = {
      "A+": "bg-green-200",
      A: "bg-emerald-200",
      B: "bg-blue-200",
      C: "bg-yellow-200",
      "Marks Not Added": "bg-orange-200",
      Poor: "bg-pink-200",
      Fair: "bg-red-300",
      "Not Graded": "bg-gray-200",
    };
    return map[grade] || "bg-white";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [{ data }, grades] = await Promise.all([
          axios.get(
            `${BASE_URL}/AssessmentMatrix/timetable/${timeTableId}/tenant/${tenantId}/course/1/branch/1`,
          ),
          fetchGradesList(),
        ]);

        const rawStatusList = data?.data?.assessmentStatusCode || [];
        setGradeId(data.data.currentStatusId);
        setGradeName(data.data.currentStatusName);
        const normalizedStatusList = rawStatusList.map((s) =>
          (s.name || "").toUpperCase().replace(/[\s_-]/g, ""),
        );

        setIsInProgress(normalizedStatusList.includes("INPROGRESS"));
        setAssessmentIdMap(data?.data?.headerSkillMap || {});
        setGradesList(grades);
        setStudents(data?.data?.rows || []);
        setOriginalStudents(JSON.parse(JSON.stringify(data?.data?.rows || [])));

        setStatusButtons(
          rawStatusList.map((s) => {
            const normalized = (s.name || "")
              .toUpperCase()
              .replace(/[\s_-]/g, "");
            return {
              ...s,
              style: getStatusStyle(normalized),
              onClick:
                normalized === "INPROGRESS"
                  ? handleSave
                  : () => alert(`Clicked: ${s.name}`),
            };
          }),
        );
      } catch (err) {
        console.error("Failed to fetch data", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tenantId, branchId, timeTableId, getStatusStyle]);

  const handleGradeChange = useCallback(
    (studentId, header, newGradeName) => {
      const gradeObj = gradesList.find(
        (g) => g.name.trim() === newGradeName.trim(),
      );
      const gradeId = gradeObj?.id ?? 0;

      setStudents((prev) =>
        prev.map((student) =>
          student.studentId === studentId
            ? {
                ...student,
                assessmentGrades: {
                  ...student.assessmentGrades,
                  [header]: {
                    ...student.assessmentGrades?.[header],
                    gradeId,
                    gradeName: newGradeName,
                  },
                },
              }
            : student,
        ),
      );
    },
    [gradesList],
  );

  const renderGradeCell = useCallback(
    (row, header) => {
      const grade = (
        row.assessmentGrades?.[header]?.gradeName || "Not Graded"
      ).trim();
      const bgColor = getGradeColorStyle(grade);
      // const isCompleted = assessmentStatusCode === gradeId && gradeName === "COMPLETED";
      if (
        isCompleted ||
        (assessmentStatusCode === gradeId && gradeName === "COMPLETED")
      ) {
        // Show only grade text
        return (
          <div
            className={`w-full rounded-md border border-gray-300 px-1 py-1 text-sm ${bgColor} dark:bg-dark-700 dark:text-white`}
          >
            {grade}
          </div>
        );
      }

      return (
        <div className="relative z-50">
          <select
            value={grade}
            onChange={(e) =>
              handleGradeChange(row.studentId, header, e.target.value)
            }
            className={`relative z-50 w-full rounded-md border border-gray-300 px-1 py-1 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none ${bgColor} dark:bg-dark-700 dark:text-white`}
          >
            <option value="">Not Graded</option>
            {gradesList.map((g) => (
              <option key={g.id} value={g.name?.trim()}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      );
    },
    [gradesList, handleGradeChange, getGradeColorStyle],
  );

  const columns = useMemo(() => {
    if (!students.length) return [];
    const assessmentHeaders = Object.keys(students[0].assessmentGrades || {});

    const studentColumn = {
      accessorKey: "studentName",
      header: "Student Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Avatar src="https://res.cloudinary.com/kakani7/image/upload/v1750826264/MSI/wgs9xojgcs44xhupfh2f.png" />
          <span className="dark:text-dark-100 font-medium text-gray-800">
            {row.original.studentName}
          </span>
        </div>
      ),
    };

    const assessmentColumns = assessmentHeaders.map((header) => ({
      id: header,
      accessorFn: (row) =>
        row.assessmentGrades?.[header]?.gradeName ?? "Not Graded",
      header,
      cell: ({ row }) => renderGradeCell(row.original, header),
    }));

    return [studentColumn, ...assessmentColumns];
  }, [students, renderGradeCell]);

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "column-visibility-grades",
    {},
  );
  const [columnPinning, setColumnPinning] = useLocalStorage(
    "column-pinning-grades",
    {},
  );

  const table = useReactTable({
    data: students,
    columns,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      columnPinning,
      pagination,
    },
    filterFns: { fuzzy: fuzzyFilter },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    autoResetPageIndex: false,
  });

  useDidUpdate(() => table.resetRowSelection(), [students]);
  useLockScrollbar(false);

  const handleCompleted = async () => {
    const invalidStudents = students.filter((student) => {
      return Object.values(student.assessmentGrades || {}).some((gradeObj) => {
        const grade = (gradeObj?.gradeName || "").trim();
        return grade === "Not Graded" || grade === "Marks Not Added";
      });
    });

    if (invalidStudents.length > 0) {
      const names = invalidStudents.map((s) => s.studentName).join(", ");
      setAlertMessage(`The following students have ungraded assessments: ${names}\n`);
      return;
    }
    try {
      await handleSave();
      setIsCompleted(true);
      setAlertMessage("");
      //  alert("All students graded. You can now mark this as COMPLETED.");
    } catch (err) {
      setAlertMessage("something went wrong", err);
    }
  };

  return (
    <div className="overflow-visible p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Assessment Grades
        </h2>
        <div className="flex flex-wrap items-center gap-2 px-2">
          <Button
            color="error"
            className="px-2 py-1 text-xs"
            onClick={() => {
              setStudents(JSON.parse(JSON.stringify(originalStudents)));
              toast.info("Local changes discarded", {
                className: "soft-color",
              });
            }}
          >
            CANCEL
          </Button>

          <Button
            color="warning"
            className="px-2 py-1 text-xs"
            onClick={handleSave}
          >
            IN-PROGRESS
          </Button>
          <Button
            color="success"
            className="px-2 py-1 text-xs"
            onClick={handleCompleted}
          >
            COMPLETED
          </Button>
        </div>
      </div>
      {alertMessage && (
        <div
          role="alert"
          className="mb-4 flex items-center space-x-3 rounded-lg bg-yellow-500 px-4 py-4 text-white sm:px-5 max-w-full break-words overflow-hidden"
        >
          <ExclamationCircleIcon className="size-7 mt-1 shrink-0" />
          <span className="flex-1 break-all whitespace-pre-line">{alertMessage}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner color="primary" className="size-14 border-4" />
        </div>
      ) : (
        <>
          <div className="hide-scrollbar min-w-full overflow-x-auto">
            <Table hoverable className="w-full text-left rtl:text-right">
              <THead>
                <Tr>
                  {table.getHeaderGroups()[0].headers.map((header) => (
                    <Th
                      key={header.id}
                      className="dark:bg-dark-800 dark:text-dark-100 bg-gray-200 text-gray-800 uppercase"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </Th>
                  ))}
                </Tr>
              </THead>
              <TBody>
                {table.getRowModel().rows.length === 0 ? (
                  <Tr>
                    <Td
                      colSpan={columns.length}
                      className="py-4 text-center dark:text-white"
                    >
                      No students found
                    </Td>
                  </Tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <Tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <Td key={cell.id} className="px-2 py-2 dark:text-white">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </Td>
                      ))}
                    </Tr>
                  ))
                )}
              </TBody>
            </Table>
          </div>

          <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Showing {table.getRowModel().rows.length} of {students.length}{" "}
              students
            </span>

            <div className="flex flex-wrap items-center gap-2">
              {isInProgress && (
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  // className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-50"
                >
                  {/* {isLoading ? "Saving..." : "Save"} */}
                </button>
              )}

              <div className="ml-4 flex items-center gap-2">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="rounded bg-gray-100 p-2 text-gray-700"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <span className="text-sm text-gray-800">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </span>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="rounded bg-gray-100 p-2 text-gray-700"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
