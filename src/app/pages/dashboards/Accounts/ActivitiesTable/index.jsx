// src/app/pages/dashboards/Accounts/ActivitiesTable/index.jsx

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useRef, useState, useEffect } from "react";

import { Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { PaginationSection } from "./PaginationSection";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";
import { CollapsibleSearch } from "components/shared/CollapsibleSearch";
import { useSkipper } from "utils/react-table/useSkipper";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useBoxSize, useDidUpdate } from "hooks";
import { SelectedRowsActions } from "components/shared/table/SelectedRowsActions";
import { MenuAction } from "./MenuActions";
import { columns } from "./columns"; // already mapped to your real keys
import { fetchActivities } from "./fetchActivities"; // hits your .NET API

const isSafari = getUserAgentBrowser() === "Safari";

export function ActivitiesTable({ refreshTrigger }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
  const theadRef = useRef();
  const { height: theadHeight } = useBoxSize({ ref: theadRef });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

useEffect(() => {
  fetchActivities()
    .then((data) => setTransactions(data))
    .catch((err) => {
      console.error("Error loading transactions", err);
      setError("Failed to load transactions.");
    })
    .finally(() => setLoading(false));
}, [refreshTrigger]);


  const table = useReactTable({
    data: transactions,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    meta: {
      deleteRow: (row) => {
        skipAutoResetPageIndex();
        setTransactions((old) =>
          old.filter((t) => t.trx_id !== row.original.trx_id)
        );
      },
      deleteRows: (rows) => {
        skipAutoResetPageIndex();
        const idsToDelete = rows.map((r) => r.original.trx_id);
        setTransactions((old) => old.filter((t) => !idsToDelete.includes(t.trx_id)));
      },
    },
    filterFns: { fuzzy: fuzzyFilter },
    globalFilterFn: fuzzyFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    autoResetPageIndex,
  });

  useDidUpdate(() => table.resetRowSelection(), [transactions.length]);

  if (loading) {
    return (
      <div className="mt-6 text-center text-gray-600 dark:text-dark-300">
        Loading transactions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 text-center text-red-500 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="table-toolbar flex items-center justify-between">
        <h2 className="truncate text-base font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Transactions Table
        </h2>
        <div className="flex">
          <CollapsibleSearch
            placeholder="Search here..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <MenuAction />
        </div>
      </div>
      <Card className="relative mt-3">
        <div className="table-wrapper min-w-full overflow-x-auto">
          <Table hoverable className="w-full text-left rtl:text-right">
            <THead ref={theadRef}>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th
                      key={header.id}
                      className="bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100 first:ltr:rounded-tl-lg last:ltr:rounded-tr-lg first:rtl:rounded-tr-lg last:rtl:rounded-tl-lg"
                    >
                      {header.column.getCanSort() ? (
                        <div
                          className="flex cursor-pointer select-none items-center space-x-3"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span className="flex-1">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </span>
                          <TableSortIcon sorted={header.column.getIsSorted()} />
                        </div>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
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
                    "relative border-y border-transparent border-b-gray-200 dark:border-b-dark-500",
                    row.getIsSelected() &&
                      !isSafari &&
                      "row-selected after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  ))}
                </Tr>
              ))}
            </TBody>
          </Table>
        </div>

        {!!table.getCoreRowModel().rows.length && (
          <div className="p-4 sm:px-5">
            <PaginationSection table={table} />
          </div>
        )}
        <SelectedRowsActions table={table} height={theadHeight} />
      </Card>
    </div>
  );
}
