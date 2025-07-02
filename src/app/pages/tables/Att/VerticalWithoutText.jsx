import PropTypes from "prop-types";
import { Box } from "components/ui";
import {
  CalendarDaysIcon,
  AcademicCapIcon,
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/outline";

const AttendanceHeaderBox = ({ date, className, checkedIn, checkedOut }) => {
  return (
    <Box className="flex h-20 w-full items-center justify-between gap-4 rounded-lg bg-gray-200 px-6 dark:bg-dark-100">
      {/* Left: Date */}
      <div className="flex items-center gap-2 text-sm font-medium text-primary-950">
        <CalendarDaysIcon className="size-5 shrink-0 text-primary-600" />
        <span>{date}</span>
      </div>

      {/* Center: Class Name */}
      <div className="flex items-center gap-2 text-xl font-semibold text-primary-950">
        <AcademicCapIcon className="size-6 shrink-0 text-primary-600" />
        <span>{className}</span>
      </div>

      {/* Right: Checked-In / Checked-Out */}
      <div className="text-right text-sm text-primary-950 space-y-1">
        <div className="flex items-center justify-end gap-1">
          <ArrowDownCircleIcon className="size-4 shrink-0 text-primary-600" />
          <span>Checked-In: {checkedIn}</span>
        </div>
        <div className="flex items-center justify-end gap-1">
          <ArrowUpCircleIcon className="size-4 shrink-0 text-primary-600" />
          <span>Checked-Out: {checkedOut}</span>
        </div>
      </div>
    </Box>
  );
};

AttendanceHeaderBox.propTypes = {
  date: PropTypes.string,
  className: PropTypes.string,
  checkedIn: PropTypes.number,
  checkedOut: PropTypes.number,
};

export { AttendanceHeaderBox };
