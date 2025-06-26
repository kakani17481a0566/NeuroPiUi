// Import Dependencies
import clsx from "clsx";
import PropTypes from "prop-types";
// import { AcademicCapIcon } from "@heroicons/react/24/outline"; // ✅ Added icon
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
// Local Imports
// import { CollapsibleSearch } from "components/shared/CollapsibleSearch";
// import { MenuAction } from "./MenuActions";
import { TableConfig } from "./TableConfig";

export function Toolbar({ table }) {
  const enableFullScreen = table.getState().tableSettings.enableFullScreen;

  return (
    <div
      className={clsx(
        "flex items-center justify-between",
        enableFullScreen && "px-4 sm:px-5",
      )}
    >
      {/* ✅ Wrap icon and text */}
      <div className="flex items-center space-x-2">
            <CalendarDaysIcon className="h-6 w-6 text-[#1A4255]" />
        <h2 className="truncate text-base font-medium tracking-wide text-[#1A4255] dark:text-dark-100">
          Term Plan
        </h2>
      </div>

      <div className={clsx("flex", enableFullScreen && "ltr:-mr-2 rtl:-ml-2")}>
        {/* <CollapsibleSearch
          placeholder="Search here..."
          value={table.getState().globalFilter}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
        /> */}
        <TableConfig table={table} />
        {/* <MenuAction /> */}
      </div>
    </div>
  );
}

Toolbar.propTypes = {
  table: PropTypes.object,
};
