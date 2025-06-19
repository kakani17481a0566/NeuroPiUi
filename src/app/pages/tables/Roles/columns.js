import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";

const columnHelper = createColumnHelper();

export const columns = [
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
  columnHelper.accessor("tenantName", {
    id: "tenantName",
    header: "Tenant Name", // ✅ New Column
    cell: (info) => info.getValue(),
  }),
  // Optional: Keep tenantId if needed
  // columnHelper.accessor("tenantId", {
  //   id: "tenantId",
  //   header: "Tenant ID",
  //   cell: (info) => info.getValue(),
  // }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: RowActions,
  }),
];
