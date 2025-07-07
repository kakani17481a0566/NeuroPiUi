// src/app/pages/dashboards/Teacher/Classes/index.jsx
import { useEffect, useState } from "react";
import { ClassCard } from "./ClassCard";
import { fetchWeeklyClasses } from "./fetchWeeklyClasses";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import { Spinner } from "components/ui"; // ⬅️ Make sure this is correctly imported

export function Classes({ selectedCourseId }) {
  const [classes, setClasses] = useState([]);
  const [weekInfo, setWeekInfo] = useState({ weekName: "", currentDate: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedCourseId) return;

    setLoading(true);
    fetchWeeklyClasses(selectedCourseId)
      .then(({ classes, weekName, currentDate }) => {
        setClasses(classes);
        setWeekInfo({ weekName, currentDate });
      })
      .finally(() => setLoading(false));
  }, [selectedCourseId]);

  return (
    <div className="mt-4 sm:mt-5 lg:mt-6">
      {/* Top Header Row */}
      <div className="flex items-center gap-1">
        <DocumentPlusIcon className="size-4.5 text-primary-600" />
        <h2>
          Today&#39;s Task — {weekInfo.weekName} ({weekInfo.currentDate})
        </h2>
      </div>

      {/* View All Link */}
      <div className="mt-1 flex justify-end">
        <a
          href="#"
          className="text-xs-plus text-primary-950 hover:text-primary-950/70 focus:text-primary-950/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70 border-b border-dotted border-current pb-0.5 font-medium transition-colors duration-300"
        >
          View All
        </a>
      </div>

      {/* Horizontal scroll container */}
      <div className="mt-3 overflow-x-auto px-2 pb-2 whitespace-nowrap min-h-[100px]">
        {loading ? (
          <div className="flex justify-center items-center h-28">
            <Spinner color="primary" className="size-8" />
          </div>
        ) : classes.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-dark-300 px-2">
            No tasks available for this course.
          </p>
        ) : (
          <div className="flex gap-4">
            {classes.map((item) => (
              <div key={item.uid} className="inline-block min-w-[300px]">
                <ClassCard
                  name={item.category}
                  image={item.image}
                  time={item.time}
                  category={item.name}
                  color={item.color}
                  students={item.students}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
