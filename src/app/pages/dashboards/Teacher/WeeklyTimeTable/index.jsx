//  import { Radio, RadioGroup } from "@headlessui/react";
// import clsx from "clsx";
// import { useState } from "react";

// Local Imports
import { Box } from "components/ui";
// import {Week} from "./Table/Week";
import Week from "./Table/Week";

import Term from "./Table/Term";

// ----------------------------------------------------------------------

export function WeeklyTimeTable() {
  return (
    <div className="mt-4 sm:mt-5 lg:mt-6">
      <Box className="col-span-12 lg:col-span-8">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <h2 className="dark:text-dark-100 truncate text-base font-medium tracking-wide text-gray-800">
            Week
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row sm:gap-7">
          <Week />
        </div>
        <h2 className="dark:text-dark-100 truncate text-base font-medium tracking-wide text-gray-800">
          Term
        </h2>
        <div className="flex flex-col sm:flex-row sm:gap-7">
          <Term />
        </div>
      </Box>
    </div>
  );
}
