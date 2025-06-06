// columns.js
import { createColumnHelper } from "@tanstack/react-table";
import { UserIdCell, UsernameCell, NameCell, EmailCell, MobileCell, StatusCell } from "./rows";
import { RowActions } from "./RowActions";
// import { SelectCell, SelectHeader } from "components/shared/table/SelectCheckbox";

const columnHelper = createColumnHelper();

export const columns = [
  // columnHelper.display
  //   id: "select",
  //   label: "Row Selection",
  //   header: SelectHeader,
  //   cell: SelectCell,
  // }),
  columnHelper.accessor(row => row.userId, {
    id: "userId",
    header: "Week",
    cell: UserIdCell,
  }),
  columnHelper.accessor(row => row.username, {
    id: "username",
    header:"Fairy Tale ",
    cell: UsernameCell,
  }),
  columnHelper.accessor(row => ({
    firstName: row.firstName,
    middleName: row.middleName,
    lastName: row.lastName,
  }), {
    id: "fullName",
    header: "MONDAY",
    cell: NameCell,
  }),
  columnHelper.accessor(row => row.email, {
    id: "email",
    header: "TUESDAY",
    cell: EmailCell,
  }),
  columnHelper.accessor(row => row.mobileNumber, {
    id: "mobileNumber",
    header: "WEDNESDAY",
    cell: MobileCell,
  }),
  columnHelper.accessor(row => row.status, {
    id: "status",
    header: "THURSDAY",
    cell: StatusCell,
  }),
  columnHelper.display({
    id: "actions",
    header: "SATURDAY",
    cell: RowActions,
  }),
];