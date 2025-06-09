// src/app/pages/dashboards/Teacher/WeeklyMatrixTable/Table/Week/data.js

import axios from "utils/axios";

/**
 * Fetches weekly matrix data from the API.
 * @param {number} tenantId
 * @param {number} courseId
 * @param {number} termId
 * @returns {{ headers: string[], dataTerm: object[], month: string, week: string, course: string }}
 */
export async function fetchWeeklyMatrixData(tenantId, courseId, termId) {
  try {
    const response = await axios.get(
    //   `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/VTermTable/get-week-matrix`,
    'https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/VTermTable/get-week-matrix?tenantId=1&courseId=1&termId=1',
      {
        params: { tenantId, courseId, termId },
      }
    );

    if (response.status === 200 && response.data?.data) {
      const { headers, dataTerm, month, week, course } = response.data.data;
      return { headers, dataTerm, month, week, course };
    } else {
      console.warn("Unexpected response format:", response);
      return { headers: [], dataTerm: [], month: "", week: "", course: "" };
    }
  } catch (error) {
    console.error("❌ Failed to fetch weekly matrix data:", error);
    return { headers: [], dataTerm: [], month: "", week: "", course: "" };
  }
}
