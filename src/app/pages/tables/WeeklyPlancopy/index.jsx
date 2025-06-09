import { useEffect, useState, useRef, Fragment } from "react";
import clsx from "clsx";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
} from "@tanstack/react-table";
import { PlusIcon } from "@heroicons/react/20/solid";

import { Button, Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { Toolbar } from "./Toolbar";
import { SelectedRowsActions } from "./SelectedRowsActions";
import { useLockScrollbar, useLocalStorage, useDidUpdate } from "hooks";
import { fetchTimeTableRawData, transformTimeTableDataForGrid } from "./data";
import { TopicWorksheetCell } from "./rows";
import { useSkipper } from "utils/react-table/useSkipper";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
// import { useThemeContext } from "app/contexts/theme/context";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";
import { ColumnFilter } from "components/shared/table/ColumnFilter";
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { PaginationSection } from "components/shared/table/PaginationSection";

const isSafari = getUserAgentBrowser() === "Safari";

export default function WeeklyPlan() {
  // const { cardSkin } = useThemeContext(); // Theme colors for dark/light modes
  const cardRef = useRef();

  const [timeTableRows, setTimeTableRows] = useState([]);
  const [orderedSubjects, setOrderedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Skip resetting page index on some table updates for UX
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  // Table configuration, you can simplify this for User List
  const [tableSettings, setTableSettings] = useState({
    enableSorting: true,
    enableColumnFilters: true,
    enableFullScreen: false,
    enableRowDense: true, 
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  // Save column visibility/pinning in local storage
  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "column-visibility-weeklyplan",
    {}
  );
  const [columnPinning, setColumnPinning] = useLocalStorage(
    "column-pinning-weeklyplan",
    {}
  );

  // Fetch data once on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const rawData = await fetchTimeTableRawData();
        const { tableRows, orderedSubjects } = transformTimeTableDataForGrid(rawData);
        setTimeTableRows(tableRows);
        setOrderedSubjects(orderedSubjects);
      } catch (error) {
        console.error("Error fetching timetable:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Define columns, User List may have simpler columns here
  const columns = [
    {
      accessorKey: "dayName",
      header: "DAYS",
      cell: ({ getValue }) => <span className="font-semibold">{getValue()}</span>,
      enablePinning: true,
      enableSorting: true,
      enableColumnFilter: true,
    },
    ...orderedSubjects.map(([code, name]) => ({
      accessorKey: code,
      header: `${name} (${code})`,
      cell: ({ row }) => <TopicWorksheetCell data={row.original[code]} />,
      enableSorting: false,
      enableColumnFilter: false,
    })),
  ];

  // Create table instance
  const table = useReactTable({
    data: timeTableRows,
    columns,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      columnPinning,
      tableSettings,
    },
    enableSorting: tableSettings.enableSorting,
    enableColumnFilters: tableSettings.enableColumnFilters,
    enableRowSelection: true,
    filterFns: { fuzzy: fuzzyFilter },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    autoResetPageIndex,
    meta: {
      setTableSettings,
      // Row deletion handlers - could remove if not needed in User List
      deleteRow: (row) => {
        skipAutoResetPageIndex();
        setTimeTableRows((prev) =>
          prev.filter((oldRow) => oldRow.dayName !== row.original.dayName)
        );
      },
      deleteRows: (rows) => {
        skipAutoResetPageIndex();
        const rowNames = rows.map((row) => row.original.dayName);
        setTimeTableRows((prev) => prev.filter((row) => !rowNames.includes(row.dayName)));
      },
    },
  });

  // Reset row selection when data changes
  useDidUpdate(() => table.resetRowSelection(), [timeTableRows]);
  useLockScrollbar(tableSettings.enableFullScreen);

  if (loading) {
    // Simple loader spinner during data fetch
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="transition-content grid grid-cols-1 grid-rows-[auto_1fr] px-(--margin-x) py-4">
      {/* Header with title and Add button */}
      <div className="flex items-center justify-between space-x-4">
        <h1 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
          Weekly Plan
        </h1>
        <Button className="h-8 space-x-1.5 rounded-md px-3 text-xs" color="primary">
          <PlusIcon className="w-5 h-5" />
          <span>Add Entry</span>
        </Button>
      </div>

      {/* Main table container */}
      <div
        className={clsx(
          "flex flex-col pt-4",
          tableSettings.enableFullScreen &&
            "fixed inset-0 z-61 h-full w-full bg-white pt-3 dark:bg-dark-900"
        )}
      >
        <Toolbar table={table} /> {/* Toolbar with filters, etc. */}

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
              dense={tableSettings.enableRowDense} // User List might want to set dense={false}
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
                          "bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100 first:ltr:rounded-tl-lg last:ltr:rounded-tr-lg first:rtl:rounded-tr-lg last:rtl:rounded-tl-lg",
                          header.column.getCanPin() && [
                            header.column.getIsPinned() === "left" &&
                              "sticky z-2 ltr:left-0 rtl:right-0",
                            header.column.getIsPinned() === "right" &&
                              "sticky z-2 ltr:right-0 rtl:left-0",
                          ]
                        )}
                      >
                        {header.column.getCanSort() ? (
                          <div
                            className="flex cursor-pointer select-none items-center space-x-3"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <span className="flex-1">
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </span>
                            <TableSortIcon sorted={header.column.getIsSorted()} />
                          </div>
                        ) : flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanFilter() && (
                          <ColumnFilter column={header.column} />
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
                        "relative border-y border-transparent border-b-gray-200 dark:border-b-dark-500",
                        row.getIsSelected() &&
                          !isSafari &&
                          "row-selected after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500"
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <Td
                          key={cell.id}
                          className={clsx(
                            "relative",
                            // cardSkin === "shadow-sm"
                            //   ? "dark:bg-dark-700"
                            //   : "dark:bg-dark-900",
                            cell.column.getCanPin() && [
                              cell.column.getIsPinned() === "left" &&
                                "sticky z-2 ltr:left-0 rtl:right-0",
                              cell.column.getIsPinned() === "right" &&
                                "sticky z-2 ltr:right-0 rtl:left-0",
                            ]
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

          <SelectedRowsActions table={table} /> {/* Selected row actions (delete, etc.) */}

          {table.getCoreRowModel().rows.length > 0 && (
            <div
              className={clsx(
                "px-4 pb-4 sm:px-5 sm:pt-4",
                tableSettings.enableFullScreen && "bg-gray-50 dark:bg-dark-800",
                !(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && "pt-4"
              )}
            >
              <PaginationSection table={table} /> {/* Pagination controls */}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
