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
