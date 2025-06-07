import { Page } from "components/shared/Page";
// import TermPlan from "app/pages/tables/TermPlan";
import WeeklyPlan from "app/pages/tables/WeeklyPlan";
export default function weeklyplan(){
    return (
     <Page title="Homepage">
          <div className="transition-content w-full px-[var(--margin-x)] pt-5 lg:pt-6">
            <div className="min-w-0">
              <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
                Academics
              </h2>
              
              <div className="mt-1"> {/* Added margin top for better spacing */}
                <WeeklyPlan/>
              </div>
            </div>
          </div>
        </Page>
  );
}