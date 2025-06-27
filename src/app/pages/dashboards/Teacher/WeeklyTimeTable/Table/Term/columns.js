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
            ...header
              .split("/")
              .map((line, i) => createElement("div", { key: i }, line.trim())),
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
                  textClass = "text-[#713427] font-bold";
                } else if (trimmed.startsWith("FT:")) {
                  textClass = "text-[#E27257] font-bold";
                } else if (trimmed.startsWith("NR:")) {
                  textClass = "text-[#B14434] font-bold";
                } else if (trimmed.startsWith("ET:")) {
                  textClass = "text-[#52AA97] font-bold";
                }

                return createElement(
                  "div",
                  { key: i, className: textClass },
                  trimmed,
                );
              }),
          );
        },
      }),
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
