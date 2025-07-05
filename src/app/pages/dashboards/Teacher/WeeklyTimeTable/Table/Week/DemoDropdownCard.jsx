import { useEffect, useState, Fragment } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import clsx from "clsx";
import { Box, Button } from "components/ui";
import { getSessionData } from "utils/sessionStorage";

// 🔽 ReusableDropdown Component
const ReusableDropdown = ({ selected, options, onSelect, placeholder = "Select Option" }) => (
  <div className="w-full max-w-sm">
    <Menu as="div" className="relative w-full">
      <MenuButton as={Fragment}>
        {({ open }) => (
          <Button
            type="button"
            color="primary"
            className="w-full justify-between"
            aria-expanded={open}
          >
            <span>{selected ? selected.name : placeholder}</span>
            <ChevronDownIcon
              className={clsx("ml-2 size-4 transition-transform", open && "rotate-180")}
              aria-hidden="true"
            />
          </Button>
        )}
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <MenuItems className="absolute z-[100] mt-2 w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg dark:border-dark-500 dark:bg-dark-700">
          {options?.length > 0 ? (
            options.map((opt) => (
              <MenuItem key={opt.id} as={Fragment}>
                {({ active }) => (
                  <button
                    onClick={() => onSelect?.(opt)}
                    className={clsx(
                      "w-full px-4 py-2 text-left text-sm transition-colors",
                      active ? "bg-primary-600 text-white" : "text-gray-700 dark:text-gray-200"
                    )}
                  >
                    {opt.name}
                  </button>
                )}
              </MenuItem>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-400">No options available</div>
          )}
        </MenuItems>
      </Transition>
    </Menu>
  </div>
);

// 🧩 Main Dropdown Card
const DemoDropdownCard = ({ onCourseChange }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const { course } = getSessionData();
    const normalizedCourses = Array.isArray(course) ? course : course ? [course] : [];

    setCourses(normalizedCourses);

    if (normalizedCourses.length > 0) {
      setSelectedCourse(normalizedCourses[0]);
      onCourseChange?.(normalizedCourses[0].id);
    }
  }, []);

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    onCourseChange?.(course.id);
  };

  return (
    <div className="px-4 py-4">
      <Box className="w-full rounded-xl bg-gray-100 dark:bg-dark-500 p-4 shadow-sm">
        <h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
          Select a Grade
        </h3>
        <ReusableDropdown
          selected={selectedCourse}
          options={courses}
          onSelect={handleCourseSelect}
          placeholder="Choose Course"
        />
      </Box>
    </div>
  );
};

export default DemoDropdownCard;
