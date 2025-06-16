import { useEffect, useState } from "react";
import { Box, Spinner } from "components/ui";
import Week from "./Table/Week";
import Term from "./Table/Term";

// Utility to check if device is mobile
const isMobile = () => window.innerWidth <= 768;

export function WeeklyTimeTable({ view }) {
  const [loading, setLoading] = useState(true);
  const [mobile, setMobile] = useState(isMobile());

  useEffect(() => {
    // Update mobile flag on resize
    const handleResize = () => setMobile(isMobile());
    window.addEventListener("resize", handleResize);

    // Simulate async load
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800); // Adjust delay as needed

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [view]);

  return (
    <Box className="col-span-12 lg:col-span-8">
      <h2 className="dark:text-dark-100 mb-2 text-base font-medium tracking-wide text-gray-800">
        {view === "Week" ? "Weekly Timetable" : "Term Timetable"}
      </h2>

      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner color="primary" className={mobile ? "size-8 border-2" : "size-14 border-4"} />
        </div>
      ) : view === "Week" ? (
        <Week />
      ) : (
        <Term />
      )}
    </Box>
  );
}
