// Import Dependencies
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
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";
import { getSessionData } from "utils/sessionStorage";
import { useThemeContext } from "app/contexts/theme/context";

const isSafari = getUserAgentBrowser() === "Safari";

function SubRowComponent({ row }) {
  return (
    <div className="p-4 text-sm text-neutral-700 dark:text-dark-100">
      <strong>Expanded Details:</strong> {JSON.stringify(row.original)}
    </div>
  );
}

export default function AttendanceTable() {
  const { cardSkin } = useThemeContext();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const { branch, tenantId, course } = getSessionData();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [columnVisibility, setColumnVisibility] = useLocalStorage("column-visibility-attendance", {});
  const [columnPinning, setColumnPinning] = useLocalStorage("column-pinning-attendance", {});

  const [tableSettings, setTableSettings] = useState({
    enableSorting: true,
    enableColumnFilters: true,
    enableFullScreen: false,
    enableRowDense: true,
  });

  const today = new Date().toISOString().split("T")[0];
  const formattedDate = new Date(today).toLocaleDateString("en-GB");

  const className = useMemo(() => data[0]?.className || "-", [data]);
  const checkedInCount = useMemo(() => data.filter((d) => d.attendanceStatus === "Checked-In").length, [data]);
  const checkedOutCount = useMemo(() => data.filter((d) => d.attendanceStatus === "Checked-Out").length, [data]);

  const cardRef = useRef();

  const fetchData = useCallback(async () => {
    const currentPage = pagination.pageIndex;

    try {
      const response = await fetchAttendanceSummary({
        date: today,
        tenantId,
        branchId: branch,
        courseId: course[0]?.id,
      });

      setData(response.data);

      const allowedHeaders = ["studentId", "studentName", "attendanceStatus"];
      const filteredHeaders = response.headers.filter((h) => allowedHeaders.includes(h));

      setColumns(generateAttendanceColumns(filteredHeaders));

      setPagination((prev) => ({ ...prev, pageIndex: currentPage }));
    } catch (err) {
      console.error("\u274C Failed to fetch attendance data", err);
    }
  }, [today, tenantId, branch, course, pagination.pageIndex]);

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
        <div className="relative w-full overflow-x-auto touch-auto overflow-y-visible scrollbar-thin scrollbar-thumb-neutral-400 dark:scrollbar-thumb-dark-300">
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
                      <Th
                        key={header.id}
                        className={clsx(
                          "bg-neutral-200 font-semibold uppercase text-neutral-800 dark:bg-dark-800 dark:text-dark-100 px-2 py-2 sm:px-4 sm:py-3",
                          header.column.getCanPin() && [
                            header.column.getIsPinned() === "left" && "sticky ltr:left-0 rtl:right-0 z-2 bg-white dark:bg-dark-900",
                            header.column.getIsPinned() === "right" && "sticky ltr:right-0 rtl:left-0 z-2 bg-white dark:bg-dark-900",
                          ]
                        )}
                      >
                        {header.column.getCanSort() ? (
                          <div
                            className="flex cursor-pointer items-center space-x-3 select-none"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <span className="flex-1">
                              {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                            </span>
                            <TableSortIcon sorted={header.column.getIsSorted()} />
                          </div>
                        ) : header.isPlaceholder ? null : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
                        {header.column.getCanFilter() && <ColumnFilter column={header.column} />}
                      </Th>
                    ))}
                  </Tr>
                ))}
              </THead>
              <TBody>
                {table.getRowModel().rows.map((row) => (
                  <Fragment key={row.id}>
                    <Tr
                      className={clsx(
                        "relative border-y border-b-neutral-200 dark:border-b-dark-500 hover:bg-neutral-100 dark:hover:bg-dark-700 text-sm sm:text-base whitespace-nowrap sm:whitespace-normal",
                        row.getIsSelected() && !isSafari &&
                        "row-selected after:absolute after:inset-0 after:z-2 after:border-3 after:border-transparent after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500"
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <Td
                          key={cell.id}
                          className={clsx(
                            "relative dark:text-white px-2 py-2 sm:px-4 sm:py-3",
                            cardSkin === "shadow-sm" ? "dark:bg-dark-700" : "dark:bg-dark-900",
                            cell.column.getCanPin() && [
                              cell.column.getIsPinned() === "left" && "sticky ltr:left-0 rtl:right-0 z-2 bg-white dark:bg-dark-900",
                              cell.column.getIsPinned() === "right" && "sticky ltr:right-0 rtl:left-0 z-2 bg-white dark:bg-dark-900",
                            ]
                          )}
                        >
                          {cell.column.getIsPinned() && (
                            <div
                              className={clsx(
                                "pointer-events-none absolute inset-0 border-neutral-200 dark:border-dark-500",
                                cell.column.getIsPinned() === "left"
                                  ? "ltr:border-r rtl:border-l"
                                  : "ltr:border-l rtl:border-r"
                              )}
                            ></div>
                          )}
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Td>
                      ))}
                    </Tr>
                    {row.getIsExpanded() && (
                      <tr>
                        <td colSpan={row.getVisibleCells().length} className="bg-neutral-50 dark:bg-dark-800">
                          <SubRowComponent row={row} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
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

      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
  <button
    onClick={() => table.previousPage()}
    disabled={!table.getCanPreviousPage()}
    className="w-full sm:w-auto px-4 py-2 sm:py-1 text-sm sm:text-base rounded bg-neutral-200 dark:bg-dark-700 hover:bg-neutral-300 dark:hover:bg-dark-600 disabled:opacity-50"
  >
    Previous
  </button>
  <button
    onClick={() => table.nextPage()}
    disabled={!table.getCanNextPage()}
    className="w-full sm:w-auto px-4 py-2 sm:py-1 text-sm sm:text-base rounded bg-neutral-200 dark:bg-dark-700 hover:bg-neutral-300 dark:hover:bg-dark-600 disabled:opacity-50"
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
