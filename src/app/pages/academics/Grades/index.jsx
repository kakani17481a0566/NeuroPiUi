import { Page } from "components/shared/Page";
// import TermPlan from "app/pages/tables/TermPlan";
// import Term from "./Table/Term";
import Grades from 'app/pages/tables/Grades';

export default function Grade(){
    return (
     <Page title="Homepage">
          <div className="transition-content w-full px-[var(--margin-x)] pt-5 lg:pt-6">
            <div className="min-w-0">
              <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
                Grades
              </h2>
              <div className="mt-4"> {/* Added margin top for better spacing */}
                <Grades/>
              </div>
            </div>
          </div>
        </Page>
  );
}