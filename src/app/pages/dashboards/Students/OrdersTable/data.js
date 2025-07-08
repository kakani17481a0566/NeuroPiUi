import axios from "axios";
import dayjs from "dayjs";
import {STUDENT_ATTENDANCE}from "constants/apis"


export async function studentDetails({date}) {
  try {
        const formattedDate = dayjs(date).format("MM-DD-YYYY");

    const response = await axios.get(`${STUDENT_ATTENDANCE}`, {
      params: {
        dateTime:formattedDate ,
        tenantId: 1,
      },
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
