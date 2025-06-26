import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { Box, Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { useLocalStorage, useLockScrollbar, useDidUpdate } from "hooks";
import { Toolbar } from "./Toolbar";
import { SelectedRowsActions } from "./SelectedRowsActions";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useSkipper } from "utils/react-table/useSkipper";
import { fetchWeeklyMatrixData } from "./data";
import { generateTermColumns } from "./columns";
import { useThemeContext } from "app/contexts/theme/context";

const isSafari = getUserAgentBrowser() === "Safari";

export default function Term() {
  const { cardSkin } = useThemeContext();
  const [autoResetPageIndex] = useSkipper();
  const cardRef = useRef();

  const [orders, setOrders] = useState([]);
  const [columns, setColumns] = useState([]);
  const [month, setMonth] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [loading, setLoading] = useState(true);

  const [tableSettings, setTableSettings] = useState({
    enableSorting: true,
    enableColumnFilters: true,
    enableFullScreen: false,
    enableRowDense: true,
  });

  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "term-column-visibility",
    {},
  );
  const [columnPinning, setColumnPinning] = useLocalStorage(
    "term-column-pinning",
    {},
  );

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const response = await fetchWeeklyMatrixData(1, 1, 1);
        const { headers, dataTerm, month } = response;

        setColumns(generateTermColumns(headers));
        setOrders(dataTerm);
        setMonth(month);
      } catch (err) {
        console.error("Failed to load term data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

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
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    autoResetPageIndex,
  });

  useDidUpdate(() => table.resetRowSelection(), [orders]);
  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <div className="space-y-4 px-4 py-4">
    {month && (() => {
  const [prefix, ...rest] = month.split("Term Start Date");
  const academicYearMatch = prefix.match(/Academic Year \d{4}-\d{2}/);
  const termMatch = prefix.match(/Term \d/);
  const startEndDates = rest.length ? "Term Start Date" + rest.join("Term Start Date") : "";

  return (
    <Box className="dark:bg-dark-500 w-full rounded-lg bg-gray-200 px-4 py-3">
      <div className="text-center text-sm font-semibold sm:text-base space-x-2 flex flex-wrap justify-center gap-2">
        <span className="text-primary-700 dark:text-primary-300">
          {academicYearMatch?.[0]}
        </span>
        {termMatch && (
          <span className="text-secondary-600 dark:text-secondary-300">
            {termMatch[0]}
          </span>
        )}
        {startEndDates && (
          startEndDates.split("|").map((part, index) => (
            <span
              key={index}
              className="text-rose-600 dark:text-rose-300"
            >
              {part.trim()}
            </span>
          ))
        )}
      </div>
    </Box>
  );
})()}


      {loading ? (
        <div className="dark:text-dark-300 py-10 text-center text-sm text-gray-500">
          Loading term timetable...
        </div>
      ) : (
        <div
          className={clsx(
            "flex flex-col pt-4",
            tableSettings.enableFullScreen &&
              "dark:bg-dark-900 fixed inset-0 z-61 h-full w-full bg-white pt-3",
          )}
        >
          <Toolbar table={table} />

          <Card
            className={clsx(
              "relative mt-3 w-full overflow-x-auto",
              tableSettings.enableFullScreen && "h-full w-full",
            )}
            ref={cardRef}
          >
            <div className="min-w-[768px]">
              <Table
                dense={tableSettings.enableRowDense}
                sticky={tableSettings.enableFullScreen}
                className="w-full text-center"
              >
                <THead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <Th
                          key={header.id}
                          className={clsx(
                            "dark:bg-dark-800 dark:text-dark-100 bg-gray-200 px-2 py-2 text-sm font-semibold whitespace-nowrap text-gray-800 uppercase",
                            "first:ltr:rounded-tl-lg last:ltr:rounded-tr-lg first:rtl:rounded-tr-lg last:rtl:rounded-tl-lg",
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
                              onClick={header.column.getToggleSortingHandler()}
                              className="flex cursor-pointer items-center space-x-3 select-none"
                            >
                              <span className="flex-1">
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

                <TBody>
                  {table.getRowModel().rows.map((row, rowIndex) => (
                    <Tr
                      key={row.id}
                      className={clsx(
                        row.getIsSelected() && !isSafari && "row-selected",
                        rowIndex === 0 && "bg-[#E2E2E2] dark:bg-[#3A3A3A]",
                      )}
                    >
                      {row.getVisibleCells().map((cell, index) => (
                        <Td
                          key={cell.id}
                          className={clsx(
                            "border-r border-gray-300 px-2 py-2 text-sm whitespace-nowrap",
                            index === 0
                              ? "dark:bg-dark-700 bg-gray-200 dark:text-white"
                              : "dark:bg-dark-700 bg-white dark:text-white",
                            cardSkin === "shadow-sm"
                              ? "skin-shadow-sm"
                              : "skin-shadow",
                            cell.column.columnDef.meta?.columnClassName,
                            cell.column.getIsPinned() === "left" &&
                              "is-pinned-left",
                            cell.column.getIsPinned() === "right" &&
                              "is-pinned-right",
                          )}
                        >
                          {cell.column.getIsPinned() && (
                            <div
                              className={clsx(
                                "dark:border-dark-500 pointer-events-none absolute inset-0 border-gray-200",
                                cell.column.getIsPinned() === "left"
                                  ? "ltr:border-r rtl:border-l"
                                  : "ltr:border-l rtl:border-r",
                              )}
                            />
                          )}
                          <div
                            style={
                              cell.column.id.toLowerCase() === "colum1"
                                ? { whiteSpace: "pre-line" }
                                : undefined
                            }
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </div>
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </TBody>
              </Table>
            </div>

            <SelectedRowsActions table={table} />
          </Card>
        </div>
      )}
    </div>
  );
}
