import { createElement, Fragment } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";

const columnHelper = createColumnHelper();

const headerClassMap = {
  PSED: "psed",
  CLL: "cll",
  PSRN: "psrn",
  KUW: "kuw",
  PD: "pd",
  EAD: "ead",
  DAYS: "days",
  ACTION: "actions",
};

/**
 * Generate column definitions based on headers from API
 * Adds `.columnClassName` meta for custom tailwind-based styling
 * Applies color styling based on cell prefix (AS:, FT:, NR:)
 */
export function generateWeeklyTimeTableColumns(headers) {
  return [
    ...headers.map((header, index) => {
      const headerLines = header
        .split(/\n|&/)
        .map((line) => line.trim())
        .filter(Boolean);

      const code = headerLines[1]?.replace(/[()]/g, "").trim().toUpperCase();
      const className = headerClassMap[code] || "";

      return {
        id: `column${index + 1}`,
        accessorKey: `column${index + 1}`,
        meta: {
          columnClassName: className,
        },
        header: () =>
          createElement(
            Fragment,
            {},
            ...headerLines.map((line, i) =>
              createElement("div", { key: i }, line)
            )
          ),
        cell: (info) => {
          const value = info.getValue();
          if (!value || typeof value !== "string") return null;

          const lines = value.split(/,\s*|\n/).filter(Boolean);
          return createElement(
            Fragment,
            {},
            ...lines.map((line, i) => {
              const trimmed = line.trim();
              let textClass = "";

              if (trimmed.startsWith("AS:")) {
                textClass = "text-purple-600 font-semibold";
              } else if (trimmed.startsWith("FT:")) {
                textClass = "text-yellow-600 font-semibold";
              } else if (trimmed.startsWith("NR:")) {
                textClass = "text-green-600 font-semibold";
              }
             else if (trimmed.startsWith("ET:")) {
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
      };
    }),

    // Optional row action column
    columnHelper.display({
      id: "actions",
      label: "Row Actions",
      header: "Actions",
      cell: RowActions,
    }),
  ];
}
