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

      {/* 🔽 Horizontal scroll container */}
      <div className="mt-3 overflow-x-auto whitespace-nowrap pb-2 px-2 ">
  <div className="flex gap-4 ">
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
