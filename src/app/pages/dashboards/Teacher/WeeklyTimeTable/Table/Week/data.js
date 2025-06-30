import axios from "utils/axios";
import {WEEKLY_TIMETABLE_API} from 'constants/apis';

export async function fetchWeeklyTimeTableData() {
  try {
    const response = await axios.get(
      WEEKLY_TIMETABLE_API
    );

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
