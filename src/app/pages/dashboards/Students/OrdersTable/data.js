import axios from "axios";
import dayjs from "dayjs";
// import {STUDENT_ATTENDANCE}from "constants/apis"


export async function studentDetails({date}) {
  try {
        const formattedDate = dayjs(date).format("YYYY-MM-DD");

    const response = await axios.get(`https://localhost:7202/api/StudentAttendance/summary-structured?date=${formattedDate}&tenantId=1&branchId=1&courseId=-1`, {
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
