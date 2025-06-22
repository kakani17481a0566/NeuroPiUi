import { createElement, Fragment } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";

const columnHelper = createColumnHelper();

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
            ...String(value)
              .split(",")
              .map((line, i) => {
                const trimmed = line.trim();
                let textClass = "";

                if (trimmed.startsWith("AS:")) {
                  textClass = "text-purple-600 font-semibold";
                } else if (trimmed.startsWith("FT:")) {
                  textClass = "text-yellow-600 font-semibold";
                } else if (trimmed.startsWith("NR:")) {
                  textClass = "text-green-600 font-semibold";
                } else if (trimmed.startsWith("ET:")) {
                  textClass = "text-red-600 font-semibold";
                }

                return createElement(
                  "div",
                  { key: i, className: textClass },
                  trimmed
                );
              })
          );
        },
      })
    ),

    // Uncomment if actions are needed
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: RowActions,
      enableSorting: false,
      enableColumnFilter: false,
    }),
  ];
}
