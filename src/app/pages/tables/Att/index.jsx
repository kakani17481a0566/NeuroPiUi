import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Fragment, useEffect, useRef, useState, useMemo, useCallback } from "react";
import clsx from "clsx";

import { fetchAttendanceSummary } from "./data";
import { generateAttendanceColumns } from "./columns";
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { ColumnFilter } from "components/shared/table/ColumnFilter";
import { Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { SelectedRowsActions } from "./SelectedRowsActions";
import { Toolbar } from "./Toolbar";
import { AttendanceHeaderBox } from "./VerticalWithoutText";

import { useLockScrollbar, useLocalStorage, useDidUpdate } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { getSessionData } from "utils/sessionStorage";
// import { useThemeContext } from "app/contexts/theme/context";

function SubRowComponent({ row }) {
  const { parentName, mobileNumber, alternateNumber } = row.original;
  return (
    <div className="p-4 text-sm space-y-1">
      <p><strong>Parent:</strong> {parentName}</p>
      <p><strong>Mobile:</strong> {mobileNumber}</p>
      <p><strong>Alternate:</strong> {alternateNumber}</p>
    </div>
  );
}

export default function AttendanceTable() {
  // const { cardSkin } = useThemeContext();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const { tenantId } = getSessionData();

  const [columnVisibility, setColumnVisibility] = useLocalStorage("column-visibility-attendance", {});
  const [columnPinning, setColumnPinning] = useLocalStorage("column-pinning-attendance", {});
  const [tableSettings, setTableSettings] = useState({
    enableSorting: true,
    enableColumnFilters: true,
    enableFullScreen: false,
    enableRowDense: true,
  });

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const formattedDate = useMemo(() => new Date(today).toLocaleDateString("en-GB"), [today]);
  const className = useMemo(() => data[0]?.className || "-", [data]);
  const checkedInCount = useMemo(() => data.filter(d => d.attendanceStatus === "Checked-In").length, [data]);
  const checkedOutCount = useMemo(() => data.filter(d => d.attendanceStatus === "Checked-Out").length, [data]);

  const cardRef = useRef();

  const fetchData = useCallback(async () => {
    if (!tenantId) return;

    try {
      const response = await fetchAttendanceSummary({ date: today, tenantId });

      setData(response.data);

      const allowedHeaders = ["studentId", "studentName", "attendanceStatus"];
      const filteredHeaders = response.headers.filter((h) => allowedHeaders.includes(h));
      setColumns(generateAttendanceColumns(filteredHeaders));
    } catch (err) {
      console.error("❌ Failed to fetch attendance data", err);
    }
  }, [today, tenantId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
      pagination,
      columnVisibility,
      columnPinning,
      tableSettings,
    },
    onPaginationChange: setPagination,
    meta: { setTableSettings, fetchData },
    filterFns: { fuzzy: fuzzyFilter },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableSorting: tableSettings.enableSorting,
    enableColumnFilters: tableSettings.enableColumnFilters,
    enableRowSelection: true,
    getRowCanSelect: (row) => {
      const { fromTime, toTime } = row.original;
      return !(fromTime && fromTime !== "Not marked" && toTime && toTime !== "Not marked");
    },
    getRowCanExpand: () => true,
    autoResetPageIndex: false,
  });

  useDidUpdate(() => table.resetRowSelection(), [data]);
  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <div className="col-span-12">
      <AttendanceHeaderBox
        date={formattedDate}
        className={className}
        checkedIn={checkedInCount}
        checkedOut={checkedOutCount}
      />

      <div
        className={clsx(
          "flex flex-col",
          tableSettings.enableFullScreen && "fixed inset-0 z-61 pt-3 bg-white dark:bg-dark-900"
        )}
      >
        <Toolbar table={table} />

        <Card
          className={clsx(
            "relative mt-3 flex grow flex-col",
            tableSettings.enableFullScreen ? "overflow-hidden" : "overflow-visible"
          )}
          ref={cardRef}
        >
          <div className="relative w-full overflow-x-auto">
            <div className="min-w-[720px] md:min-w-full">
              <Table
                hoverable
                dense={tableSettings.enableRowDense}
                sticky={tableSettings.enableFullScreen}
                className="w-full text-left rtl:text-right text-xs sm:text-sm md:text-base"
              >
                <THead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <Th key={header.id}>
                          {header.column.getCanSort() ? (
                            <div
                              className="flex cursor-pointer items-center space-x-3"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <span>
                                {flexRender(header.column.columnDef.header, header.getContext())}
                              </span>
                              <TableSortIcon sorted={header.column.getIsSorted()} />
                            </div>
                          ) : (
                            flexRender(header.column.columnDef.header, header.getContext())
                          )}
                          {header.column.getCanFilter() && <ColumnFilter column={header.column} />}
                        </Th>
                      ))}
                    </Tr>
                  ))}
                </THead>
                <TBody>
                  {table.getRowModel().rows.length === 0 ? (
                    <Tr>
                      <Td colSpan={columns.length} className="text-center py-6 text-gray-500 dark:text-dark-300">
                        No attendance records found.
                      </Td>
                    </Tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <Fragment key={row.id}>
                        <Tr>
                          {row.getVisibleCells().map((cell) => (
                            <Td key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </Td>
                          ))}
                        </Tr>
                        {row.getIsExpanded() && (
                          <tr>
                            <td colSpan={row.getVisibleCells().length}>
                              <SubRowComponent row={row} />
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))
                  )}
                </TBody>
              </Table>
            </div>
          </div>

          <SelectedRowsActions table={table} />

          <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 px-4 pb-4 mt-4">
            <div className="text-sm text-gray-600 dark:text-dark-300">
              Showing{" "}
              {table.getRowModel().rows.length > 0
                ? `${pagination.pageIndex * pagination.pageSize + 1} - ${
                    pagination.pageIndex * pagination.pageSize + table.getRowModel().rows.length
                  }`
                : "0"}{" "}
              of {table.getCoreRowModel().rows.length} entries
            </div>
<div className="w-full flex flex-col sm:flex-row items-center sm:justify-end gap-2 sm:gap-3">
  <button
    onClick={() => table.previousPage()}
    disabled={!table.getCanPreviousPage()}
    className="w-full sm:w-auto px-4 py-2 text-sm rounded bg-neutral-200 dark:bg-dark-700 hover:bg-neutral-300 dark:hover:bg-dark-600 disabled:opacity-50"
  >
    Previous
  </button>
  <button
    onClick={() => table.nextPage()}
    disabled={!table.getCanNextPage()}
    className="w-full sm:w-auto px-4 py-2 text-sm rounded bg-neutral-200 dark:bg-dark-700 hover:bg-neutral-300 dark:hover:bg-dark-600 disabled:opacity-50"
  >
    Next
  </button>
</div>

          </div>
        </Card>
      </div>
    </div>
  );
}
