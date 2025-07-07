import axios from "utils/axios";

export async function fetchActivities() {
  const apiUrl = `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/Transaction/table/tenant/1`;
  const response = await axios.get(apiUrl);
  // Return the array of transaction rows inside tData
  return response.data.data.tData;
}
