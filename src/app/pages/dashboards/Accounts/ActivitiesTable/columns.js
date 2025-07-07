import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor("Col1", { header: "Transaction ID" }),
  columnHelper.accessor("Col2", { header: "Description" }),
  columnHelper.accessor("Col3", {
    header: "Transaction Date",
    cell: info => info.getValue() ? new Date(info.getValue()).toLocaleDateString() : "-",
  }),
  columnHelper.accessor("Col4", { header: "Amount" }),
  columnHelper.accessor("Col5", { header: "Reference ID" }),
  // For nested Col6.accName fallback to "-"
//   columnHelper.accessor(row => row.Col6?.accName ?? "-", {
//     id: "accountName",
//     header: "Account Name",
//   }),
//   columnHelper.accessor("Col7", { header: "Account Name Label" }),
//   columnHelper.accessor("Col8", { header: "Account Type" }),
//   columnHelper.accessor("Col9", { header: "Bank Name", cell: info => info.getValue() || "-" }),
//   columnHelper.accessor("Col10", { header: "Branch", cell: info => info.getValue() || "-" }),
//   columnHelper.accessor("Col11", { header: "IFSC Code", cell: info => info.getValue() || "-" }),
//   columnHelper.accessor("Col12", { header: "Transaction Type" }),
//   columnHelper.accessor("Col13", { header: "Transaction Mode" }),
//   columnHelper.accessor("Col14", { header: "Status" }),
//   columnHelper.accessor("Col15", { header: "Account Head" }),
//   columnHelper.accessor("Col16", { header: "Created By" }),
//   columnHelper.accessor("Col17", {
//     header: "Created On",
//     cell: info => info.getValue() ? new Date(info.getValue()).toLocaleString() : "-",
//   }),
//   columnHelper.accessor("Col18", { header: "Tenant ID" }),
];
