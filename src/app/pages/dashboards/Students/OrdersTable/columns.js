import React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import {
  UserIcon,
  PhoneIcon,
  UsersIcon,
  AcademicCapIcon,
  IdentificationIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";

import { RowActions } from "./RowActions";
import {
  CustomerCell,
  OrderIdCell,
  ParentNameCell,
  CourseNameCell,
  PhoneNumerCell,
} from "./rows";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.studentId, {
    id: "studentId",
    label: "Order ID",
    header: () =>
      React.createElement(
        "span",
        { className: "flex items-center gap-1" },
        React.createElement(IdentificationIcon, { className: "h-4 w-4 text-primary-600" }),
        "Student ID"
      ),
    cell: OrderIdCell,
  }),

  columnHelper.accessor((row) => row.studentName, {
    id: "studentName",
    label: "studentName",
    header: () =>
      React.createElement(
        "span",
        { className: "flex items-center gap-1" },
        React.createElement(UserIcon, { className: "h-4 w-4 text-primary-600" }),
        "Student Name"
      ),
    cell: CustomerCell,
  }),

  columnHelper.accessor((row) => row.ParentName, {
    id: "ParentName",
    label: "ParentName",
    header: () =>
      React.createElement(
        "span",
        { className: "flex items-center gap-1" },
        React.createElement(UsersIcon, { className: "h-4 w-4 text-primary-600" }),
        "Parent Name"
      ),
    cell: ParentNameCell,
  }),

  columnHelper.accessor((row) => row.courseName, {
    id: "courseName",
    label: "courseName",
    header: () =>
      React.createElement(
        "span",
        { className: "flex items-center gap-1" },
        React.createElement(AcademicCapIcon, { className: "h-4 w-4 text-primary-600" }),
        "Course Name"
      ),
    cell: CourseNameCell,
  }),

  columnHelper.accessor((row) => row.MobileNumber, {
    id: "MobileNumber",
    label: "MobileNumber",
    header: () =>
      React.createElement(
        "span",
        { className: "flex items-center gap-1" },
        React.createElement(PhoneIcon, { className: "h-4 w-4 text-primary-600" }),
        "Mobile Number"
      ),
    cell: PhoneNumerCell,
  }),

  columnHelper.accessor((row) => row.AlternateNumber, {
    id: "AlternateNumber",
    label: "AlternateNumber",
    header: () =>
      React.createElement(
        "span",
        { className: "flex items-center gap-1" },
        React.createElement(DevicePhoneMobileIcon, { className: "h-4 w-4 text-primary-600" }),
        "Alternate Number"
      ),
    cell: PhoneNumerCell,
  }),

  columnHelper.display({
    id: "actions",
    label: "Row Actions",
    header: "Actions",
    cell: RowActions,
  }),
];
