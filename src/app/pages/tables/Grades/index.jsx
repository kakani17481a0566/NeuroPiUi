// Import Dependencies
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState, useEffect } from "react";
import {
  useLockScrollbar,
  useLocalStorage,
  useDidUpdate,
} from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useSkipper } from "utils/react-table/useSkipper";
import axios from "axios";
import { fetchGradesList } from "./GradesList";
// import RowActions from "./RowActions";
import { Spinner } from "components/ui";

export default function Grades() {
  const [autoResetPageIndex] = useSkipper();
  const [columns, setColumns] = useState([]);
  const [StudentsList, setStudentsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gradesList, setGradesList] = useState([]);
  const [buttons,setButtons]=useState([]);


  const [tableSettings] = useState({
    enableSorting: true,
    enableColumnFilters: true,
    enableFullScreen: false,
    enableRowDense: false,
  });

  useEffect(() => {
    const fetchGrades = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/AssessmentMatrix/timetable/2/tenant/1/course/1/branch/1"
        );
        const fetchedHeaders = response.data?.data?.headers || [];
        const fetchedRows = response.data?.data?.rows || [];
        const fetchAssessmentStatusCode=response.data?.assessmentStatusCode ||[];
        setColumns(fetchedHeaders);
        setButtons(fetchAssessmentStatusCode)
        setStudentsList(fetchedRows);
        const grades= await fetchGradesList();
        setGradesList(grades);

      } catch (err) {
        console.error("Failed to fetch:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrades();
    fetchGradesList();
  }, []);

 const renderCell = (row, header) => {
  // if (header === "S.NO.") return row.sNo;
  // if (header === "S.NO.") return row.serialNumber;

  if (header === "Student Name") return row.studentName;
  

  const assessmentGradeObj = row.assessmentGrades?.[header];

  const grade = assessmentGradeObj?.gradeName || "";

  return (
    <select
      value={grade}
      className={`w-full border px-2 py-1 rounded text-sm cursor-not-allowed ${
        grade.name === "A+" ? "bg-green-200" :
        grade === "A" ? "bg-yellow-200" :
        grade === "B" ? "bg-red-200" :
        grade === "Fair" ? "bg-orange-200" :
        grade === "Poor" ? "bg-pink-300" :
        "bg-gray-100" 
      }`}
    >
     
      <option value="">{grade ? grade : "N/A"}</option> 
      
      {gradesList.map((g) => (
        <option key={g.id} value={g.name}>
          {g.name}
        </option>
      ))}
    </select>
  );
};


  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "column-visibility-orders-2",
    {}
  );
  const [columnPinning, setColumnPinning] = useLocalStorage(
    "column-pinning-orders-2",
    {}
  );

  const table = useReactTable({
    data: StudentsList,
    columns: columns,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      columnPinning,
      tableSettings,
      pagination,
    },
    filterFns: { fuzzy: fuzzyFilter },
    enableSorting: tableSettings.enableSorting,
    enableColumnFilters: tableSettings.enableColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    autoResetPageIndex,
  });

  useDidUpdate(() => table.resetRowSelection(), [StudentsList]);
  useLockScrollbar(tableSettings.enableFullScreen);
  console.log(gradesList);

  return (
    <div className="overflow-auto">
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner color="primary" className="size-16 border-4" />
        </div>
      ) : (
        <>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                {columns.map((header) => (
                  <th
                    key={header}
                    className="border px-4 py-2 text-left text-sm font-semibold"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4">
                    No data available.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(({ original: row }, index) => (
                  <tr key={row.studentId || index} className="hover:bg-gray-50">
                    {columns.map((header) => (
                      <td key={header} className="border px-4 py-2 text-sm">
                        {renderCell(row, header)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4 px-4">
            <div className="text-sm text-gray-700">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
              {buttons.map((button)=>(
              <button 
              key={button.id}
              onClick={button.onClick}
              className={`px-4 py-2 text-white rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 ${button.style}`}
              >{button.label}</button>
             ))
             }
            </div>
          </div>
        </>
      )}
    </div>
  );
}
