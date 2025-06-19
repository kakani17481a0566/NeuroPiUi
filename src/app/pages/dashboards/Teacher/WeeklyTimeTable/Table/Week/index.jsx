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
import { useRef, useState, useEffect } from "react";
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
  const [orders, setOrders] = useState([]);
  const [columns, setColumns] = useState([]);
  const [timeTableMeta, setTimeTableMeta] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

        if (data.headers?.length) {
          setColumns(generateWeeklyTimeTableColumns(data.headers));
        } else {
          setColumns([]);
        }

        setOrders(data.timeTableData || []);
        setTimeTableMeta({
          month: data.month || "",
          weekName: data.weekName || "",
          course: data.course || "",
          events: data.events || [],
          resources: data.resources || {},
        });
      } catch (err) {
        console.error("Failed to fetch timetable data:", err);
        setError("Unable to load timetable. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const table = useReactTable({
    data: orders,
    columns,
    state: { globalFilter, sorting, columnVisibility, columnPinning, tableSettings },
    meta: { setTableSettings },
    filterFns: { fuzzy: fuzzyFilter },
    globalFilterFn: fuzzyFilter,
    enableSorting: tableSettings.enableSorting,
    enableColumnFilters: tableSettings.enableColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
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
          ) : error ? (
            <div className="text-red-600 text-center mt-6">{error}</div>
          ) : (
            <>
              {/* Header Info */}
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

                {timeTableMeta.events?.length > 0 && (
                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-center text-sm text-gray-700 dark:text-dark-200">
                    <span className="font-semibold">{timeTableMeta.events[0].name}</span>
                    <span className="mx-2 hidden sm:inline">|</span>
                    <span>{new Date(timeTableMeta.events[0].date).toDateString()}</span>
                  </div>
                )}
              </Box>

              <div className="text-xs text-gray-400 italic mt-2 text-center sm:hidden">
                Swipe to scroll table →
              </div>

              {columns.length > 0 && orders.length > 0 ? (
                <div
                  className="overflow-x-auto mt-2 rounded"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  <div className="w-max min-w-full">
                    <Table className="table-auto w-full">
                      <THead className="sticky top-0 z-10 bg-gray-100 dark:bg-dark-800 shadow-sm">
                        {table.getHeaderGroups().map((headerGroup) => (
                          <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header, index) => (
                              <Th
                                key={header.id}
                                className={clsx(
                                  "text-center font-semibold text-gray-800 uppercase dark:text-dark-100",
                                  index === 0 && "border-r border-gray-300"
                                )}
                              >
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(header.column.columnDef.header, header.getContext())}
                              </Th>
                            ))}
                          </Tr>
                        ))}
                      </THead>

                      <TBody>
                        {table.getRowModel().rows.map((row) => (
                          <Tr
                            key={row.id}
                            className={clsx(
                              "border-b text-center dark:border-dark-700",
                              row.getIsExpanded() && "is-expanded",
                              row.getIsSelected() && !isSafari && "row-selected"
                            )}
                          >
                            {row.getVisibleCells().map((cell, index) => (
                              <Td
                                key={cell.id}
                                className={clsx(
                                  "text-center px-2 py-3",
                                  cardSkin === "shadow-sm" ? "skin-shadow-sm" : "skin-shadow",
                                  index === 0 && "border-r border-gray-300",
                                  cell.column.columnDef.meta?.columnClassName
                                )}
                              >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </Td>
                            ))}
                          </Tr>
                        ))}
                      </TBody>
                    </Table>
                  </div>
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
