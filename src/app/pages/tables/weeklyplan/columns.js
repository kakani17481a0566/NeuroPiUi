// columns.js
import { createColumnHelper } from "@tanstack/react-table";
import {
  WeekCell,
  FairyTaleCell,
  MondayCell,
  TuesdayCell,
  WednesdayCell,
  ThursdayCell,
  FridayCell,
  SaturdayCell,
  RowActions,
} from "./rows";

// Create a column helper instance for typed column definitions
const columnHelper = createColumnHelper();

// Define your columns array
export const columns = [
  // Week column
  columnHelper.accessor("week", {
    header: "WEEK",
    cell: WeekCell, // Custom cell renderer for Week
  }),

  // Fairy Tale column
  columnHelper.accessor("fairyTale", {
    header: "FAIRY TALE",
    cell: FairyTaleCell, // Custom cell renderer for Fairy Tale
  }),

  // Days columns with their respective custom cell renderers
  columnHelper.accessor("mondayActivity", {
    header: "MONDAY",
    cell: MondayCell,
  }),
  columnHelper.accessor("tuesdayActivity", {
    header: "TUESDAY",
    cell: TuesdayCell,
  }),
  columnHelper.accessor("wednesdayActivity", {
    header: "WEDNESDAY",
    cell: WednesdayCell,
  }),
  columnHelper.accessor("thursdayActivity", {
    header: "THURSDAY",
    cell: ThursdayCell,
  }),
  columnHelper.accessor("fridayActivity", {
    header: "FRIDAY",
    cell: FridayCell,
  }),
  columnHelper.accessor("saturdayActivity", {
    header: "SATURDAY",
    cell: SaturdayCell,
  }),

  // Actions column with buttons like edit/delete using RowActions component
  columnHelper.display({
    id: "actions",
    header: "ACTIONS",
    cell: RowActions, // Renders action buttons for each row
  }),
];
