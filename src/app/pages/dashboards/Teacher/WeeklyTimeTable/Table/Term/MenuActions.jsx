// Import Dependencies
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
import { Fragment, useRef, useState } from "react";
import { Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { useBoxSize, useLockScrollbar, useLocalStorage, useDidUpdate } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useSkipper } from "utils/react-table/useSkipper";
import { generateWeeklyTimeTableColumns } from "./columns";
import { fetchWeeklyMatrixData } from "./data";
import { Toolbar } from "./Toolbar";
import { PaginationSection } from "components/shared/table/PaginationSection";
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { ColumnFilter } from "components/shared/table/ColumnFilter";

export default function Term() {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useLocalStorage("column-visibility-term", {});
  const [columnPinning, setColumnPinning] = useLocalStorage("column-pinning-term", {});
  const [tableSettings, setTableSettings] = useState({
    enableSorting: true,
    enableColumnFilters: true,
    enableFullScreen: false,
    enableRowDense: false,
  });

  const cardRef = useRef();
  const { width: cardWidth } = useBoxSize({ ref: cardRef });
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const columns = generateWeeklyTimeTableColumns();

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
    meta: { setTableSettings },
    filterFns: { fuzzy: fuzzyFilter },
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    autoResetPageIndex,
  });

  useDidUpdate(() => table.resetRowSelection(), [data]);
  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <div className="transition-content grid grid-cols-1 grid-rows-[auto_auto_1fr] px-(--margin-x) py-4">
      <div className="flex items-center justify-between space-x-4">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            Weekly Term Matrix
          </h2>
        </div>
      </div>
      <div className={clsx("flex flex-col pt-4", tableSettings.enableFullScreen && "fixed inset-0 z-61 h-full w-full bg-white pt-3 dark:bg-dark-900")}>        
        <Toolbar table={table} />
        <Card
          className={clsx("relative mt-3 flex grow flex-col", tableSettings.enableFullScreen && "overflow-hidden")}
          ref={cardRef}
        >
          <div className="table-wrapper min-w-full grow overflow-x-auto"
            style={{
              WebkitOverflowScrolling: "touch",
              overscrollBehaviorX: "contain",
              touchAction: "pan-x",
              scrollBehavior: "smooth",
            }}>
            <Table
              hoverable
              dense={tableSettings.enableRowDense}
              sticky={false}
              className="min-w-[1500px] text-left rtl:text-right"
            >
              <THead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Th
                        key={header.id}
                        className={clsx(
                          "bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100 first:ltr:rounded-tl-lg last:ltr:rounded-tr-lg first:rtl:rounded-tr-lg last:rtl:rounded-tl-lg",
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
                            <span className="flex-1">
                              {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                            </span>
                            <TableSortIcon sorted={header.column.getIsSorted()} />
                          </div>
                        ) : header.isPlaceholder ? null : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
                        {header.column.getCanFilter() ? <ColumnFilter column={header.column} /> : null}
                      </Th>
                    ))}
                  </Tr>
                ))}
              </THead>
              <TBody>
                {table.getRowModel().rows.map((row) => (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <Td
                        key={cell.id}
                        className={clsx(
                          "relative",
                          cell.column.getCanPin() && [
                            cell.column.getIsPinned() === "left" && "sticky z-2 ltr:left-0 rtl:right-0",
                            cell.column.getIsPinned() === "right" && "sticky z-2 ltr:right-0 rtl:left-0",
                          ],
                        )}
                      >
                        {cell.column.getIsPinned() && (
                          <div
                            className={clsx(
                              "pointer-events-none absolute inset-0 border-gray-200 dark:border-dark-500",
                              cell.column.getIsPinned() === "left" ? "ltr:border-r rtl:border-l" : "ltr:border-l rtl:border-r",
                            )}
                          ></div>
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
          <div className="px-4 pb-4 sm:px-5 sm:pt-4">
            <PaginationSection table={table} />
          </div>
        </Card>
      </div>
    </div>
  );
}
