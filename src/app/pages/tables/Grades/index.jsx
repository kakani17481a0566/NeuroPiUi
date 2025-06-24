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
import { useState, useEffect, useMemo, useCallback } from "react";
import { useLockScrollbar, useLocalStorage, useDidUpdate } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
// import { useSkipper } from "utils/react-table/useSkipper";
import axios from "axios";
import { fetchGradesList } from "./GradesList";
import { Spinner, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import {GET_GRADES_BY_TENANTID_COURSEID_BRANCHID_TIMETABLEID} from 'constants/apis'

export default function Grades() {
  // const [autoResetPageIndex] = useSkipper();
  const [students, setStudents] = useState([]);
  const [originalStudents, setOriginalStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gradesList, setGradesList] = useState([]);
  const [statusButtons, setStatusButtons] = useState([]);
  const [error, setError] = useState(null);

  const getStatusStyle = useCallback((status) => {
    const colorMap = {
      "NOT STARTED":
        "bg-gray-500 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600",
      "IN-PROGRESS":
        "bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500",
      PENDING:
        "bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500",
      COMPLETED:
        "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600",
    };
    return (
      colorMap[status.toUpperCase()] ||
      "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
    );
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
        setError(null);

        const [{ data }, grades] = await Promise.all([
          axios.get(
           GET_GRADES_BY_TENANTID_COURSEID_BRANCHID_TIMETABLEID,
          ),
          fetchGradesList(),
        ]);

        setStatusButtons(
          (data?.data?.assessmentStatusCode || []).map((s) => ({
            ...s,
            style: getStatusStyle(s.name),
            onClick: () => alert(`Clicked: ${s.name}`),
          })),
        );

        setGradesList(grades);
        setStudents(data?.data?.rows || []);
        setOriginalStudents(JSON.parse(JSON.stringify(data?.data?.rows || [])));
      } catch (err) {
        console.error("Failed to fetch data", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getStatusStyle]);

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

      return (
        <div className="relative z-50">
          <select
            value={grade}
            onChange={(e) =>
              handleGradeChange(row.studentId, header, e.target.value)
            }
            className={`dark:border-dark-500 relative z-50 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none ${bgColor} dark:bg-dark-700 dark:text-white`}
          >
            <option value="">Not Graded</option>
            {gradesList.map((g) => (
              <option key={g.id ?? g.name} value={g.name?.trim()}>
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
        <span className="dark:text-dark-100 font-medium text-gray-800">
          {row.original.studentName}
        </span>
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

  const handleSave = async () => {
    try {
      const changedStudents = students.filter((current, i) => {
        const original = originalStudents[i];
        return Object.entries(current.assessmentGrades).some(
          ([key, grade]) =>
            grade.gradeId !== original.assessmentGrades[key]?.gradeId,
        );
      });

      setIsLoading(true);
      await axios.post("/api/save-grades", { students: changedStudents });
      alert("Grades saved successfully!");
    } catch (err) {
      console.error("Failed to save grades", err);
      alert("Save failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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

  if (error) {
    return (
      <div className="rounded-lg bg-red-100 p-4 text-red-600 dark:bg-red-900 dark:text-red-400">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-2 rounded bg-red-600 px-3 py-1 text-white dark:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-visible p-4">
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner color="primary" className="size-16 border-4" />
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
                      className="dark:bg-dark-800 dark:text-dark-100 bg-gray-200 font-semibold text-gray-800 uppercase ltr:first:rounded-l-lg ltr:last:rounded-r-lg rtl:first:rounded-r-lg rtl:last:rounded-l-lg"
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
                    <Tr
                      key={row.id}
                      className="dark:border-b-dark-500 border-y border-transparent border-b-gray-200"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <Td
                          key={cell.id}
                          className="relative px-4 py-2 text-gray-900 dark:text-white"
                        >
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
              {statusButtons.map((btn) => (
                <button
                  key={btn.id}
                  onClick={btn.onClick}
                  className={`rounded px-4 py-2 text-white ${btn.style}`}
                >
                  {btn.name}
                </button>
              ))}

              <button
                onClick={handleSave}
                disabled={isLoading}
                className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-50 dark:bg-green-700 dark:hover:bg-green-600"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>

              <div className="ml-4 flex items-center gap-2">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="dark:bg-dark-700 rounded bg-gray-100 p-2 text-gray-700 disabled:opacity-50 dark:text-white"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>

                <span className="text-sm text-gray-800 dark:text-white">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </span>

                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="dark:bg-dark-700 rounded bg-gray-100 p-2 text-gray-700 disabled:opacity-50 dark:text-white"
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
