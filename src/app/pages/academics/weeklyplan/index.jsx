import { Page } from "components/shared/Page";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import Week from "app/pages/dashboards/Teacher/WeeklyTimeTable/Table/Week";

export default function WeeklyPlan() {
  return (
    <Page title="Weekly Timetable">
      <div className="transition-content w-full px-[var(--margin-x)] pt-5 lg:pt-6">
        <div className="min-w-0">
          {/* Header with icon and title */}
          <div className="flex items-center gap-2">
            <AcademicCapIcon className="h-6 w-6 text-primary-600 dark:text-primary-300" />
            <h2 className="truncate text-xl font-semibold tracking-wide text-primary-950 dark:text-dark-50">
              Weekly Academic Plan
            </h2>
          </div>

          <div className="mt-4">
            <Week />
            {/* You can swap <Week /> with <WeeklyTimeTable /> if needed */}
          </div>
        </div>
      </div>
    </Page>
  );
}
