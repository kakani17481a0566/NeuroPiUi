// Import Dependencies
import clsx from "clsx";
import PropTypes from "prop-types";

// Icons
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

// Local Imports
import { TableConfig } from "./TableConfig";

export function Toolbar({ table }) {
  const enableFullScreen = table.getState().tableSettings.enableFullScreen;

  return (
    <div
      className={clsx(
        "flex items-center justify-between",
        enableFullScreen && "px-4 sm:px-5"
      )}
    >
      {/* Left: Icon + Title */}
      <div className="flex items-center gap-2">
        <CalendarDaysIcon className="h-6 w-6 text-primary-600 dark:text-primary-300" />
        <h2 className="truncate text-base font-medium tracking-wide text-primary-950 dark:text-dark-100">
          Week Time Table
        </h2>
      </div>

      {/* Right: Actions */}
      <div className={clsx("flex", enableFullScreen && "ltr:-mr-2 rtl:-ml-2")}>
        {/* Future: Add search or menu actions here */}
        <TableConfig table={table} />
      </div>
    </div>
  );
}

Toolbar.propTypes = {
  table: PropTypes.object.isRequired,
};
