// columns.js

import { createElement, Fragment } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";

const columnHelper = createColumnHelper();

/**
 * Generates column definitions for the Weekly Term Table.
 * - Header is split by `/` for multi-line.
 * - Cell values are split by ", " for multi-line display.
 *
 * @param {string[]} headers
 * @returns {Array}
 */
export function generateTermColumns(headers) {
  return [
    ...headers.map((header, index) =>
      columnHelper.accessor(`coluM${index + 1}`, {
        id: `coluM${index + 1}`,
        header: () =>
          createElement(
            Fragment,
            null,
            ...header.split("/").map((line, i) =>
              createElement("div", { key: i }, line.trim())
            )
          ),
        cell: (info) => {
          const value = info.getValue();
          if (!value) return null;

          return createElement(
            Fragment,
            null,
            ...value.split(", ").map((line, i) =>
              createElement("div", { key: i }, line.trim())
            )
          );
        },
      })
    ),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: RowActions,
      enableSorting: false,
      enableColumnFilter: false,
    }),
  ];
}
