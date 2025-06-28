// ✅ Updated AttendanceTable.jsx aligned with OrdersTable behavior

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
import clsx from "clsx";
import { Fragment, useEffect, useRef, useState } from "react";
import { fetchAttendanceSummary } from "./data";
import { generateAttendanceColumns } from "./columns";
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { ColumnFilter } from "components/shared/table/ColumnFilter";
import { PaginationSection } from "components/shared/table/PaginationSection";
import { Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { useLockScrollbar, useLocalStorage, useDidUpdate } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useSkipper } from "utils/react-table/useSkipper";
import { SelectedRowsActions } from "./SelectedRowsActions";
import { Toolbar } from "./Toolbar";
import { useThemeContext } from "app/contexts/theme/context";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";
import { AttendanceHeaderBox } from "./VerticalWithoutText";

const isSafari = getUserAgentBrowser() === "Safari";

function SubRowComponent({ row }) {
  return (
    <div className="dark:text-dark-100 p-4 text-sm text-neutral-700">
      {/* Customize this based on your expanded content */}
      <strong>Expanded Details:</strong> {JSON.stringify(row.original)}
    </div>
  );
}

export default function AttendanceTable() {
  const { cardSkin } = useThemeContext();
  const [autoResetPageIndex] = useSkipper();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "column-visibility-attendance",
    {},
  );
  const [columnPinning, setColumnPinning] = useLocalStorage(
    "column-pinning-attendance",
    {},
  );

  const [tableSettings, setTableSettings] = useState({
    enableSorting: true,
    enableColumnFilters: true,
    enableFullScreen: false,
    enableRowDense: true,
  });

  const today = new Date().toISOString().split("T")[0];
  const formattedDate = new Date(today).toLocaleDateString("en-GB"); // dd/mm/yyyy
  const className = data[0]?.className || "-";
  const checkedInCount = data.filter(
    (d) => d.attendanceStatus === "Checked-In",
  ).length;
  const checkedOutCount = data.filter(
    (d) => d.attendanceStatus === "Checked-Out",
  ).length;

  const cardRef = useRef();

  const fetchData = async () => {
    const today = new Date().toISOString().split("T")[0];
    const response = await fetchAttendanceSummary({
      date: today,
      tenantId: 1,
      branchId: 1,
      courseId: 1,
    });
    setData(response.data);
    const allowedHeaders = [
      "studentId",
      "studentName",
      // "className",
      // "fromTime",
      // "toTime",
      // "markedBy",
      "attendanceStatus",
    ];
    const filteredHeaders = response.headers.filter((h) =>
      allowedHeaders.includes(h),
    );
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
    enableSorting: tableSettings.enableSorting,
    enableColumnFilters: tableSettings.enableColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,

    // ✅ Required for checkbox row selection
    enableRowSelection: true,
    getRowCanSelect: (row) => {
      const { fromTime, toTime } = row.original;
      const isCheckedIn = fromTime && fromTime !== "Not marked";
      const isCheckedOut = toTime && toTime !== "Not marked";
      return !(isCheckedIn && isCheckedOut);
    },

    autoResetPageIndex,
    getRowCanExpand: () => true,
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
          tableSettings.enableFullScreen &&
            "dark:bg-dark-900 fixed inset-0 z-61 h-full w-full bg-white pt-3",
        )}
      >
        <Toolbar table={table} />
        <Card
          className={clsx(
            "relative mt-3 flex grow flex-col",
            tableSettings.enableFullScreen && "overflow-hidden",
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
                          "dark:bg-dark-800 dark:text-dark-100 bg-neutral-200 font-semibold text-neutral-800 uppercase first:ltr:rounded-tl-lg last:ltr:rounded-tr-lg first:rtl:rounded-tr-lg last:rtl:rounded-tl-lg",
                          header.column.getCanPin() && [
                            header.column.getIsPinned() === "left" &&
                              "sticky z-2 ltr:left-0 rtl:right-0",
                            header.column.getIsPinned() === "right" &&
                              "sticky z-2 ltr:right-0 rtl:left-0",
                          ],
                        )}
                      >
                        {header.column.getCanSort() ? (
                          <div
                            className="flex cursor-pointer items-center space-x-3 select-none"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <span className="flex-1">
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                  )}
                            </span>
                            <TableSortIcon
                              sorted={header.column.getIsSorted()}
                            />
                          </div>
                        ) : header.isPlaceholder ? null : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )
                        )}
                        {header.column.getCanFilter() ? (
                          <ColumnFilter column={header.column} />
                        ) : null}
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
                        "dark:border-b-dark-500 relative border-y border-transparent border-b-neutral-200",
                        row.getIsSelected() &&
                          !isSafari &&
                          "row-selected after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500 after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent",
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <Td
                          key={cell.id}
                          className={clsx(
                            "relative",
                     cell.column.id === "select" && "px-2", // or whatever spacing you want

                            cardSkin === "shadow-sm"
                              ? "dark:bg-dark-700"
                              : "dark:bg-dark-900",
                            cell.column.getCanPin() && [
                              cell.column.getIsPinned() === "left" &&
                                "sticky z-2 ltr:left-0 rtl:right-0",
                              cell.column.getIsPinned() === "right" &&
                                "sticky z-2 ltr:right-0 rtl:left-0",
                            ],
                          )}
                        >
                          {cell.column.getIsPinned() && (
                            <div
                              className={clsx(
                                "dark:border-dark-500 pointer-events-none absolute inset-0 border-neutral-200",
                                cell.column.getIsPinned() === "left"
                                  ? "ltr:border-r rtl:border-l"
                                  : "ltr:border-l rtl:border-r",
                              )}
                            ></div>
                          )}
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </Td>
                      ))}
                    </Tr>
                    {row.getIsExpanded() && (
                      <tr>
                        <td
                          colSpan={row.getVisibleCells().length}
                          className="dark:bg-dark-800 bg-neutral-50"
                        >
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
  <div className="...">
    <PaginationSection table={table} />
  </div>
) : (
  <div className="text-center py-4 text-sm text-gray-500 dark:text-dark-300">
    No attendance records found.
  </div>
)}

        </Card>
      </div>
    </div>
  );
}
