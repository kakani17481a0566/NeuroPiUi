// data.js
import {
//   ArrowPathIcon,
  CheckBadgeIcon,
  ClockIcon,
//   TruckIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

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

export const fetchUsers = async () => {
  try {
    const response = await fetch(
      // "https://localhost:7171/api/User/by-tenant?tenantId=2",
      "https://localhost:7202/api/User/by-tenant?tenantId=2",

      {
        headers: { accept: "*/*" },
      },
    );
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const transformUserData = (users) => {
  return users.map((user) => ({
    userId: user.userId,
    username: user.username,
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
    email: user.email,
    mobileNumber: user.mobileNumber,
    address: user.address,
    status: "active", // You can add status logic based on your requirements
    createdOn: user.createdOn,
    originalData: user, // Keep original data for actions
  }));
};
