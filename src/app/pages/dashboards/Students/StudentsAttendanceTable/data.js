import axios from "axios";
import dayjs from "dayjs";
import { BASE_URL } from "constants/apis";
import { getSessionData } from "utils/sessionStorage";
// import {STUDENT_ATTENDANCE}from "constants/apis"


export async function studentDetails({date}) {
  const{tenantId,branch,}=getSessionData();
  try {
        const formattedDate = dayjs(date).format("YYYY-MM-DD");

    const response = await axios.get(`${BASE_URL}/StudentAttendance/summary-structured?date=${formattedDate}&tenantId=${tenantId}&branchId=${branch}&courseId=-1`, {
      // params: {
      //   dateTime:formattedDate ,
      //   tenantId: 1,
      // },
      headers: {
        "accept": "*/*"
      }
    });

    console.log("Student Details Response:", response.data);
    return response.data;

  } catch (error) {
    console.error("Error fetching student details:", error);
    throw error;
  }
}
