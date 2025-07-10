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
import { Fragment, useRef, useState, useEffect } from "react";
import {
  CheckCircleIcon,
  ArrowRightOnRectangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { ColumnFilter } from "components/shared/table/ColumnFilter";
import { PaginationSection } from "components/shared/table/PaginationSection";
import { Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import {
  useBoxSize,
  useLockScrollbar,
  useDidUpdate,
  useLocalStorage,
} from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useSkipper } from "utils/react-table/useSkipper";
import { SelectedRowsActions } from "./SelectedRowsActions";
import { SubRowComponent } from "./SubRowComponent";
import { Toolbar } from "./Toolbar";
import { useThemeContext } from "app/contexts/theme/context";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";

import { columns } from "./columns";
import { studentDetails } from "./data"; // your api call

const isSafari = getUserAgentBrowser() === "Safari";

export default function StudentAttendance({ date }) {
  const { cardSkin } = useThemeContext();
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [tableSettings, setTableSettings] = useState({
    enableSorting: true,
    enableColumnFilters: true,
    enableFullScreen: false,
    enableRowDense: true,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "column-visibility-orders",
    {}
  );
  const [columnPinning, setColumnPinning] = useLocalStorage(
    "column-pinning-orders",
    {}
  );

  const cardRef = useRef();
  const { width: cardWidth } = useBoxSize({ ref: cardRef });

  useEffect(() => {
    async function fetchStudentsAttendance() {
      setLoading(true);
      try {
        const res = await studentDetails({ date: date });
        const formatted = res.data.records.map((student) => ({
          studentId: student.studentId,
          studentName: student.studentName,
          courseName: student.className,
          ParentName: student.parentName,
          attendanceStatus: student.attendanceStatus,
          MobileNumber: student.mobileNumber,
          AlternateNumber: student.alternateNumber,
        }));
        setOrders(formatted);
      } catch (err) {
        console.error("Failed to load students:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStudentsAttendance();
  }, [date]);

  const table = useReactTable({
    data: orders,
    columns,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      columnPinning,
      tableSettings,
    },
    meta: {
      setTableSettings,
      deleteRow: (row) => {
        skipAutoResetPageIndex();
        setOrders((old) =>
          old.filter((oldRow) => oldRow.order_id !== row.original.order_id)
        );
      },
      deleteRows: (rows) => {
        skipAutoResetPageIndex();
        const ids = rows.map((r) => r.original.order_id);
        setOrders((old) => old.filter((r) => !ids.includes(r.order_id)));
      },
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
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    autoResetPageIndex,
  });

  useDidUpdate(() => table.resetRowSelection(), [orders]);
  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <div className="col-span-12">
      <div
        className={clsx(
          "flex flex-col",
          tableSettings.enableFullScreen &&
            "dark:bg-dark-900 fixed inset-0 z-61 h-full w-full bg-white pt-3"
        )}
      >
        <Toolbar table={table} />
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="loader"></div>
            <span className="ml-2">Loading...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-gray-500">
            No data found.
          </div>
        ) : (
          <Card
            ref={cardRef}
            className={clsx(
              "relative mt-3 flex grow flex-col",
              tableSettings.enableFullScreen && "overflow-hidden"
            )}
          >
            <div className="table-wrapper min-w-full grow overflow-x-auto">
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
                            "dark:bg-dark-800 bg-gray-200 	text-primary-950 uppercase dark:text-white",
                            header.column.getCanPin() && [
                              header.column.getIsPinned() === "left" &&
                                "sticky z-2 ltr:left-0 rtl:right-0",
                              header.column.getIsPinned() === "right" &&
                                "sticky z-2 ltr:right-0 rtl:left-0",
                            ]
                          )}
                        >
                          {header.column.getCanSort() ? (
                            <div
                              className="flex cursor-pointer items-center space-x-3 select-none"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <span className="font-lotto text-gray-800 dark:text-white">
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                              </span>
                              <TableSortIcon
                                sorted={header.column.getIsSorted()}
                                className="text-primary-600"
                              />
                            </div>
                          ) : (
                            <span className="font-lotto text-gray-800 dark:text-white">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </span>
                          )}
                          {header.column.getCanFilter() && (
                            <ColumnFilter column={header.column} />
                          )}
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
                          "dark:bg-dark-800 relative border-y border-transparent border-b-gray-200 bg-white",
                          row.getIsExpanded() && "border-dashed",
                          row.getIsSelected() &&
                            !isSafari &&
                            "row-selected after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500 after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent"
                        )}
                      >
                        {row.getVisibleCells().map((cell) => {
                          const isStudentName = cell.column.id === "studentName";
                          const status = row.original.attendanceStatus;

                          const textColor = isStudentName
                            ? status === "Checked-In"
                              ? "text-[#52AA97]"
                              : status === "Checked-Out"
                              ? "text-violet-500"
                              : status === "Not Marked"
                              ? "text-red-600"
                              : "text-gray-900 dark:text-white"
                            : "text-gray-900 dark:text-white";

                          return (
                            <Td
                              key={cell.id}
                              className={clsx(
                                "relative",
                                cardSkin === "shadow-sm"
                                  ? "dark:bg-dark-700"
                                  : "dark:bg-dark-900",
                                cell.column.getCanPin() && [
                                  cell.column.getIsPinned() === "left" &&
                                    "sticky z-2 ltr:left-0 rtl:right-0",
                                  cell.column.getIsPinned() === "right" &&
                                    "sticky z-2 ltr:right-0 rtl:left-0",
                                ]
                              )}
                            >
                              {cell.column.getIsPinned() && (
                                <div
                                  className={clsx(
                                    "dark:border-dark-500 pointer-events-none absolute inset-0 border-gray-200",
                                    cell.column.getIsPinned() === "left"
                                      ? "ltr:border-r rtl:border-l"
                                      : "ltr:border-l rtl:border-r"
                                  )}
                                />
                              )}
                              <span className={clsx("block uppercase", textColor)}>
                                {isStudentName ? (
                                  <span className="flex items-center gap-1">
                                    {status === "Checked-In" && (
                                      <CheckCircleIcon className="h-4 w-4" />
                                    )}
                                    {status === "Checked-Out" && (
                                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                                    )}
                                    {status === "Not Marked" && (
                                      <XCircleIcon className="h-4 w-4" />
                                    )}
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                    )}
                                  </span>
                                ) : (
                                  flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )
                                )}
                              </span>
                            </Td>
                          );
                        })}
                      </Tr>
                      {row.getIsExpanded() && (
                        <tr>
                          <td
                            colSpan={row.getVisibleCells().length}
                            className="p-0"
                          >
                            <SubRowComponent row={row} cardWidth={cardWidth} />
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </TBody>
              </Table>
            </div>
            <SelectedRowsActions table={table} />
            {table.getCoreRowModel().rows.length > 0 && (
              <div
                className={clsx(
                  "px-4 pb-4 sm:px-5 sm:pt-4",
                  tableSettings.enableFullScreen &&
                    "dark:bg-dark-800 bg-gray-50",
                  !(table.getIsSomeRowsSelected() ||
                    table.getIsAllRowsSelected()) && "pt-4"
                )}
              >
                <PaginationSection table={table} />
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
