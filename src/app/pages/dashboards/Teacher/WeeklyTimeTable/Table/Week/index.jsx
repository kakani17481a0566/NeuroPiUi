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
import { fetchWeeklyTimeTableData } from "./data";
import { generateWeeklyTimeTableColumns } from "./columns";

import { Card, Table, THead, TBody, Th, Tr, Td, Spinner, Box } from "components/ui";
import { useLockScrollbar, useLocalStorage, useDidUpdate } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useSkipper } from "utils/react-table/useSkipper";
import { SelectedRowsActions } from "./SelectedRowsActions";
import { Toolbar } from "./Toolbar";
import { useThemeContext } from "app/contexts/theme/context";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";

const isSafari = getUserAgentBrowser() === "Safari";

export default function Week() {
  const { cardSkin } = useThemeContext();
  const [autoResetPageIndex] = useSkipper();

  // State to hold table data and metadata
  const [orders, setOrders] = useState([]);
  const [columns, setColumns] = useState([]);
  const [timeTableMeta, setTimeTableMeta] = useState({});

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Table settings and filters
  const [tableSettings, setTableSettings] = useState({
    enableSorting: true,
    enableColumnFilters: true,
    enableFullScreen: false,
    enableRowDense: true,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useLocalStorage("column-visibility-orders-2", {});
  const [columnPinning, setColumnPinning] = useLocalStorage("column-pinning-orders-2", {});

  const cardRef = useRef();
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchWeeklyTimeTableData();

        // Defensive check: If headers are present, generate columns, else empty
        if (data.headers && data.headers.length > 0) {
          setColumns(generateWeeklyTimeTableColumns(data.headers));
        } else {
          setColumns([]);
        }

        // timeTableData is your rows
        setOrders(data.timeTableData || []);
        
        // Store other metadata (month, weekName, course, events, resources)
        setTimeTableMeta({
          month: data.month || "",
          weekName: data.weekName || "",
          course: data.course || "",
          events: data.events || [],
          resources: data.resources || {},
        });
      } catch (error) {
        console.error("Failed to fetch timetable data:", error);
        setColumns([]);
        setOrders([]);
        setTimeTableMeta({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Only initialize table when columns and orders are ready
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
      deleteRow: () => {},
      deleteRows: () => {},
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
    getRowCanExpand: () => false,
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    autoResetPageIndex,
  });

  useDidUpdate(() => table.resetRowSelection(), [orders]);
  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <div className="grid grid-cols-1 grid-rows-[auto_auto_1fr] px-4 py-4">
      <div
        className={clsx(
          "flex flex-col pt-4",
          tableSettings.enableFullScreen &&
            "dark:bg-dark-900 fixed inset-0 z-61 h-full w-full bg-white pt-3"
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
          {isLoading ? (
            <div className="flex grow items-center justify-center py-12">
              <Spinner color="primary" className="size-12 sm:size-16 border-4" />
            </div>
          ) : (
            <>
              <Box className="w-full rounded-lg bg-gray-200 dark:bg-dark-500 p-4">
                <div className="flex flex-col gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
                  <div className="font-medium text-gray-800 dark:text-dark-100">
                    {timeTableMeta.month || "—"}
                  </div>
                  <div className="font-semibold text-xl text-primary-600 dark:text-primary-400">
                    {timeTableMeta.weekName || "—"}
                  </div>
                  <div className="font-medium text-gray-800 dark:text-dark-100">
                    {timeTableMeta.course || "—"}
                  </div>
                </div>

                {timeTableMeta.events && timeTableMeta.events.length > 0 && (
                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-center text-sm text-gray-700 dark:text-dark-200">
                    <span className="font-semibold">{timeTableMeta.events[0].name}</span>
                    <span className="mx-2 hidden sm:inline">|</span>
                    <span>{new Date(timeTableMeta.events[0].date).toDateString()}</span>
                  </div>
                )}
              </Box>

              {/* Only render table if columns and data exist */}
              {columns.length > 0 && orders.length > 0 ? (
                <div className="table-wrapper min-w-full grow overflow-x-auto mt-4">
                  <Table
                    hoverable
                    dense={tableSettings.enableRowDense}
                    sticky={tableSettings.enableFullScreen}
                    className="table"
                  >
                    <THead>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id} className="table-tr">
                          {headerGroup.headers.map((header) => (
                            <Th
                              key={header.id}
                              className={clsx(
                                "dark:bg-dark-800 dark:text-dark-100 bg-gray-200 text-center font-semibold text-gray-800 uppercase",
                                header.column.getCanPin() && [
                                  header.column.getIsPinned() === "left" &&
                                    "sticky z-2 ltr:left-0 rtl:right-0",
                                  header.column.getIsPinned() === "right" &&
                                    "sticky z-2 ltr:right-0 rtl:left-0",
                                ],
                                header.column.id === table.getAllLeafColumns()[0]?.id &&
                                  "dark:border-dark-700 border-r border-gray-300"
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
                                          header.getContext()
                                        )}
                                  </span>
                                </div>
                              ) : header.isPlaceholder ? null : (
                                flexRender(header.column.columnDef.header, header.getContext())
                              )}
                            </Th>
                          ))}
                        </Tr>
                      ))}
                    </THead>

                    <TBody className="table-tbody">
                      {table.getRowModel().rows.map((row) => (
                        <Fragment key={row.id}>
                          <Tr
                            className={clsx(
                              "table-tr dark:border-dark-700 border-b border-gray-300",
                              row.getIsExpanded() && "is-expanded",
                              row.getIsSelected() && !isSafari && "row-selected"
                            )}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <Td
                                key={cell.id}
                                className={clsx(
                                  "table-td text-center",
                                  cardSkin === "shadow-sm" ? "skin-shadow-sm" : "skin-shadow",
                                  cell.column.columnDef.meta?.columnClassName,
                                  cell.column.getIsPinned() === "left" && "is-pinned-left",
                                  cell.column.getIsPinned() === "right" && "is-pinned-right",
                                  cell.column.id === table.getAllLeafColumns()[0]?.id &&
                                    "dark:border-dark-700 border-r border-gray-300"
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

                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </Td>
                            ))}
                          </Tr>
                        </Fragment>
                      ))}
                    </TBody>
                  </Table>
                </div>
              ) : (
                <div className="flex justify-center py-12 text-gray-500 dark:text-dark-300">
                  No data available to display.
                </div>
              )}

              <SelectedRowsActions table={table} />
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
