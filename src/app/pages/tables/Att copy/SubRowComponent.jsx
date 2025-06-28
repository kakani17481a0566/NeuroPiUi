import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  flexRender,
} from "@tanstack/react-table";

import { useState, useEffect } from "react";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";

export default function YourTable() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({}); // ✅ Ensure this exists

  useEffect(() => {
    // Fetch your data and setColumns accordingly
    setData(yourData);
    setColumns(yourColumns);
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
      rowSelection, // ✅ hook into state
    },
    onRowSelectionChange: setRowSelection, // ✅ required to make selection work
    enableRowSelection: true,
    getRowCanSelect: (row) => {
      // ✅ Allow only rows with products (or always allow)
      return row.original.products?.length > 0;
    },

    filterFns: { fuzzy: fuzzyFilter },
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
