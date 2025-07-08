// src/app/pages/tables/Grades/data.js
import axios from "axios";
import { BASE_URL } from "constants/apis";
import { fetchGradesList } from "./GradesList";

export async function fetchAssessmentMatrix({ timeTableId, tenantId, courseId, branch }) {
  const url = `${BASE_URL}/AssessmentMatrix/timetable/${timeTableId}/tenant/${tenantId}/course/${courseId}/branch/${branch}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchGradeList() {
  return fetchGradesList();
}

export async function saveGradesMatrix(payload) {
  const url = `${BASE_URL}/DailyAssessment/save-matrix`;
  return axios.post(url, payload);
}
