// columns.js

// Import Dependencies
import React from "react"; // ✅ Required for JSX
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";

// Create Column Helper
const columnHelper = createColumnHelper();

/**
 * Generates columns based on headers array.
 * Appends RowActions column at the end.
 * @param {string[]} headers
 * @returns {array}
 */
export function generateWeeklyTimeTableColumns(headers) {
  console.log("✅ Generating columns with headers:", headers);

  const dynamicColumns = [headers.map((header, index) =>
    columnHelper.accessor(`column${index + 1}`, {
      id: `column${index + 1}`,
      header: header,
      cell: (info) => info.getValue(),
    })
  ),
columnHelper.display({
        id: "actions",
        label: "Row Actions",
        header: "Actions",
        cell: RowActions
    })
];

  // Append RowActions column
  dynamicColumns.push(
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row, table }) => <RowActions row={row} table={table} />,
      enableSorting: false,
      enableColumnFilter: false,
    })
  );

  return dynamicColumns;
}
