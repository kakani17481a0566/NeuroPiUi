import axios from "utils/axios";
import { BASE_URL } from "constants/apis";

export async function fetchWeeklyTimeTableData({ courseId, weekId }) {
  if (!courseId || !weekId) return { headers: [], timeTableData: [] };

  const tenantId = localStorage.getItem("tenantId");
  const url = `${BASE_URL}/TimeTable/weekId/${weekId}/tenantId/${tenantId}/courseId/${courseId}`;

  try {
    const response = await axios.get(url);
    if (response.status === 200 && response.data?.data) {
      const {
        headers,
        timeTableData,
        resources,
        month,
        weekName,
        course,
        events,
      } = response.data.data;
      return { headers, timeTableData, resources, month, weekName, course, events };
    } else {
      console.warn("Unexpected response format:", response);
      return { headers: [], timeTableData: [], resources: [], month: "", weekName: "", course: "", events: [] };
    }
  } catch (error) {
    console.error("Failed to fetch weekly timetable data:", error);
    return { headers: [], timeTableData: [], resources: [], month: "", weekName: "", course: "", events: [] };
  }
}
