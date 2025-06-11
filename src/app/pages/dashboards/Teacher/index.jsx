// ───────────────────────────────────────────────
// ✅ Component Imports
// ───────────────────────────────────────────────

import { Page } from "components/shared/Page";
import { WorkingHours } from "./WorkingHours";
import { Students } from "./Students";
import { Calendar } from "./Calendar";
import { WeeklyTimeTable } from "./WeeklyTimeTable";
import { Classes } from "./Classes";
import { useState } from "react";
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
  const [selectedPage, setSelectedPage] = useState(pages[0]);

  return (
    <Page title="Teacher Dashboard">
      {/* Combobox Selector */}
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

      {/* Responsive 12-column Grid Layout */}
      <div className="grid grid-cols-12 gap-4 px-4 pb-8 sm:gap-5 lg:gap-6 sm:px-5 lg:px-6">
        {/* Left/Main Section (10 of 12 columns) */}
        <div className="col-span-12 xl:col-span-10 lg:col-span-9">
          <Classes />
          <WeeklyTimeTable />
        </div>

        {/* Right Sidebar (2 of 12 columns) */}
        <div className="col-span-12 lg:col-span-3 xl:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-1 lg:gap-6 lg:sticky lg:top-20 lg:self-start">
          <WorkingHours />
          <Students />
          <Calendar />
        </div>
      </div>
    </Page>
  );
}
