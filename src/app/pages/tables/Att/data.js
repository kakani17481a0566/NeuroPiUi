//src\app\pages\tables\Att\data.js
import axios from "axios";

/**
 * Fetch structured student attendance summary
 * @param {Object} params
 * @param {string} params.date - Format: YYYY-MM-DD
 * @param {number} params.tenantId
 * @param {number} params.branchId
 * @param {number} params.courseId
 * @returns {Promise<{headers: string[], data: object[]}>}
 */
export async function fetchAttendanceSummary({ date, tenantId }) {
  try {
    const url = `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/StudentAttendance/summary-structured`;
    
    const response = await axios.get(url, {
      params: { date, tenantId, branchId:1, courseId:-1 },
    });

    const result = response?.data?.data || {};

    return {
      headers: Array.isArray(result.headers) ? result.headers : [],
      data: Array.isArray(result.records) ? result.records : [],
    };
  } catch (error) {
    console.error("❌ Error fetching attendance summary:", error?.response?.data || error.message);
    return {
      headers: [],
      data: [],
    };
  }
}
