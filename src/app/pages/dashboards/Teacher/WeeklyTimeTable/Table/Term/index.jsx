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

  const [orders, setOrders] = useState([]);
  const [columns, setColumns] = useState([]);
  const [month, setMonth] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [term, setTerm] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const [tableSettings, setTableSettings] = useState({
    enableSorting: true,
    enableColumnFilters: true,
    enableFullScreen: false,
    enableRowDense: true,
  });

  const [columnVisibility, setColumnVisibility] = useLocalStorage("term-column-visibility", {});
  const [columnPinning, setColumnPinning] = useLocalStorage("term-column-pinning", {});
  const cardRef = useRef();

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetchWeeklyMatrixData(1, 1, 1);
        const { headers, dataTerm, month } = response;

        setColumns(generateTermColumns(headers));
        setOrders(dataTerm);
        setMonth(month);

        const match = month.match(/^(\w+\s+\d{4})\s+(Week\s+\d+)\s+(.*)$/);
        if (match) {
          setAcademicYear(match[1]); // June 2025
          setTerm(match[2]);         // Week 1
          setDateRange(match[3]);    // 03 - 07
        } else {
          console.warn("Month string format unexpected:", month);
          setAcademicYear("");
          setTerm("");
          setDateRange("");
        }
      } catch (err) {
        console.error("Failed to load term data:", err);
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
    <div className="grid grid-cols-1 grid-rows-[auto_auto_1fr] px-4 py-4">
      {month && (
        <Box className="dark:bg-dark-500 mb-4 w-full rounded-lg bg-gray-200 px-4 py-3">
          <div className="flex flex-col items-center justify-center space-y-1 text-center">
            <div className="text-primary-500 dark:text-primary-400 text-base font-semibold">
              {academicYear}
            </div>
            <div className="dark:text-dark-100 text-base font-semibold text-gray-800">
              {term}
            </div>
            <div className="dark:text-dark-100 text-sm font-medium text-gray-800">
              {dateRange}
            </div>
          </div>
        </Box>
      )}

      <div className={clsx("flex flex-col pt-4", tableSettings.enableFullScreen && "fixed inset-0 z-61 h-full w-full bg-white pt-3 dark:bg-dark-900")}>
        <Toolbar table={table} />
        <Card
          className={clsx("relative mt-3 flex grow flex-col", tableSettings.enableFullScreen && "overflow-hidden")}
          ref={cardRef}
        >
          <div className="table-wrapper min-w-full grow overflow-x-auto">
            <Table
              hoverable
              dense={tableSettings.enableRowDense}
              sticky={tableSettings.enableFullScreen}
              className="table"
            >
              <THead className="table-thead">
                {table.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id} className="table-tr">
                    {headerGroup.headers.map((header) => (
                      <Th
                        key={header.id}
                        className={clsx(
                          "table-th border-b border-gray-300 dark:border-dark-500",
                          header.column.columnDef.meta?.columnClassName,
                          header.column.getIsPinned() === "left" && "is-pinned-left",
                          header.column.getIsPinned() === "right" && "is-pinned-right"
                        )}
                      >
                        {header.column.getCanSort() ? (
                          <div
                            className="flex cursor-pointer select-none items-center space-x-3"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <span className="flex-1">
                              {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                  <Tr
                    key={row.id}
                    className={clsx(
                      "table-tr",
                      row.getIsSelected() && !isSafari && "row-selected"
                    )}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <Td
                        key={cell.id}
                        className={clsx(
                          "table-td",
                          cardSkin === "shadow-sm" ? "skin-shadow-sm" : "skin-shadow",
                          cell.column.columnDef.meta?.columnClassName,
                          index === 0 && "border-r border-gray-300 dark:border-dark-500",
                          cell.column.getIsPinned() === "left" && "is-pinned-left",
                          cell.column.getIsPinned() === "right" && "is-pinned-right"
                        )}
                      >
                        {cell.column.getIsPinned() && (
                          <div
                            className={clsx(
                              "pointer-events-none absolute inset-0 border-gray-200 dark:border-dark-500",
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
                ))}
              </TBody>
            </Table>
          </div>
          <SelectedRowsActions table={table} />
        </Card>
      </div>
    </div>
  );
}
