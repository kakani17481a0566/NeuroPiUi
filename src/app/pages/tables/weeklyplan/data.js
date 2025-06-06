// data.js
import {
    CheckBadgeIcon,
    ClockIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";

export const userStatusOptions = [
    {
        value: "active",
        label: "Active",
        color: "success",
        icon: CheckBadgeIcon,
    },
    {
        value: "inactive",
        label: "Inactive",
        color: "error",
        icon: XCircleIcon,
    },
    {
        value: "pending",
        label: "Pending",
        color: "warning",
        icon: ClockIcon,
    },
];

/**
 * Transforms the flat API response data into a nested structure suitable for a grid-like table.
 * The output will have rows representing days, and columns representing subjects,
 * with cell content containing topics and worksheets for that day/subject across all periods.
 */
export const transformTimeTableDataForGrid = (apiResponseData) => {
    const timeTableGrid = {};
    const uniqueDays = new Set();
    const uniqueSubjects = new Map();

    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    apiResponseData.forEach(entry => {
        const day = entry.dayOfWeek.trim();
        const subjectCode = entry.subjectCode;
        const subjectName = entry.subjectName;

        uniqueDays.add(day);
        uniqueSubjects.set(subjectCode, subjectName);

        if (!timeTableGrid[day]) {
            timeTableGrid[day] = {};
        }
        if (!timeTableGrid[day][subjectCode]) {
            timeTableGrid[day][subjectCode] = [];
        }
    });

    const orderedDays = Array.from(uniqueDays).sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
    const orderedSubjects = Array.from(uniqueSubjects.entries()).sort((a, b) => a[0].localeCompare(b[0]));

    apiResponseData.forEach(entry => {
        const day = entry.dayOfWeek.trim();
        const subjectCode = entry.subjectCode;
        const periodName = entry.periodName;

        let periodEntry = timeTableGrid[day][subjectCode].find(p => p.periodName === periodName);
        if (!periodEntry) {
            periodEntry = { periodName: periodName, topics: [], worksheets: [] };
            timeTableGrid[day][subjectCode].push(periodEntry);
        }

        if (entry.topicName && !periodEntry.topics.includes(entry.topicName)) {
            periodEntry.topics.push(entry.topicName);
        }
        if (entry.assignedWorksheetName && !periodEntry.worksheets.includes(entry.assignedWorksheetName)) {
            periodEntry.worksheets.push(entry.assignedWorksheetName);
        }
    });

    const tableRows = orderedDays.map(day => {
        const row = { id: day, dayName: day };
        orderedSubjects.forEach(([subjectCode]) => {
            const cellContent = timeTableGrid[day][subjectCode] || [];
            cellContent.sort((a, b) => {
                const numA = parseInt(a.periodName.replace('Period ', ''));
                const numB = parseInt(b.periodName.replace('Period ', ''));
                return numA - numB;
            });
            row[subjectCode] = cellContent;
        });
        return row;
    });

    return { tableRows, orderedDays, orderedSubjects };
};

export const fetchTimeTableRawData = async () => {
    const API_URL = "https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/VwComprehensive/all";
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.statusCode === 200 && result.data) {
            return result.data;
        } else {
            throw new Error(result.message || "Failed to fetch data from API.");
        }
    } catch (error) {
        console.error("Error fetching timetable raw data:", error);
        throw error;
    }
};