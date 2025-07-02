// Import React Table utilities
import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

// Utility imports
import clsx from "clsx";
import { useRef, useState, useEffect, useLayoutEffect } from "react";

// Data fetching and column generation
import { fetchWeeklyTimeTableData } from "./data";
import { generateWeeklyTimeTableColumns } from "./columns";

// Shared UI components
import { Card, Table, THead, TBody, Th, Tr, Td, Spinner } from "components/ui";

// Custom hooks
import { useLockScrollbar, useLocalStorage, useDidUpdate } from "hooks";

// Table utilities
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useSkipper } from "utils/react-table/useSkipper";

// Custom toolbar and row action components
import { SelectedRowsActions } from "./SelectedRowsActions";
import { Toolbar } from "./Toolbar";

// Theme context
import { useThemeContext } from "app/contexts/theme/context";

// Detect Safari for scroll fix
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";
const isSafari = getUserAgentBrowser() === "Safari";

export default function Week() {
  const { cardSkin } = useThemeContext();

  const [autoResetPageIndex] = useSkipper();
  const [orders, setOrders] = useState([]); // Table data
  const [columns, setColumns] = useState([]); // Dynamic table headers
  const [tableSettings, setTableSettings] = useState({
    enableSorting: true,
    enableColumnFilters: true,
    enableFullScreen: false,
    enableRowDense: true,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  // Local storage state for column visibility and pinning
  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "column-visibility-orders-2",
    {},
  );
  const [columnPinning, setColumnPinning] = useLocalStorage(
    "column-pinning-orders-2",
    {},
  );

  const cardRef = useRef(); // Card container
  const wrapperRef = useRef(); // Scrollable wrapper
  const [loading, setLoading] = useState(true);

  // Fetch column headers and data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { headers, timeTableData } = await fetchWeeklyTimeTableData();
        const generatedColumns = generateWeeklyTimeTableColumns(headers);
        setColumns(generatedColumns);
        setOrders(timeTableData);
      } catch (err) {
        console.error("Failed to fetch timetable data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Reset scroll position when data is ready
  useLayoutEffect(() => {
    if (columns.length > 0 && orders.length > 0 && wrapperRef.current) {
      wrapperRef.current.scrollLeft = 1;
      wrapperRef.current.scrollLeft = 0;
    }
  }, [columns, orders]);

  // Initialize TanStack Table
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
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    autoResetPageIndex,
  });

  // Reset selection when orders change
  useDidUpdate(() => table.resetRowSelection(), [orders]);

  // Lock body scroll in fullscreen mode
  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <div className="font-lato grid grid-cols-1 grid-rows-[auto_auto_1fr] px-4 py-4 text-center uppercase">
      <div
        className={clsx(
          "flex flex-col pt-4",
          tableSettings.enableFullScreen &&
            "dark:bg-dark-900 fixed inset-0 z-61 h-full w-full bg-white pt-3",
        )}
      >
        {/* Toolbar section */}
        <Toolbar table={table} />

        {/* Main card wrapping the table */}
        <Card
          className={clsx(
            "relative mt-3 flex grow flex-col",
            tableSettings.enableFullScreen && "overflow-hidden",
          )}
          ref={cardRef}
        >
          {/* Scrollable container for table */}
          <div
            ref={wrapperRef}
            className="table-wrapper min-w-full grow overflow-x-auto"
          >
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <Spinner color="primary" className="size-10" />
              </div>
            ) : (
              <Table
                hoverable
                dense={tableSettings.enableRowDense}
                sticky={tableSettings.enableFullScreen}
                className="table"
              >
                {/* Table Head */}
                <THead className="table-thead">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id} className="table-tr">
                      {headerGroup.headers.map((header, index) => (
                        <Th
                          key={header.id}
                          className={clsx(
                            "text-center text-xs font-semibold uppercase",
                            "first:ltr:rounded-tl-lg last:ltr:rounded-tr-lg first:rtl:rounded-tr-lg last:rtl:rounded-tl-lg",
                            index === 0
                              ? "text-primary-950 dark:text-dark-100"
                              : "dark:text-dark-900 text-primary-950",
                            header.column.getCanPin() && {
                              "sticky z-2 ltr:left-0 rtl:right-0":
                                header.column.getIsPinned() === "left",
                              "sticky z-2 ltr:right-0 rtl:left-0":
                                header.column.getIsPinned() === "right",
                            },
                          )}
                          style={{
                            backgroundColor:
                              index === 0 ? "#93E6E6" : "#33CDCD", 
                            borderBottom: "none",
                            borderRight: "none",
                            transform:
                              index === 0 ? "translateY(-1px)" : undefined,
                            boxShadow:
                              index === 0
                                ? "0px 4px 10px rgba(0, 0, 0, 0.35), inset -2px 0 4px rgba(255, 255, 255, 0.2), 1px 0 0 #2BBBAD"
                                : undefined,
                            zIndex: 2,
                            position: "relative",
                          }}
                        >
                          {/* Sortable column headers */}
                          {header.column.getCanSort() ? (
                            <div
                              className="flex cursor-pointer items-center space-x-3 select-none"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <span className="text-primary-950 flex-1">
                                {!header.isPlaceholder &&
                                  flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                  )}
                              </span>
                            </div>
                          ) : (
                            !header.isPlaceholder &&
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )
                          )}
                        </Th>
                      ))}
                    </Tr>
                  ))}
                </THead>

                {/* Table Body */}
                <TBody className="table-tbody">
                  {table.getRowModel().rows.map((row, rowIndex) => (
                    <Tr
                      key={row.id}
                      className={clsx(
                        "table-tr",
                        row.getIsSelected() && !isSafari && "row-selected",
                        rowIndex === 0 && "bg-[#E2E2E2] dark:bg-[#3A3A3A]",
                      )}
                    >
                      {row.getVisibleCells().map((cell, index) => (
                        <Td
                          key={cell.id}
                          className={clsx(
                            index === 0
                              ? "dark:bg-dark-100 dark:text-dark-900 bg-[#93E6E6] text-gray-900"
                              : "dark:bg-dark-100 dark:text-dark-900 bg-white text-gray-900",
                            "table-td",
                            cardSkin === "shadow-sm"
                              ? "skin-shadow-sm"
                              : "skin-shadow",
                            cell.column.columnDef.meta?.columnClassName,
                            cell.column.getIsPinned() === "left" &&
                              "is-pinned-left",
                            cell.column.getIsPinned() === "right" &&
                              "is-pinned-right",
                          )}
                          style={{
                            borderRight: "1px solid #2BBBAD",
                            position: "relative",
                            zIndex: cell.column.getIsPinned() ? 1 : "auto",
                            transform:
                              index === 0 ? "translateY(-1px)" : undefined,
                          }}
                        >
                          {/* Visual border if pinned */}
                          {cell.column.getIsPinned() && (
                            <div
                              className={clsx(
                                "pointer-events-none absolute inset-0 border-[#2BBBAD]",
                                cell.column.getIsPinned() === "left"
                                  ? "ltr:border-r rtl:border-l"
                                  : "ltr:border-l rtl:border-r",
                              )}
                            />
                          )}
                          {/* Render cell content */}
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </TBody>
              </Table>
            )}
          </div>

          {/* Row action buttons (if any selected) */}
          <SelectedRowsActions table={table} />
        </Card>
      </div>
    </div>
  );
}
