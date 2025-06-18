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
import { Box, Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { useLocalStorage, useLockScrollbar, useDidUpdate } from "hooks";
import { Toolbar } from "./Toolbar";
import { SelectedRowsActions } from "./SelectedRowsActions";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useSkipper } from "utils/react-table/useSkipper";

import { fetchWeeklyMatrixData } from "./data"; // ✅ API call
import { generateTermColumns } from "./columns"; // ✅ Column generation
import { useThemeContext } from "app/contexts/theme/context";
import Roles from "app/pages/tables/Roles";


const isSafari = getUserAgentBrowser() === "Safari";

export default function Term() {
  const { cardSkin } = useThemeContext();
  const [autoResetPageIndex] = useSkipper();

  const [orders, setOrders] = useState([]);
  const [columns, setColumns] = useState([]);
  const [month, setMonth] = useState("");

  // ✅ New parsed metadata state
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

  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "term-column-visibility",
    {}
  );
  const [columnPinning, setColumnPinning] = useLocalStorage(
    "term-column-pinning",
    {}
  );

  const cardRef = useRef();

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetchWeeklyMatrixData(1, 1, 1); // tenantId, courseId, termId
        const { headers, dataTerm, month } = response;

        setColumns(generateTermColumns(headers));
        setOrders(dataTerm);
        setMonth(month);

        // ✅ Split the month string
        if (month) {
          const parts = month.split(" ");
          if (parts.length >= 6) {
            setAcademicYear(`${parts[0]} ${parts[1]} ${parts[2]}`); // e.g. "Academic Year 2025-26"
            setTerm(`${parts[3]} ${parts[4]}`); // e.g. "Term 1"
            setDateRange(parts.slice(5).join(" ")); // e.g. "2025-06-09 - 2025-08-29"
          }
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
      <div
        className={clsx(
          "flex flex-col pt-4",
          tableSettings.enableFullScreen &&
            "dark:bg-dark-900 fixed inset-0 z-61 h-full w-full bg-white pt-3"
        )}
      >
        {/* ✅ Formatted Academic Term Info Box */}
{month && (
  <Box className="w-full mb-4 rounded-lg  bg-gray-200 dark:bg-dark-500 px-4 py-3">
    <div className="flex flex-col items-center justify-center space-y-1 text-center">
      <div className="text-base font-semibold text-primary-500 dark:text-primary-400">
        {academicYear}
      </div>
      <div className="text-base font-semibold text-gray-800 dark:text-dark-100">
        {term}
      </div>
      <div className="text-sm font-medium text-gray-800 dark:text-dark-100">
        {dateRange}
      </div>
    </div>
  </Box>
)}

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
                          "dark:bg-dark-800 dark:text-dark-100 bg-gray-200 font-semibold text-gray-800 uppercase",
                          header.column.getCanPin() && [
                            header.column.getIsPinned() === "left" &&
                              "sticky z-2 ltr:left-0 rtl:right-0",
                            header.column.getIsPinned() === "right" &&
                              "sticky z-2 ltr:right-0 rtl:left-0",
                          ]
                        )}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
                        "dark:border-b-dark-500 relative border-y border-transparent border-b-gray-200",
                        row.getIsExpanded() && "border-dashed",
                        row.getIsSelected() &&
                          !isSafari &&
                          "row-selected after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500 after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent"
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <Td
                          key={cell.id}
                          className={clsx(
                            "relative",
                            cardSkin === "shadow-sm"
                              ? "dark:bg-dark-700"
                              : "dark:bg-dark-900",
                            cell.column.getCanPin() && [
                              cell.column.getIsPinned() === "left" &&
                                "sticky z-2 ltr:left-0 rtl:right-0",
                              cell.column.getIsPinned() === "right" &&
                                "sticky z-2 ltr:right-0 rtl:left-0",
                            ]
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
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
      <Roles />
    </div>
  );
}
