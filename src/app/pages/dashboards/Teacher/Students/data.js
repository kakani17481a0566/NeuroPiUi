import {
  CheckBadgeIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
// import { STUDENTS_LIST } from "constants/apis";

// Status options
export const userStatusOptions = [
  {
    value: "active",
    label: "Active",
    color: "success",
    icon: CheckBadgeIcon,
  },
  {
    value: "inactive",
    label: "Inactive",
    color: "error",
    icon: XCircleIcon,
  },
  {
    value: "pending",
    label: "Pending",
    color: "warning",
    icon: ClockIcon,
  },
];

// Fetch logic centralized here
export const fetchStudents= async (courseId) => {
  try {
    console.log(courseId);
    //https://localhost:7202/api/User/by-tenant?tenantId=2

    const response = await fetch(`https://localhost:7202/api/Student/by-tenant-course-branch?tenantId=1&courseId=${courseId}&branchId=1`, {
      headers: {
        accept: "*/*",
        // Authorization: token,
      },
    });
     if (!response.ok) {
      console.error(`HTTP Error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    return data.data || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
