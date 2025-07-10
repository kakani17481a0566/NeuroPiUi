// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";
// import {
//     SelectCell,
//     SelectHeader,
// } from "components/shared/table/SelectCheckbox";
import {
    CustomerCell,
    // DateCell,
    OrderIdCell,
    ParentNameCell,
    CourseNameCell,
    PhoneNumerCell
    // OrderStatusCell,
    // ProfitCell,
       // TotalCell,
} from "./rows";
// import { CourseNameCell } from "../../Teacher/MediaTable/rows";
// import { orderStatusOptions } from "./data";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
    // columnHelper.display({
    //     id: "select",
    //     label: "Row Selection",
    //     header: SelectHeader,
    //     cell: SelectCell,
    // }),
    columnHelper.accessor((row) => row.studentId, {
        id: "studentId",
        label: "Order ID",
        header: "Student ID",
        cell: OrderIdCell,
    }),
    // columnHelper.accessor((row) => Number(row.created_at), {
    //     id: "created_at",
    //     label: "Order Date",
    //     header: "Date",
    //     cell: DateCell,
    //     filter: "dateRange",
    //     filterFn: "inNumberRange",
    // }),
    columnHelper.accessor((row) => row.studentName, {
        id: "studentName",
        label: "studentName",
        header: "Student Name",
        cell: CustomerCell,
    }),
    // columnHelper.accessor((row) => row.total, {
    //     id: "total",
    //     label: "Total",
    //     header: "Total",
    //     filterFn: "inNumberRange",
    //     filter: "numberRange",
    //     cell: TotalCell,
    // }),
    // columnHelper.accessor((row) => row.profit, {
    //     id: "profit",
    //     label: "Profit",
    //     header: "Profit",
    //     filterFn: "inNumberRange",
    //     filter: "numberRange",
    //     cell: ProfitCell,
    // }),
    //   columnHelper.accessor((row) => row.checkedIn, {
    //     id: "CheckedIN",
    //     label: "Time",
    //     header: "CHECKED IN",
    //     cell: TimeCell,
    // }),
    //     columnHelper.accessor((row) => row.checkedOut, {
    //     id: "CheckedOut",
    //     label: "Time",
    //     header: "CHECKED OUT",
    //     cell: TimeCell,
    // }),
    columnHelper.accessor((row) => row.ParentName, {
        id: "ParentName",
        label: "ParentName",
        header: "Parent Name",
        cell: ParentNameCell,
    }),
        columnHelper.accessor((row) => row.courseName, {
        id: "courseName",
        label: "courseName",
        header: "Course Name",
        cell: CourseNameCell,
    }),
    columnHelper.accessor((row) => row.MobileNumber, {
        id: "MobileNumber",
        label: "MobileNumber",
        header: "Mobile Number",
        cell: PhoneNumerCell,
    }),
     columnHelper.accessor((row) => row.AlternateNumber, {
        id: "AlternateNumber",
        label: "AlternateNumber",
        header: "Alternate Number",
        cell: PhoneNumerCell,
    }),
    //     columnHelper.accessor((row) => row.courseName, {
    //     id: "attendanceStatus",
    //     label: "attendanceStatus",
    //     // header: "Course Name",
    //     cell: CourseNameCell,
    // }),
    // columnHelper.accessor((row) => row.order_status, {
    //     id: "order_status",
    //     label: "Order Status",
    //     header: "Status",
    //     filter: "select",
    //     filterFn: "arrIncludesSome",
    //     cell: OrderStatusCell,
    //     options: orderStatusOptions,
    // }),
    // columnHelper.accessor(
    //     (row) =>
    //         `${row.shipping_address?.street}, ${row.shipping_address?.line}`,
    //     {
    //         id: "address",
    //         label: "Address",
    //         header: "Address",
    //         cell: AddressCell,
    //     }
    // ),
    columnHelper.display({
        id: "actions",
        label: "Row Actions",
        header: "Actions",
        cell: RowActions
    }),
]
