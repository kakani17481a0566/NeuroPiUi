import { Page } from "components/shared/Page";
import { AcademicCapIcon } from "@heroicons/react/24/outline"; // ✅ icon import

import Week from "app/pages/dashboards/Teacher/WeeklyTimeTable/Table/Week";

export default function weeklyplan() {
  return (
    <Page title="Homepage">
      <div className="transition-content w-full px-[var(--margin-x)] pt-5 lg:pt-6">
        <div className="min-w-0">
          {/* ✅ Icon + Title */}
          <div className="flex items-center space-x-2">
            <AcademicCapIcon className="w-6 h-6 text-[#1A4255]" />
            <h2 className="truncate  text-primary-600 text-xl font-medium tracking-wide text-[#1A4255] dark:text-dark-50">
              Academics
            </h2>
          </div>

          <div className="mt-4"> {/* spacing below heading */}
            <Week />
            {/* <WeeklyTimeTable /> */}
          </div>
        </div>
      </div>
    </Page>
  );
}
