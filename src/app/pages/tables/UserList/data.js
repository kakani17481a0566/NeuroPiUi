import {
  CheckBadgeIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { USER_LIST } from "constants/apis";

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
export const fetchUsers = async (token) => {
  try {

    //https://localhost:7202/api/User/by-tenant?tenantId=2

    const response = await fetch(USER_LIST, {
      headers: {
        accept: "*/*",
        Authorization: token,
      },
    });

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
