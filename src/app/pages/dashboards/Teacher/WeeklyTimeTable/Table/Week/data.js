// data.js
import axios from "utils/axios";

export async function fetchWeeklyTimeTableData() {
  try {
    const response = await axios.get(
      "https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/TimeTable/weekId/1/tenantId/1/courseId/1"
      // "https://localhost:7202/api/TimeTable/weekId/1/tenantId/1/courseId/1"
    );

    if (response.status === 200 && response.data?.data) {
      const { headers, timeTableData } = response.data.data;
      return { headers, timeTableData }; 
    } else {
      console.warn("Unexpected response format:", response);
      return { headers: [], timeTableData: [] };
    }
  } catch (error) {
    console.error("Failed to fetch weekly timetable data:", error);
    return { headers: [], timeTableData: [] };
  }
}
