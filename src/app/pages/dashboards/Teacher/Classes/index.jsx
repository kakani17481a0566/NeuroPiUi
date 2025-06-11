// src/app/pages/dashboards/Teacher/Classes/index.jsx
import { useEffect, useState } from "react";
import { ClassCard } from "./ClassCard";
import { fetchWeeklyClasses } from "./fetchWeeklyClasses";

export function Classes() {
  const [classes, setClasses] = useState([]);
  const [weekInfo, setWeekInfo] = useState({ weekName: "", currentDate: "" });

  useEffect(() => {
    fetchWeeklyClasses().then(({ classes, weekName, currentDate }) => {
      setClasses(classes);
      setWeekInfo({ weekName, currentDate });
    });
  }, []);

  return (
    <div className="mt-4 sm:mt-5 lg:mt-6">
      <div className="flex h-8 min-w-0 items-center justify-between">
        <h2 className="truncate text-base font-medium tracking-wide text-gray-800 dark:text-dark-100">
          {weekInfo.weekName} - ({weekInfo.currentDate})
        </h2>
        <a
          href="##"
          className="border-b border-dotted border-current pb-0.5 text-xs-plus font-medium text-primary-600 outline-hidden transition-colors duration-300 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70"
        >
          View All
        </a>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
        {classes.map((item) => (
          <ClassCard
            key={item.uid}
            name={item.name}
            image={item.image}
            time={item.time}
            category={item.category}
            color={item.color}
            students={item.students}
          />
        ))}
      </div>
    </div>
  );
}
