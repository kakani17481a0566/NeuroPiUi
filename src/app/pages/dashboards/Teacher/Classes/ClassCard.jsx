// Import Dependencies
import { ArrowUpRightIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import PropTypes from "prop-types";

// Local Imports
import { Avatar, Button, Card, Tag } from "components/ui";

// Color mapping for the left stripe
const colorMap = {
  primary: "bg-primary-600 dark:bg-primary-400",
  success: "bg-green-600 dark:bg-green-400",
  warning: "bg-yellow-600 dark:bg-yellow-400",
  danger: "bg-red-600 dark:bg-red-400",
  info: "bg-blue-600 dark:bg-blue-400",
};

export function ClassCard({ name, category, time, color, students }) {
  return (
    <Card className="flex overflow-hidden border-[3px] border-black rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Colored Stripe */}
      <div
        className={clsx(
          colorMap[color] || colorMap.primary,
          "w-1 sm:w-1.5 rounded-full"
        )}
      />

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:px-5">
        <div className="flex flex-col items-start">
          {/* Top Icon */}
          <DocumentTextIcon className="size-12 text-primary-600 mb-3" />

          <h3 className="line-clamp-2 font-medium text-gray-800 dark:text-dark-100">
            {name}
          </h3>
          <p className="text-xs-plus">{time}</p>

          <div className="mt-2">
            <Tag href="#" color={color}>
              {category}
            </Tag>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 flex justify-between items-center">
          <div className="flex -space-x-2">
            {students.map((student) => (
              <Avatar
                size={7}
                key={student.uid}
                name={student.name}
                src={student.avatar}
                classNames={{
                  root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                  display: "text-xs ring-2 ring-white dark:ring-dark-700",
                }}
              />
            ))}
          </div>
          <Button className="size-7 rounded-full" isIcon>
            <ArrowUpRightIcon className="size-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

ClassCard.propTypes = {
  name: PropTypes.string,
  category: PropTypes.string,
  time: PropTypes.string,
  color: PropTypes.string,
  students: PropTypes.array,
};
