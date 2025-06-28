import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import dayjs from "dayjs";

// Local Imports
import { Button } from "components/ui";

export function RowActions({ row, table }) {
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [hasCheckedOut, setHasCheckedOut] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ Optional spinner state

  const student = row.original;

  // ✅ Sync status flags from props
  useEffect(() => {
    setHasCheckedIn(student.fromTime && student.fromTime !== "Not marked");
    setHasCheckedOut(student.toTime && student.toTime !== "Not marked");
  }, [student.fromTime, student.toTime]);

  const handleCheck = async (type) => {
    const now = dayjs().format("HH:mm:ss");
    const today = dayjs().format("YYYY-MM-DD");

    const payload = {
      date: today,
      userId: 1,
      branchId: 1,
      tenantId: 1,
      entries: [
        {
          studentId: student.studentId,
          fromTime: type === "in" ? now : "00:00:00",
          toTime: type === "out" ? now : "00:00:00",
        },
      ],
    };

    try {
      setLoading(true);
      await axios.post(
        "https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/StudentAttendance/mark-attendance",
        payload
      );

      if (type === "in") setHasCheckedIn(true);
      if (type === "out") setHasCheckedOut(true);

      // ✅ Refresh table data
      await table.options.meta?.fetchData?.();

      // TODO: Show toast/snackbar if needed
    } catch (err) {
      console.error("Attendance marking failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button
        color="success"
        variant="soft"
        className="rounded-full px-3 py-1 text-xs"
        onClick={() => handleCheck("in")}
        disabled={loading || hasCheckedIn}
      >
        Check-In
      </Button>
      <Button
        color="warning"
        variant="soft"
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
