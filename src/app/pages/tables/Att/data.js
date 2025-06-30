import axios from "axios";

/**
 * Fetch structured student attendance summary
 * @param {Object} params
 * @param {string} params.date - YYYY-MM-DD
 * @param {number} params.tenantId
 * @param {number} params.branchId
 * @param {number} params.courseId
 * @returns {Promise<{headers: string[], data: object[]}>}
 */
export async function fetchAttendanceSummary({ date, tenantId, branchId, courseId }) {
  try {
    const response = await axios.get(
      `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/StudentAttendance/summary-structured?date=${date}&tenantId=${tenantId}&branchId=${branchId}&courseId=${courseId}`,
    );

    const { data, headers } = response?.data || {};

    return {
      headers: Array.isArray(headers) ? headers : [],
      data: Array.isArray(data) ? data : [],
    };
  } catch (error) {
    console.error("❌ Error fetching attendance summary:", error?.response?.data || error.message);
    return {
      headers: [],
      data: [],
    };
  }
}
