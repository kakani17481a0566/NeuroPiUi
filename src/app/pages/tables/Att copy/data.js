import axios from "axios";

export async function fetchAttendanceSummary({ date, tenantId, branchId, courseId }) {
  try {
    const response = await axios.get("https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/StudentAttendance/summary-structured", {
      params: {
        date,
        tenantId,
        branchId,
        courseId
      }
    });

    const { data, headers } = response.data;

    return {
      headers,
      data
    };
  } catch (error) {
    console.error("Error fetching attendance summary:", error);
    return {
      headers: [],
      data: []
    };
  }
}
