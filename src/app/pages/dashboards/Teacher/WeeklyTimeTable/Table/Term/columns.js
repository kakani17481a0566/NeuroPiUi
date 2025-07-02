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
       if (trimmed.startsWith("AS:") || trimmed.startsWith("Action Song")) {
  textClass = "text-[#713427] font-bold";
} else if (trimmed.startsWith("FT:") || trimmed.startsWith("Fairytale")) {
  textClass = "text-[#E27257] font-bold";
} else if (trimmed.startsWith("NR:") || trimmed.startsWith("Nursery Rhyme")) {
  textClass = "text-[#B14434] font-bold";
} else if (trimmed.startsWith("ET:") || trimmed.startsWith("Event")) {
  textClass = "text-[#52AA97] font-bold";
} else if (trimmed.startsWith("PL:") || trimmed.startsWith("PHONICS LAB")) {
  textClass = "text-[#83CAE6] font-bold";
} else if (trimmed.startsWith("SL:") || trimmed.startsWith("SCIENCE LAB")) {
  textClass = "text-[#8FD1E6] font-bold";
} else if (trimmed.startsWith("AL:") || trimmed.startsWith("ART LAB")) {
  textClass = "text-[#437EB4] font-bold";
} else if (trimmed.startsWith("ML:") || trimmed.startsWith("MATH LAB")) {
  textClass = "text-[#2F469A] font-bold";
} else if (trimmed.startsWith("ST:") || trimmed.startsWith("Story Time")) {
  textClass = "text-[#465C8A] font-bold";
} else if (trimmed.startsWith("LAB:") || trimmed.startsWith("LAB")) {
  textClass = "text-[#3366] font-bold";
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
