import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";
import {
  SelectCell,
  SelectHeader,
} from "components/shared/table/SelectCheckbox";
import {
  StudentNameCell,
  DateCell,
  TimeCell,
  StatusCell,
  UserCell,
} from "./rows";

const columnHelper = createColumnHelper();

function formatHeader(header) {
  if (header === "id" || header.toLowerCase().endsWith("id")) return header.toUpperCase();
  return header
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

export function generateAttendanceColumns(headers) {
  const columns = [
    columnHelper.display({
      id: "select",
      label: "Row Selection",
      header: SelectHeader,
      cell: SelectCell,
    }),
  ];

  headers.forEach((header) => {
    let cell = (info) => info.getValue();
    let filter = "text";
    let filterFn = "includesString";

    switch (header) {
      case "studentName":
        cell = StudentNameCell;
        break;
      case "attendanceDate":
      case "markedOn":
      case "updatedOn":
        cell = DateCell;
        filter = "dateRange";
        filterFn = "inNumberRange";
        break;
      case "fromTime":
      case "toTime":
        cell = TimeCell;
        break;
      case "attendanceStatus":
        cell = StatusCell;
        break;
      case "markedBy":
      case "updatedBy":
        cell = UserCell;
        break;
    }

    columns.push(
      columnHelper.accessor(header, {
        id: header,
        header: formatHeader(header),
        cell,
        filter,
        filterFn,
        enableSorting: true,
        enableColumnFilter: true,
      })
    );
  });

  columns.push(
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: RowActions,
    })
  );

  return columns;
}
