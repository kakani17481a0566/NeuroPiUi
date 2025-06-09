// index.jsx
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

import {
  Card, Table, THead, TBody, Th, Tr, Td
} from "components/ui";
import {
  useLockScrollbar,
  useLocalStorage,
  useDidUpdate,
} from "hooks";
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
        const { headers, timeTableData } = await fetchWeeklyTimeTableData();
        console.log("Fetched headers:", headers);

        const generatedColumns = generateWeeklyTimeTableColumns(headers);
        setColumns(generatedColumns);
        setOrders(timeTableData);
      } catch (err) {
        console.error("Failed to fetch timetable data:", err);
      }
    };
    fetchData();
  }, []);

  const table = useReactTable({
    data: orders,
    columns: columns,
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
      <div className={clsx("flex flex-col pt-4", tableSettings.enableFullScreen && "fixed inset-0 z-61 h-full w-full bg-white pt-3 dark:bg-dark-900")}> 
        <Toolbar table={table} />
        <Card className={clsx("relative mt-3 flex grow flex-col", tableSettings.enableFullScreen && "overflow-hidden")} ref={cardRef}>
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
                          "table-th",
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
                  <Fragment key={row.id}>
                    <Tr
                      className={clsx(
                        "table-tr",
                        row.getIsExpanded() && "is-expanded",
                        row.getIsSelected() && !isSafari && "row-selected"
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <Td
                          key={cell.id}
                          className={clsx(
                            "table-td",
                            cardSkin === "shadow-sm" ? "skin-shadow-sm" : "skin-shadow",
                            cell.column.columnDef.meta?.columnClassName,
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
                  </Fragment>
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