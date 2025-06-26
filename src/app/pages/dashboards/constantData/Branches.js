import { BRANCHES_LIST } from "constants/apis";

export const fetchBranches= async () => {
  try {

    //https://localhost:7202/api/User/by-tenant?tenantId=2

    const response = await fetch(BRANCHES_LIST
    , {
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
    console.error("Error fetching Courses:", error);
    return [];
  }
};