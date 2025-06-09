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
 ACTION: "actions", // ✅ Already present
};

/**
 * Generate column definitions based on headers from API
 * Adds `.columnClassName` meta for custom tailwind-based styling
 */
export function generateWeeklyTimeTableColumns(headers) {
  return [
    ...headers.map((header, index) => {
      const headerLines = header.split("\n");
      const code = headerLines[1]?.replace(/[()]/g, "").trim().toUpperCase(); // Extract PSED, CLL etc.
      const className = headerClassMap[code] || ""; // fallback to empty

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
              createElement("div", { key: i }, line.trim())
            )
          ),
        cell: (info) => {
          const value = info.getValue();
          if (!value || typeof value !== "string") return null;

          const lines = value.split(/,\s*|\n/).filter(Boolean);
          return createElement(
            Fragment,
            {},
            ...lines.map((line, i) =>
              createElement("div", { key: i }, line.trim())
            )
          );
        },
      };
    }),

    // Add optional action column
    columnHelper.display({
      id: "actions",
      label: "Row Actions",
      header: "Actions",
      cell: RowActions,
      meta: {
    columnClassName: "actions", // ✅ Add this line
  },
    }),
  ];
}
