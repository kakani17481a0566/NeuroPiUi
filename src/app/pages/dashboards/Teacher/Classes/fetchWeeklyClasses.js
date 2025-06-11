// src/app/pages/dashboards/Teacher/Classes/fetchWeeklyClasses.js
import axios from "utils/axios";

/**
 * Fetches weekly class timetable data and transforms it for ClassCard component.
 */
export async function fetchWeeklyClasses() {
  try {
    const response = await axios.get(
      `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/TimeTable/weekId/-1/tenantId/1/courseId/1`
    );

    const { timeTableData, currentDate, weekName } = response.data.data;

    const colorVariants = ["primary", "info", "secondary", "success", "warning"];
    const mappedClasses = [];

    timeTableData.forEach((row, rowIndex) => {
      for (let i = 2; i <= 7; i++) {
        const subjectName = row[`column${i}`];
        if (subjectName && subjectName.trim()) {
          mappedClasses.push({
            uid: `${rowIndex}-${i}`,
            image: "/images/600x400.png",
            name: subjectName,
            time: `${row.column1}`,
            category: "Subject",
            color: colorVariants[mappedClasses.length % colorVariants.length],
            students: [],
          });
        }
      }
    });

    return { classes: mappedClasses, weekName, currentDate };
  } catch (error) {
    console.error("Failed to fetch class data:", error);
    return { classes: [], weekName: "", currentDate: "" };
  }
}
