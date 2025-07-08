// Local Imports
import StudentAttendance from "./OrdersTable";
import { Page } from "components/shared/Page";
import { Overview } from "./Overview";
import { Calendar } from "./Calendar";
import { useState, useEffect } from "react";
import { studentDetails } from "./OrdersTable/data";

// ----------------------------------------------------------------------

export default function Orders() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [studentsData, setStudentsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await studentDetails({
          date: selectedDate,
          tenantId: 1,
        });
        setStudentsData(data);
      } catch (err) {
        console.error("Failed to fetch student data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedDate]);

  return (
    <Page title="Orders Dashboard">
      <div className="transition-content mt-5 px-[--margin-x] pb-8 lg:mt-6">
        <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
          {/* Overview - summary stats */}
          <Overview data={studentsData} loading={loading} />

          {/* Calendar - small sidebar widget */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <Calendar onDateChange={setSelectedDate} />
          </div>

          {/* Student Attendance Table - full width */}
          <div className="col-span-12">
            <StudentAttendance date={selectedDate} loading={loading} />
          </div>
        </div>
      </div>
    </Page>
  );
}
