import { Button, Card, Table, TBody, Tr, Td } from "components/ui";
import { PaginationSection } from "./PaginationSection";
import { SelectedRowsActions } from "./SelectedRowsActions";
import { useState, useEffect } from "react";
import { fetchStudents } from "app/pages/dashboards/Teacher/Students/data";
import { flexRender, useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel } from "@tanstack/react-table";
import { columns } from "./columns";
import clsx from "clsx";


import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";
const isSafari = getUserAgentBrowser() === "Safari";






export function Students() {
  const [students, setStudents] = useState([]);
  useEffect(() => {
    async function loadStudents() {
      const data = await fetchStudents();
      console.log(data);
      setStudents(data);
    }
    loadStudents()
  }, []);

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleSave = () => {
    const selected = students.getSelectedRowModel().rows.map(row => row.original);
    console.log("Selected Students:", selected);
    // TODO: call save API or logic here
  };
  const table = useReactTable({
    data: students,
    columns,
    // state: {
    //   sorting,
    //   globalFilter,
    // },
    // onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <Card className="flex flex-col">
      {/* 🆕 Top Section with Course and Date */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-dark-500">
        <div>
          <h2 className="text-lg font-semibold">Course: Nursery</h2>
          <p className="text-sm text-gray-600">{currentDate}</p>
        </div>
        <Button onClick={handleSave} className="ml-auto">Save</Button>
      </div>

      {/* 👇 Table */}
      <div className="relative mt-5">
        <div className="table-wrapper min-w-full overflow-x-auto">
          <Table hoverable className="w-full text-left rtl:text-right">
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  ))}
                </Tr>
              ))}
            </TBody>
          </Table>
        </div>

        <SelectedRowsActions table={table} />
        {table.getCoreRowModel().rows.length > 0 && (
          <div className="p-4 sm:px-5">
            <PaginationSection table={table} />
          </div>
        )}
      </div>
    </Card>
  );
}
