// Import Dependencies
import { ArrowUpRightIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
// import clsx from "clsx";
import PropTypes from "prop-types";

// Local Imports
import { Avatar, Button, Card, Tag } from "components/ui";

// Domain-specific color mapping
const domainColorMap = {
  CLL: "#465C8A",
  PSRN: "#D2486E",
  KUW: "#E27257",
  PD: "#713427",
  EAD: "#DA973A",
  PSED: "#475468",
};

export function ClassCard({ name, category, time, students }) {
  const domainColor = domainColorMap[name] || "#465C8A"; // Fallback to CLL blue

  return (
    <Card className="group flex overflow-hidden border border-gray-300 dark:border-dark-700 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
      {/* Colored Stripe */}
      <div
        className="w-1 sm:w-1.5"
        style={{ backgroundColor: domainColor }}
      />

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="flex flex-col gap-1">
          {/* Icon */}
          <DocumentTextIcon className="w-8 h-8 text-primary-600 mb-2" />

          {/* Title */}
          <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-100 line-clamp-2">
            {name}
          </h3>

          {/* Time */}
          <p className="text-xs text-gray-500 dark:text-dark-300">{time}</p>

          {/* Tag with custom background */}
          <div className="mt-2 max-w-full">
            <Tag
              className="w-full text-center whitespace-normal break-words line-clamp-2 text-white"
              style={{ backgroundColor: domainColor }}
            >
              {category}
            </Tag>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex justify-between items-center pt-4">
          <div className="flex -space-x-2">
            {students.map((student) => (
              <Avatar
                size={7}
                key={student.uid}
                name={student.name}
                src={student.avatar}
                classNames={{
                  root: "origin-bottom transition-transform hover:z-10 hover:scale-110",
                  display: "text-xs ring-2 ring-white dark:ring-dark-700",
                }}
              />
            ))}
          </div>
          <Button
            className="size-7 rounded-full group-hover:bg-primary-600 group-hover:text-white transition"
            isIcon
          >
            <ArrowUpRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

ClassCard.propTypes = {
  name: PropTypes.string.isRequired,     // Domain like CLL, PSED, etc.
  category: PropTypes.string.isRequired, // Topic
  time: PropTypes.string.isRequired,     // Day (e.g., Monday)
  students: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      name: PropTypes.string,
      avatar: PropTypes.string,
    })
  ),
};

ClassCard.defaultProps = {
  students: [],
};
