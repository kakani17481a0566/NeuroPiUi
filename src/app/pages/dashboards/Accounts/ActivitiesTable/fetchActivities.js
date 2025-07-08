import axios from "utils/axios";
import {FETCH_ACTIVITIES} from "constants/apis";

export async function fetchActivities() {
  const apiUrl = `${FETCH_ACTIVITIES}`;
  const response = await axios.get(apiUrl);
  // Return the array of transaction rows inside tData
  return response.data.data.tData;
}
