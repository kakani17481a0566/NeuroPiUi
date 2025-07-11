import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import dayjs from "dayjs";

// Local Imports
import { Button } from "components/ui";
import { getSessionData } from "utils/sessionStorage";

export function RowActions({ row, table }) {
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [hasCheckedOut, setHasCheckedOut] = useState(false);
  const [loading, setLoading] = useState(false);

  const { branch, tenantId, userId } = getSessionData();
  const student = row.original;

  useEffect(() => {
    setHasCheckedIn(student.fromTime && student.fromTime !== "Not marked");
    setHasCheckedOut(student.toTime && student.toTime !== "Not marked");
  }, [student.fromTime, student.toTime]);

  const handleCheck = async (type) => {
    const now = dayjs().format("HH:mm:ss");
    const today = dayjs().format("YYYY-MM-DD");

    // ✅ FIX: Only send the field being updated
    const entry = {
      studentId: student.studentId,
      ...(type === "in" && { fromTime: now }),
      ...(type === "out" && { toTime: now }),
    };

    const payload = {
      date: today,
      userId: userId,
      branchId: branch,
      tenantId: tenantId,
      entries: [entry],
    };

    try {
      setLoading(true);
      await axios.post(
        "https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/StudentAttendance/mark-attendance",
        payload
      );

      if (type === "in") setHasCheckedIn(true);
      if (type === "out") setHasCheckedOut(true);

      await table.options.meta?.fetchData?.();
    } catch (err) {
      console.error("❌ Attendance marking failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button
        color="success"
        className="bg-green-600 dark:bg-green-500 hover:bg-green-700 text-white rounded-full px-3 py-1 text-xs transition-colors duration-200"
        onClick={() => handleCheck("in")}
        disabled={loading || hasCheckedIn}
      >
        Check-In
      </Button>
      <Button
        color="warning"
        className="rounded-full px-3 py-1 text-xs"
        onClick={() => handleCheck("out")}
        disabled={loading || !hasCheckedIn || hasCheckedOut}
      >
        Check-Out
      </Button>
    </div>
  );
}

RowActions.propTypes = {
  row: PropTypes.object.isRequired,
  table: PropTypes.object.isRequired,
};
