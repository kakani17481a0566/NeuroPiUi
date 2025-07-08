import axios from "axios";
import dayjs from "dayjs";


export async function studentDetails({date}) {
  try {
        const formattedDate = dayjs(date).format("MM-DD-YYYY");

    const response = await axios.get("https://localhost:7202/students/3/branch/1", {
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
