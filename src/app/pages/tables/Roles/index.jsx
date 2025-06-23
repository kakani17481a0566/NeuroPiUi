// --- [IMPORTS] ---
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
import { Fragment, useEffect, useRef, useState } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";

import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { ColumnFilter } from "components/shared/table/ColumnFilter";
import { PaginationSection } from "components/shared/table/PaginationSection";
import { Button, Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { useBoxSize, useLockScrollbar, useLocalStorage, useDidUpdate } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useSkipper } from "utils/react-table/useSkipper";
import { SelectedRowsActions } from "./SelectedRowsActions";
import { SubRowComponent } from "./SubRowComponent";
import { columns } from "./columns";
import { fetchRoles } from "./data";
import { Toolbar } from "./Toolbar";
import { useThemeContext } from "app/contexts/theme/context";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";
import { Right } from "./Right";

const isSafari = getUserAgentBrowser() === "Safari";

export default function Roles() {
  const { cardSkin } = useThemeContext();
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);

  const refetchData = async () => {
    const data = await fetchRoles(1);
    setRoles(data);
  };

  const handleCreateRole = () => {
    setSelectedRole(null);
    setEditMode(false);
    setViewMode(false);
    setDrawerOpen(true);
  };

  const [tableSettings, setTableSettings] = useState({
    enableSorting: true,
    enableColumnFilters: true,
    enableFullScreen: false,
    enableRowDense: false,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useLocalStorage("column-visibility-roles", {});
  const [columnPinning, setColumnPinning] = useLocalStorage("column-pinning-roles", {});

  const cardRef = useRef();
  const { width: cardWidth } = useBoxSize({ ref: cardRef });

  useEffect(() => {
    refetchData();
  }, []);

  const table = useReactTable({
    data: roles,
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
      deleteRow: (row) => {
        skipAutoResetPageIndex();
        setRoles((prev) => prev.filter((r) => r.id !== row.original.id));
      },
      deleteRows: (rows) => {
        skipAutoResetPageIndex();
        const rowIds = rows.map((r) => r.original.id);
        setRoles((prev) => prev.filter((r) => !rowIds.includes(r.id)));
      },
      setDrawerOpen,
      setSelectedRole,
      setEditMode: (flag) => setEditMode(flag),
      setViewMode,
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
    getRowCanExpand: () => true,
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    autoResetPageIndex,
  });

  useDidUpdate(() => table.resetRowSelection(), [roles]);
  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <div className="transition-content grid grid-cols-1 grid-rows-[auto_auto_1fr] px-4 py-4">
      <div className="flex items-center justify-between space-x-4">
        <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
          Roles
        </h2>
        <Button className="h-10 px-4 text-sm" color="primary" onClick={handleCreateRole}>
          <PlusIcon className="size-5" />
          <span>New Role</span>
        </Button>
      </div>

      <div
        className={clsx(
          "flex flex-col pt-4",
          tableSettings.enableFullScreen && "fixed inset-0 z-61 h-full w-full bg-white pt-3 dark:bg-dark-900"
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
          <div
            className="table-wrapper min-w-full grow overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-dark-500 scroll-smooth"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <Table
              hoverable
              dense={tableSettings.enableRowDense}
              sticky={tableSettings.enableFullScreen}
              className="w-full text-left rtl:text-right"
            >
              <THead>
                {table.getHeaderGroups().map((group) => (
                  <Tr key={group.id}>
                    {group.headers.map((header) => (
                      <Th
                        key={header.id}
                        className={clsx(
                          "border-b border-gray-300 dark:border-dark-500 bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100",
                          header.column.getCanPin() && [
                            header.column.getIsPinned() === "left" && "sticky z-2 ltr:left-0 rtl:right-0",
                            header.column.getIsPinned() === "right" && "sticky z-2 ltr:right-0 rtl:left-0",
                          ]
                        )}
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center space-x-2">
                            {header.column.getCanSort() ? (
                              <button
                                type="button"
                                onClick={header.column.getToggleSortingHandler()}
                                className="flex items-center space-x-1 focus:outline-none"
                              >
                                <span className="truncate">
                                  {flexRender(header.column.columnDef.header, header.getContext())}
                                </span>
                                <TableSortIcon sorted={header.column.getIsSorted()} />
                              </button>
                            ) : (
                              <span className="truncate">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                              </span>
                            )}
                          </div>

                          {header.column.getCanFilter() && (
                            <div className="mt-1">
                              <ColumnFilter column={header.column} />
                            </div>
                          )}
                        </div>
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
                        row.getIsSelected() &&
                          !isSafari &&
                          "row-selected after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500"
                      )}
                    >
                      {row.getVisibleCells().map((cell, index) => (
                        <Td
                          key={cell.id}
                          className={clsx(
                            "table-td",
                            cardSkin === "shadow-sm" ? "dark:bg-dark-700" : "dark:bg-dark-900",
                            index === 0 && "border-r border-gray-300 dark:border-dark-500",
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
                    {row.getIsExpanded() && (
                      <tr>
                        <td colSpan={row.getVisibleCells().length} className="p-0">
                          <SubRowComponent row={row} cardWidth={cardWidth} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </TBody>
            </Table>
          </div>

          <SelectedRowsActions table={table} />
          {table.getCoreRowModel().rows.length > 0 && (
            <div
              className={clsx(
                "px-4 pb-4 sm:px-5 sm:pt-4",
                tableSettings.enableFullScreen && "bg-gray-50 dark:bg-dark-800",
                !(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && "pt-4"
              )}
            >
              <PaginationSection table={table} />
            </div>
          )}
        </Card>
      </div>

      <Right
        isOpen={isDrawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditMode(false);
          setViewMode(false);
        }}
        role={selectedRole}
        isEditMode={isEditMode}
        viewMode={viewMode}
        onSave={() => {
          refetchData();
          setDrawerOpen(false);
          setEditMode(false);
          setViewMode(false);
        }}
      />
    </div>
  );
}
