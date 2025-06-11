import { Page } from "components/shared/Page";
// import TermPlan from "app/pages/tables/TermPlan";
// import Term from "./Table/Term";
import Term from "app/pages/dashboards/Teacher/WeeklyTimeTable/Table/Term";

export default function termplan(){
    return (
     <Page title="Homepage">
          <div className="transition-content w-full px-[var(--margin-x)] pt-5 lg:pt-6">
            <div className="min-w-0">
              <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
                Academics
              </h2>
              <Term/>
              <div className="mt-4"> {/* Added margin top for better spacing */}
                {/* <TermPlan/> */}
              </div>
            </div>
          </div>
        </Page>
  );
}