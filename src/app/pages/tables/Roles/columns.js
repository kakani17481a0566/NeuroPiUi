// columns.js

import { createColumnHelper } from "@tanstack/react-table";
import { SelectCell, SelectHeader } from "components/shared/table/SelectCheckbox";
import { RowActions } from "./RowActions";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.display({
    id: "select",
    label: "Row Selection",
    header: SelectHeader,
    cell: SelectCell,
  }),
  columnHelper.accessor("id", {
    id: "id",
    header: "Role ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("name", {
    id: "name",
    header: "Role Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("tenantId", {
    id: "tenantId",
    header: "Tenant ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: RowActions,
  }),
];
