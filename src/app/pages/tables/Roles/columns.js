import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor("id", {
    id: "id",
    header: "Role ID",
    cell: (info) => info.getValue()?.toString() ?? "-",
    filterFn: "fuzzy",
    enableColumnFilter: true, // ✅ Add this
  }),
  columnHelper.accessor("name", {
    id: "name",
    header: "Role Name",
    cell: (info) => info.getValue()?.toString() ?? "-",
    filterFn: "fuzzy",
    enableColumnFilter: true,
  }),
  columnHelper.accessor("tenantName", {
    id: "tenantName",
    header: "Tenant Name",
    cell: (info) => info.getValue()?.toString() ?? "-",
    filterFn: "fuzzy",
    enableColumnFilter: true, // ✅ Add this
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: RowActions,
    meta: {
      align: "center",
    },
    enableColumnFilter: false,
  }),
];
