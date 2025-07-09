export const timeFormatter = (val) => {
  const h = Math.floor(val);
  const m = Math.round((val % 1) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

export const attendanceGraphLines = [
  { dataKey: "inTime", name: "In Time", stroke: "#8884d8" },
  { dataKey: "outTime", name: "Out Time", stroke: "#82ca9d" },
];
