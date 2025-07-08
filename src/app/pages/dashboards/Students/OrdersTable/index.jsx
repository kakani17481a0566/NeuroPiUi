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
    enableRowDense: false,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useLocalStorage("column-visibility-orders", {});
  const [columnPinning, setColumnPinning] = useLocalStorage("column-pinning-orders", {});

  const cardRef = useRef();
  const { width: cardWidth } = useBoxSize({ ref: cardRef });

  // 🔥 Fetch and format your data
  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);

      try {
        const res = await studentDetails({ date: date });
        const formatted = res.data.students.map((student, index) => ({
          order_id: index + 1,
          studentName: student.name ,
          checkedIn: student.checkedIn,
          checkedOut: student.checkedOut,
        }));
        console.log("Formatted data:", formatted);
        setOrders(formatted);
      } catch (err) {
        console.error("Failed to load students:", err);
      }
      finally {
        setLoading(false);

      }
    }
    fetchOrders();
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
        setOrders((old) => old.filter((oldRow) => oldRow.order_id !== row.original.order_id));
      },
      deleteRows: (rows) => {
        skipAutoResetPageIndex();
        const ids = rows.map((r) => r.original.order_id);
        setOrders((old) => old.filter((r) => !ids.includes(r.order_id)));
      },
    },
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
      <div className={clsx(
        "flex flex-col",
        tableSettings.enableFullScreen && "fixed inset-0 z-61 h-full w-full bg-white pt-3 dark:bg-dark-900"
      )}>
        <Toolbar table={table} /> {/* ✅ search works here */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="loader"></div>
            <span className="ml-2">Loading...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex justify-center items-center h-40 text-gray-500">
            No data found.
          </div>
        ) : (
          <Card ref={cardRef} className={clsx(
            "relative mt-3 flex grow flex-col",
            tableSettings.enableFullScreen && "overflow-hidden"
          )}>
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
                            "bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100",
                            header.column.getCanPin() && [
                              header.column.getIsPinned() === "left" && "sticky z-2 ltr:left-0 rtl:right-0",
                              header.column.getIsPinned() === "right" && "sticky z-2 ltr:right-0 rtl:left-0",
                            ],
                          )}
                        >
                          {header.column.getCanSort() ? (
                            <div
                              className="flex cursor-pointer select-none items-center space-x-3"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                              <TableSortIcon sorted={header.column.getIsSorted()} />
                            </div>
                          ) : flexRender(header.column.columnDef.header, header.getContext())}
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
                          "relative border-y border-transparent border-b-gray-200 dark:border-b-dark-500",
                          row.getIsExpanded() && "border-dashed",
                          row.getIsSelected() && !isSafari &&
                          "row-selected after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500"
                        )}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <Td
                            key={cell.id}
                            className={clsx(
                              "relative",
                              cardSkin === "shadow-sm" ? "dark:bg-dark-700" : "dark:bg-dark-900",
                              cell.column.getCanPin() && [
                                cell.column.getIsPinned() === "left" && "sticky z-2 ltr:left-0 rtl:right-0",
                                cell.column.getIsPinned() === "right" && "sticky z-2 ltr:right-0 rtl:left-0",
                              ],
                            )}
                          >
                            {cell.column.getIsPinned() && (
                              <div className={clsx(
                                "pointer-events-none absolute inset-0 border-gray-200 dark:border-dark-500",
                                cell.column.getIsPinned() === "left"
                                  ? "ltr:border-r rtl:border-l"
                                  : "ltr:border-l rtl:border-r"
                              )}></div>
                            )}
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </Td>
                        ))}
                      </Tr>
                      {row.getIsExpanded() && (
                        <tr>
                          <td colSpan={row.getVisibleCells().length} className="p-0">
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
              <div className={clsx(
                "px-4 pb-4 sm:px-5 sm:pt-4",
                tableSettings.enableFullScreen && "bg-gray-50 dark:bg-dark-800",
                !(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && "pt-4"
              )}>
                <PaginationSection table={table} />
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
