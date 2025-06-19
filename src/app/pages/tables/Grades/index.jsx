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
import { useState } from "react";
import {
  // useBoxSize,
  useLockScrollbar,
  useLocalStorage,
  useDidUpdate,
} from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useSkipper } from "utils/react-table/useSkipper";
import { useEffect } from "react";
import axios from "axios";
// Imports
import RowActions from "./RowActions";
// import SearchBar from "./SearchBar";
import { Spinner } from "components/ui";

// ----------------------------------------------------------------------


export default function Grades() {


  const [autoResetPageIndex] = useSkipper();

  // const [orders, setOrders] = useState([...ordersList]);
  const [columns, setColumns] = useState([]);
  const [StudentsList, setStudentsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);



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
        const response = await axios.get("https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/DailyAssessment/get-matrix?tenantId=1&courseId=1&branchId=1&timeTableId=2");

        // const json = await response.json();

        const fetchedHeaders = response.data?.data?.headers || [];

        const fetchedRows = response.data?.data?.rows || [];
        setColumns([...fetchedHeaders, "Actions"]);
        setStudentsList(fetchedRows);
        console.log(fetchedRows);
      } catch (err) {
        console.error("Failed to fetch:", err);
      }
      finally {
        setIsLoading(false);
      }
    };

    fetchGrades();
  }, []);
  const renderCell = (row, header) => {
    if (header === "S.NO.") return row.sNo;
    if (header === "NAME OF THE STUDENT") return row.name;
    if (header === "Actions") return <RowActions row={row} />;
    return row.grades?.[header] ?? "-";
  };
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20, // Show 10 per page (you can change this to 13 or any value)
  });


  const [globalFilter, setGlobalFilter] = useState("");

  const [sorting, setSorting] = useState([]);

  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "column-visibility-orders-2",
    {},
  );

  const [columnPinning, setColumnPinning] = useLocalStorage(
    "column-pinning-orders-2",
    {},
  );

  // const cardRef = useRef();

  // const { width: cardWidth } = useBoxSize({ ref: cardRef });

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
    // meta: {
    //   setTableSettings,
    //   deleteRow: (row) => {
    //     // Skip page index reset until after next rerender
    //     skipAutoResetPageIndex();
    //     setStudentsList((old) =>
    //       old.filter((oldRow) => oldRow.order_id !== row.original.order_id),
    //     );
    //   },

    // },

    filterFns: {
      fuzzy: fuzzyFilter,
    },
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
    // getPaginationRowModel: getPaginationRowModel(),

    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,

    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,

    autoResetPageIndex,
  });

  useDidUpdate(() => table.resetRowSelection(), [StudentsList]);

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <div className="overflow-auto">
      {/* <SearchBar value={globalFilter} onChange={setGlobalFilter} /> */}

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
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
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
            </div>
          </div>

        </>
      )}
    </div>
  );
}
