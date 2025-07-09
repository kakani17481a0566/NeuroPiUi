import axios from "axios";

export async function fetchAttendanceGraph({ studentId, tenantId, branchId, days = 7 }) {
  try {
    const res = await axios.get("https://localhost:7202/api/StudentAttendance/graph", {
      params: { studentId, tenantId, branchId, days }
    });

    const raw = res.data?.data || [];

    return raw.map(row => ({
      date: row.date,
      inTime: timeToDecimal(row.inTime),
      outTime: timeToDecimal(row.outTime)
    }));
  } catch (err) {
    console.error("Failed to fetch attendance graph data", err);
    return [];
  }
}

function timeToDecimal(timeStr) {
  const [hour, minute] = timeStr.split(":").map(Number);
  return hour + minute / 60;
}
