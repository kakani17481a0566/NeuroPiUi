import axios from "axios";

export async function fetchGradesList() {
  try {
    const response = await axios.get(
      "https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/Grade/1"
    );
    return response.data.data|| [];
  } catch (err) {
    console.error("Failed to fetch grades:", err);
    return [];
  }
}
