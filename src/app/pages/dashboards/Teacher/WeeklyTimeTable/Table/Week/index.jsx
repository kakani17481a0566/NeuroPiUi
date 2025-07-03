import { useEffect, useState, useRef, useLayoutEffect } from "react";
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
import clsx from "clsx";

// Local imports
import { Card, Table, THead, TBody, Th, Tr, Td, Spinner } from "components/ui";
import { useLockScrollbar, useLocalStorage, useDidUpdate } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useSkipper } from "utils/react-table/useSkipper";
import { SelectedRowsActions } from "./SelectedRowsActions";
import { Toolbar } from "./Toolbar";
import { fetchWeeklyTimeTableData } from "./data";
import { generateWeeklyTimeTableColumns } from "./columns";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";
import { useThemeContext } from "app/contexts/theme/context";
import DemoDropdownCard from "./DemoDropdownCard";

const isSafari = getUserAgentBrowser() === "Safari";

export default function Week() {
  const { cardSkin } = useThemeContext();

  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const [autoResetPageIndex] = useSkipper();
  const [orders, setOrders] = useState([]);
  const [columns, setColumns] = useState([]);
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
  const wrapperRef = useRef();
  const [loading, setLoading] = useState(false);

  // Fetch timetable data when course changes
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCourseId) return;
      try {
        setLoading(true);
        const { headers, timeTableData } = await fetchWeeklyTimeTableData({
          courseId: selectedCourseId
        });
        setColumns(generateWeeklyTimeTableColumns(headers));
        setOrders(timeTableData);
      } catch (err) {
        console.error("Failed to fetch timetable data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCourseId]);

  useLayoutEffect(() => {
    if (columns.length > 0 && orders.length > 0 && wrapperRef.current) {
      wrapperRef.current.scrollLeft = 1;
      wrapperRef.current.scrollLeft = 0;
    }
  }, [columns, orders]);

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

  useDidUpdate(() => table.resetRowSelection(), [orders]);
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
        <DemoDropdownCard onCourseChange={setSelectedCourseId} />
        <Toolbar table={table} />
        <Card
          className={clsx("relative mt-3 flex grow flex-col", tableSettings.enableFullScreen && "overflow-hidden")}
          ref={cardRef}
        >
          <div ref={wrapperRef} className="table-wrapper min-w-full grow overflow-x-auto">
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
                <THead className="table-thead">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id} className="table-tr">
                      {headerGroup.headers.map((header, index) => (
                        <Th
                          key={header.id}
                          className={clsx(
                            "text-center text-xs font-semibold uppercase",
                            index === 0
                              ? "text-primary-950 dark:text-dark-100"
                              : "dark:text-dark-900 text-primary-950",
                          )}
                          style={{
                            backgroundColor: index === 0 ? "#93E6E6" : "#33CDCD",
                            borderBottom: "none",
                            borderRight: "none",
                            transform: index === 0 ? "translateY(-1px)" : undefined,
                            boxShadow:
                              index === 0
                                ? "0px 4px 10px rgba(0, 0, 0, 0.35), inset -2px 0 4px rgba(255, 255, 255, 0.2), 1px 0 0 #2BBBAD"
                                : undefined,
                            zIndex: 2,
                            position: "relative",
                          }}
                        >
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
                            cardSkin === "shadow-sm" ? "skin-shadow-sm" : "skin-shadow",
                          )}
                          style={{
                            borderRight: "1px solid #2BBBAD",
                            position: "relative",
                            zIndex: cell.column.getIsPinned() ? 1 : "auto",
                            transform: index === 0 ? "translateY(-1px)" : undefined,
                          }}
                        >
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
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </TBody>
              </Table>
            )}
          </div>

          <SelectedRowsActions table={table} />
        </Card>
      </div>
    </div>
  );
}
