import { STUDENTS_LIST } from "constants/apis";


// Fetch logic centralized here
export const fetchStudents= async (courseId,branchId) => {
  try {
    //https://localhost:7202/api/User/by-tenant?tenantId=2
    

    const response = await fetch(`${STUDENTS_LIST}&courseId=${courseId}&branchId=${branchId}`, {
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
