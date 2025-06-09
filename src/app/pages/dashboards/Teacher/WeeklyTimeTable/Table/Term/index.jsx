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
import { Fragment, useEffect, useRef, useState } from "react";

// Local
import { Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { useLocalStorage, useLockScrollbar, useDidUpdate } from "hooks";
import { Toolbar } from "./Toolbar";
import { SelectedRowsActions } from "./SelectedRowsActions";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useSkipper } from "utils/react-table/useSkipper";

import { fetchWeeklyMatrixData } from "./data"; // ✅ Your updated data.js
import { generateTermColumns } from "./columns"; // ✅ Your updated columns.js
import { useThemeContext } from "app/contexts/theme/context";

const isSafari = getUserAgentBrowser() === "Safari";

export default function Term() {
  const { cardSkin } = useThemeContext();
  const [autoResetPageIndex] = useSkipper();

  const [orders, setOrders] = useState([]);
  const [columns, setColumns] = useState([]);

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
        const { headers, dataTerm } = await fetchWeeklyMatrixData(1, 1, 1); // 📌 pass tenantId, courseId, termId
        setColumns(generateTermColumns(headers));
        setOrders(dataTerm);
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
      <div
        className={clsx(
          "flex flex-col pt-4",
          tableSettings.enableFullScreen &&
            "fixed inset-0 z-61 h-full w-full bg-white pt-3 dark:bg-dark-900"
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
                          ]
                        )}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
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
                            ]
                          )}
                        >
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
