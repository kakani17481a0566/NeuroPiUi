// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";
import {
    SelectCell,
    SelectHeader,
} from "components/shared/table/SelectCheckbox";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
    columnHelper.display({
        id: "select",
        label: "Row Selection",
        header: SelectHeader,
        cell: SelectCell,
    }),
    columnHelper.accessor((row) => row.column1, {
        id: "column1",
        label: "Day",
        header: "Day",
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.column2, {
        id: "column2",
        label: "Period 1",
        header: "Period 1",
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.column3, {
        id: "column3",
        label: "Period 2",
        header: "Period 2",
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.column4, {
        id: "column4",
        label: "Period 3",
        header: "Period 3",
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.column5, {
        id: "column5",
        label: "Period 4",
        header: "Period 4",
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.column6, {
        id: "column6",
        label: "Period 5",
        header: "Period 5",
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.column7, {
        id: "column7",
        label: "Period 6",
        header: "Period 6",
        cell: (info) => info.getValue(),
    }),
    columnHelper.display({
        id: "actions",
        label: "Row Actions",
        header: "Actions",
        cell: RowActions,
    }),
];
