 import { Page } from "components/shared/Page";
// // import TermPlan from "app/pages/tables/TermPlan";
// // import WeeklyPlan from "app/pages/tables/WeeklyPlan";
// // import WeeklyPlan from "../../tables/WeeklyPlan";
// 
// 
// import WeeklyTimeTable from 'app/pages/tables/WeekTimeTable';

import Week from "app/pages/dashboards/Teacher/WeeklyTimeTable/Table/Week";

export default function weeklyplan(){
    return (
     <Page title="Homepage">
          <div className="transition-content w-full px-[var(--margin-x)] pt-5 lg:pt-6">
            <div className="min-w-0">
              <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
                Academics
              </h2>
            
              <div > {/* Added margin top for better spacing */}

                  <Week/>
                {/* <WeeklyTimeTable/> */}
              </div>
            </div>
          </div>
        </Page>
  );
}