import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

import { fetchAttendanceGraph } from "./data";
import { attendanceGraphLines, timeFormatter } from "./column";

export default function StudentAttendanceGraph({studentId}) {
  const [data, setData] = useState([]);

  // const studentId = 18;
  const tenantId = 1;
  const branchId = 1;

  useEffect(() => {
    fetchAttendanceGraph({ studentId, tenantId, branchId }).then(setData);
  }, [studentId]);

  return (
    <div className="w-full h-[450px] p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-center text-xl font-semibold text-gray-800 mb-4">
        Student Attendance (In & Out Time)
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 30, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#374151"
            tick={{ fontSize: 12, fill: "#374151" }}
          />
          <YAxis
            domain={[0, 24]}
            tickFormatter={timeFormatter}
            stroke="#374151"
            tick={{ fontSize: 12, fill: "#374151" }}
          />
          <Tooltip
            formatter={(val, name) => [timeFormatter(val), name]}
            contentStyle={{
              backgroundColor: "#ffffff",
              borderColor: "#d1d5db",
              color: "#111827",
              fontSize: "13px",
            }}
          />
          <Legend wrapperStyle={{ color: "#374151", fontWeight: "500" }} />

          {attendanceGraphLines.map((line, idx) => (
            <Line
              key={idx}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke}
              strokeWidth={3}
              name={line.name}
              dot={{ r: 4, stroke: line.stroke, strokeWidth: 2, fill: "#ffffff" }}
              activeDot={{ r: 7 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
