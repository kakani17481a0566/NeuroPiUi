import { Page } from "components/shared/Page";
import Term from "app/pages/dashboards/Teacher/WeeklyTimeTable/Table/Term";
import { AcademicCapIcon } from "@heroicons/react/24/outline";

export default function TermPlan() {
  return (
    <Page title="Academic Term Plan">
      <div className="transition-content w-full px-[var(--margin-x)] pt-5 lg:pt-6">
        <div className="min-w-0">
          {/* Heading with icon */}
          <div className="flex items-center gap-2">
            <AcademicCapIcon className="h-6 w-6 text-primary-600 dark:text-primary-300" />
            <h2 className="truncate text-xl font-semibold tracking-wide text-primary-950 dark:text-dark-50">
              Academic Term Plan
            </h2>
          </div>

          <div className="mt-4">
            <Term />
          </div>
        </div>
      </div>
    </Page>
  );
}
