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
import { Fragment, useEffect, useRef, useState } from "react";
import clsx from "clsx";

import { fetchAttendanceSummary } from "./data";
import { generateAttendanceColumns } from "./columns";
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { ColumnFilter } from "components/shared/table/ColumnFilter";
import { PaginationSection } from "components/shared/table/PaginationSection";
import { Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { SelectedRowsActions } from "./SelectedRowsActions";
import { Toolbar } from "./Toolbar";
import { AttendanceHeaderBox } from "./VerticalWithoutText";

import { useLockScrollbar, useLocalStorage, useDidUpdate } from "hooks";
import { useSkipper } from "utils/react-table/useSkipper";
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

  const [columnVisibility, setColumnVisibility] = useLocalStorage("column-visibility-attendance", {});
  const [columnPinning, setColumnPinning] = useLocalStorage("column-pinning-attendance", {});
  const [autoResetPageIndex] = useSkipper();

  const [tableSettings, setTableSettings] = useState({
    enableSorting: true,
    enableColumnFilters: true,
    enableFullScreen: false,
    enableRowDense: true,
  });

  const today = new Date().toISOString().split("T")[0];
  const formattedDate = new Date(today).toLocaleDateString("en-GB");

  const className = data[0]?.className || "-";
  const checkedInCount = data.filter((d) => d.attendanceStatus === "Checked-In").length;
  const checkedOutCount = data.filter((d) => d.attendanceStatus === "Checked-Out").length;

  const cardRef = useRef();

  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      columnPinning,
      tableSettings,
    },
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
    autoResetPageIndex,
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
            tableSettings.enableFullScreen && "overflow-hidden"
          )}
          ref={cardRef}
        >
          <div className="table-wrapper scrollbar-thin scrollbar-thumb-neutral-400 dark:scrollbar-thumb-dark-300 min-w-full grow overflow-x-auto">
            <Table
              hoverable
              dense={tableSettings.enableRowDense}
              sticky={tableSettings.enableFullScreen}
              className="w-full text-left rtl:text-right"
            >
              <THead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Th
                        key={header.id}
                        className={clsx(
                          "bg-neutral-200 font-semibold uppercase text-neutral-800 dark:bg-dark-800 dark:text-dark-100",
                          header.column.getCanPin() && [
                            header.column.getIsPinned() === "left" && "sticky ltr:left-0 rtl:right-0 z-2",
                            header.column.getIsPinned() === "right" && "sticky ltr:right-0 rtl:left-0 z-2",
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
                        "relative border-y border-b-neutral-200 dark:border-b-dark-500",
                        row.getIsSelected() && !isSafari &&
                          "row-selected after:absolute after:inset-0 after:z-2 after:border-3 after:border-transparent after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500"
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <Td
                          key={cell.id}
                          className={clsx(
                            "relative dark:text-white",
                            cell.column.id === "select" && "px-2",
                            cardSkin === "shadow-sm" ? "dark:bg-dark-700" : "dark:bg-dark-900",
                            cell.column.getCanPin() && [
                              cell.column.getIsPinned() === "left" && "sticky ltr:left-0 rtl:right-0 z-2",
                              cell.column.getIsPinned() === "right" && "sticky ltr:right-0 rtl:left-0 z-2",
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
          <SelectedRowsActions table={table} />
          {table.getCoreRowModel().rows.length > 0 ? (
            <PaginationSection table={table} />
          ) : (
            <div className="py-4 text-center text-sm text-gray-500 dark:text-dark-300">
              No attendance records found.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
