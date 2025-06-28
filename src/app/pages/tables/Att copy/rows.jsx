// Import Dependencies
import PropTypes from "prop-types";
import dayjs from "dayjs";

// Local Imports
import { Badge } from "components/ui";
import { Highlight } from "components/shared/Highlight";
import { useLocaleContext } from "app/contexts/locale/context";
import { ensureString } from "utils/ensureString";

// ----------------------------------------------------------------------

// ✅ Cell: Student Name
export function StudentNameCell({ getValue, column, table }) {
  const globalQuery = ensureString(table.getState().globalFilter);
  const columnQuery = ensureString(column.getFilterValue());
  const name = getValue();

  return (
    <span className="truncate block max-w-[160px] font-medium text-gray-800 dark:text-dark-100">
      <Highlight query={[globalQuery, columnQuery]}>{name}</Highlight>
    </span>
  );
}

// ✅ Cell: Date Only
export function DateCell({ getValue }) {
  const { locale } = useLocaleContext();
  const raw = getValue();
  if (!raw) return <span className="text-gray-400">—</span>;

  const date = dayjs(raw).locale(locale).format("DD MMM YYYY");
  return (
    <span className="text-sm text-gray-700 dark:text-dark-100">{date}</span>
  );
}

// ✅ Cell: Time
export function TimeCell({ getValue }) {
  const time = getValue();
  return (
    <span className="truncate max-w-[120px] text-sm font-medium text-gray-700 dark:text-dark-100">
      {time || "—"}
    </span>
  );
}

// ✅ Cell: Attendance Status (with color badge)
export function StatusCell({ getValue }) {
  const status = getValue();
  let color = "gray";
  if (status === "Checked-In") color = "info";
  else if (status === "Checked-Out") color = "success";
  else if (status === "Not Marked") color = "warning";

  return (
    <Badge color={color} className="capitalize truncate max-w-[140px]">
      {status}
    </Badge>
  );
}

// ✅ Cell: MarkedBy / UpdatedBy
export function UserCell({ getValue }) {
  const user = getValue();
  return (
    <span className="truncate max-w-[140px] text-sm text-gray-600 dark:text-dark-300">
      {user || "—"}
    </span>
  );
}

// ----------------------------------------------------------------------
// PropTypes

StudentNameCell.propTypes = {
  getValue: PropTypes.func,
  column: PropTypes.object,
  table: PropTypes.object,
};

DateCell.propTypes = {
  getValue: PropTypes.func,
};

TimeCell.propTypes = {
  getValue: PropTypes.func,
};

StatusCell.propTypes = {
  getValue: PropTypes.func,
};

UserCell.propTypes = {
  getValue: PropTypes.func,
};
