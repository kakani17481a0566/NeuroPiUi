import { Page } from "components/shared/Page";
import Term from "app/pages/dashboards/Teacher/WeeklyTimeTable/Table/Term";
import { AcademicCapIcon } from "@heroicons/react/24/outline"; // ✅ icon import

export default function termplan() {
  return (
    <Page title="Homepage">
      <div className="transition-content w-full px-[var(--margin-x)] pt-5 lg:pt-6">
        <div className="min-w-0">
          {/* ✅ Updated heading with icon */}
          <div className="flex items-center space-x-2">
            <AcademicCapIcon className="w-6 h-6 text-[#1A4255]" />
            <h2 className="truncate text-xl font-medium tracking-wide text-[#1A4255] dark:text-dark-50">
              Academics
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
