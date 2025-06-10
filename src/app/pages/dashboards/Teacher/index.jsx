// ───────────────────────────────────────────────
// ✅ Component Imports
// ───────────────────────────────────────────────

// Page wrapper component for SEO and layout framing
import { Page } from "components/shared/Page";

// Dashboard widgets
// import { Welcome } from "./Welcome"; // (currently unused)
import { WorkingHours } from "./WorkingHours";
import { Students } from "./Students";
import { Calendar } from "./Calendar";
import { WeeklyTimeTable } from "./WeeklyTimeTable";
// import { Classes } from "./Classes";

// React core
import { useState } from "react";

// Form control component
import { Combobox } from "components/shared/form/Combobox";

// ───────────────────────────────────────────────
// ✅ Page Dropdown Options
// ───────────────────────────────────────────────
const pages = [
  { id: 1, name: "Courses Page" },
  { id: 2, name: "Grammar Page" },
  { id: 3, name: "Jobs Page" },
  { id: 4, name: "Server Status Page" },
  { id: 5, name: "Sport Page" },
  { id: 6, name: "Travel Blog Page" },
];

// ───────────────────────────────────────────────
// ✅ Main Component: Teacher Dashboard
// ───────────────────────────────────────────────
export default function Teacher() {
  const [selectedPage, setSelectedPage] = useState(pages[0]); // Combobox selected value

  return (
    <Page title="Teacher Dashboard">
      {/* Page Selector */}
      <div className="mb-4 px-4 sm:px-5 lg:px-6">
        <Combobox
          data={pages}
          displayField="name"
          value={selectedPage}
          onChange={setSelectedPage}
          placeholder="Please Select Post"
          searchFields={["name"]}
        />
      </div>

      {/* Main Grid Layout */}
      <div
        className="transition-content mt-4 grid w-full grid-cols-12 gap-4 pb-8 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6"
        style={{ paddingInline: "var(--margin-x)" }}
      >
        {/* Main Content */}
        <div className="col-span-12 lg:col-span-11 xl:col-span-10">
          {/* <Classes /> */}
        <div>
            <WeeklyTimeTable />
        </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:sticky lg:top-20 lg:col-span-1 lg:grid-cols-1 lg:gap-6 lg:self-start xl:col-span-2">
          <WorkingHours />
          <Students />
          <Calendar />
        </div>
      </div>
    </Page>
  );
}
