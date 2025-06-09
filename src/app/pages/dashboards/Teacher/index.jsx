// Local Imports
import { Page } from "components/shared/Page";
//import { Welcome } from "./Welcome";
import { WorkingHours } from "./WorkingHours";
import { Students } from "./Students";
import { Calendar } from "./Calendar";
import {WeeklyTimeTable}  from "./WeeklyTimeTable";
import { Classes } from "./Classes";
// Import Dependencies
import { useState } from "react";

// Local Imports
import { Combobox } from "components/shared/form/Combobox";

// ----------------------------------------------------------------------
const pages = [
  { id: 1, name: "Courses Page" },
  { id: 2, name: "Grammar Page" },
  { id: 3, name: "Jobs Page" },
  { id: 4, name: "Server Status Page" },
  { id: 5, name: "Sport Page" },
  { id: 6, name: "Travel Blog Page" },
];
export default function Teacher() {
  const [selectedPage, setSelectedPage] = useState(pages[0]);
  return (
    <Page title="Teacher Dashboard">
      <div className="transition-content mt-4 grid w-full grid-cols-12 gap-4 px-(--margin-x) pb-8 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
        <div className="col-span-12 lg:col-span-8 xl:col-span-9">
          <div className="col-span-4 px-4 sm:col-span-4 sm:px-5 lg:col-span-2">
      <Combobox
        data={pages}
        displayField="name"
        value={selectedPage}
        onChange={setSelectedPage}
        placeholder="Please Select Post"
        searchFields={["name"]}
      />
      </div>
          {/* <Welcome /> */}
          <Classes />
          <WeeklyTimeTable/>
        </div>
        <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:sticky lg:top-20 lg:col-span-4 lg:grid-cols-1 lg:gap-6 lg:self-start xl:col-span-3">
          <WorkingHours />
          <Students />
          <Calendar />
        </div>
      </div>
    </Page>
  );
}
