// src/app/pages/dashboards/Teacher/Classes/index.jsx
import { useEffect, useState } from "react";
import { ClassCard } from "./ClassCard";
import { fetchWeeklyClasses } from "./fetchWeeklyClasses";

import { DocumentPlusIcon } from "@heroicons/react/24/outline";

export function Classes() {
  const [classes, setClasses] = useState([]);
  // const [weekInfo, setWeekInfo] = useState({ weekName: "", currentDate: "" });
  const [setWeekInfo] = useState({ weekName: "", currentDate: "" });

  useEffect(() => {
    fetchWeeklyClasses().then(({ classes, weekName, currentDate }) => {
      setClasses(classes);
      setWeekInfo({ weekName, currentDate });
    });
  }, []);

  return (
    <div className="mt-4 sm:mt-5 lg:mt-6">
      {/* Top Header Row */}
      <div className="flex items-center gap-1">
        <DocumentPlusIcon className="size-4.5" />
        <h2 className="text-xs-plus text-primary-600 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70 border-b border-dotted border-current pb-0.5 font-medium outline-hidden transition-colors duration-300"
>
          Todays Task
          {/* {weekInfo.weekName} - ({weekInfo.currentDate}) */}
        </h2>
      </div>

      {/* View All Link */}
      <div className="mt-1 flex justify-end">
        <a
          href="##"
          className="text-xs-plus text-primary-600 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70 border-b border-dotted border-current pb-0.5 font-medium outline-hidden transition-colors duration-300"
        >
          View All
        </a>
      </div>

      {/* 🔽 Horizontal scroll container */}
      <div className="mt-3 overflow-x-auto px-2 pb-2 whitespace-nowrap">
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
      </div>
    </div>
  );
}
