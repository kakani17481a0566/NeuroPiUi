// Import Dependencies
import { Fragment, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  ArrowDownTrayIcon,
  ChevronDownIcon,
  Cog8ToothIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { RiFilter3Line } from "react-icons/ri";
import clsx from "clsx";
import { conversionToPdf } from 'utils/convertToPdf';
import axios from "utils/axios";


// Local Imports
import { Button, Input } from "components/ui";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { useIsomorphicEffect } from "hooks";
import { fetchStudents } from "app/pages/dashboards/Teacher/Students/data";
import { useEffect } from "react"; // make sure this is imported
import { getSessionData } from "utils/sessionStorage";

// ----------------------------------------------------------------------

export function Toolbar({ query, setQuery}) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const mobileSearchRef = useRef();

  const { isXs } = useBreakpointsContext();

  useIsomorphicEffect(() => {
    mobileSearchRef?.current?.focus();
  }, [showMobileSearch]);

  return (
    <div className="flex items-center justify-between py-5 lg:py-6">
      {showMobileSearch && isXs ? (
        <Input
          classNames={{
            root: "flex-1",
            input: "h-9 text-xs-plus",
          }}
          ref={mobileSearchRef}
          value={query || ""}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Users ..."
          prefix={<MagnifyingGlassIcon className="size-4.5" />}
          suffix={
            <Button
              variant="flat"
              className="pointer-events-auto size-6 shrink-0 rounded-full p-0"
              onClick={() => {
                setQuery("");
                setShowMobileSearch(false);
              }}
            >
              <XMarkIcon className="size-4.5 text-gray-500 dark:text-dark-200" />
            </Button>
          }
        />
      ) : (
        <>
          <div className="flex items-center space-x-1 ">
            <h2 className="truncate text-xl font-medium text-gray-700 dark:text-dark-50 lg:text-2xl">
              Students
            </h2>
            <ActionMenu />
          </div>
          <div className="flex items-center space-x-1 ">
            <Input
              classNames={{
                input: "h-9 rounded-full text-xs-plus",
                root: "max-sm:hidden",
              }}
              value={query || ""}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Users ..."
              className=""
              prefix={<MagnifyingGlassIcon className="size-4.5" />}
            />
            <Button
              onClick={() => setShowMobileSearch(true)}
              className="size-9 shrink-0 rounded-full sm:hidden"
              isIcon
              variant="flat"
            >
              <MagnifyingGlassIcon className="size-5" />
            </Button>

            <Button
              className="size-9 shrink-0 rounded-full"
              isIcon
              variant="flat"
            >
              <RiFilter3Line className="size-5" />
            </Button>
            <Button
              className="size-9 shrink-0 rounded-full"
              isIcon
              variant="flat"
            >
              <Cog8ToothIcon className="size-5" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function ActionMenu({onStudentAdded }) {
  const columns = ['id', 'name', 'courseName', 'branchName'];
  // console.log(users);
  const [studentsList, setStudentsList] = useState([]);
  const [showNewStudent, setShowNewStudent] = useState(false);
  const [courses, setCourses] = useState([]);
  const { token, tenantId, userId } = getSessionData();
  const [newStudent, setNewStudent] = useState({
    name: "",
    courseId: "",
    tenantId: tenantId,
    branchId: "",
    createdby: userId,
    UpdatedBy: userId
  });
  const [branches, setBranches] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const token = getSessionData("accessToken"); // update as per your auth
      const result = await fetchStudents(token);    // wait for the async call
      setStudentsList(result);                      // set state
    };

    fetchData();
  }, []);
  const fetchCourses = async () => {
    // const token = getSessionData("token");
    try {
      const response = await axios.get("https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/Course/tenant/1", {
        headers: { Authorization: token },
      }
      );
      // if(!response.ok){
      //   return console.log("error not fetching the result");
      // }
      setCourses(response.data.data);
      console.log(response.data.data);
      console.log(courses);
    }
    catch (error) {
      console.error("failed to fetch courses", error);
    }
  };
  const fetchBranches = async () => {
    // const token = getSessionData("token");
    try {
      const response = await axios.get("https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/Branch/tenant/1", {
        headers: { Authorization: token },
      }
      );
      setBranches(response.data.data);
      console.log(response.data.data);
      console.log(courses);
    }
    catch (error) {
      console.error("failed to fetch courses", error);
    }
  };

  const convertToPdf = () => {

    conversionToPdf(columns, Array.isArray(studentsList) ? studentsList : [], 'users.pdf')
  }

  const handleNewStudent = () => {
    setShowNewStudent(true);
    fetchCourses();
    fetchBranches();
  }
  const handlePopUpClose = () => {
    setShowNewStudent(false);
  }
  const saveStudent = async () => {
    const response = await axios.post("https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/Student", newStudent, {
      headers: { Authorization: token },

    });
    if (response.status === 200 || response.status === 201) {
      alert("Student saved successfully!");
         onStudentAdded();
      handlePopUpClose(); // close modal
      // fetchData(); // refresh the main list
    }
    console.log(response);

  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton
        as={Button}
        variant="flat"
        className="size-8 shrink-0 rounded-full p-0"
      >
        <ChevronDownIcon className="size-4.5" strokeWidth="2" />
      </MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
      >
        <MenuItems className="absolute z-100 mt-1.5 min-w-[10rem] whitespace-nowrap rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0">
          <MenuItem>
            {({ focus }) => (
              <button onClick={handleNewStudent}
                className={clsx(
                  "flex h-9 w-full items-center space-x-2 px-3 tracking-wide outline-hidden transition-colors ",
                  focus &&
                  "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                )}
              >
                <PlusIcon className="size-4.5 stroke-2" />
                <span>New Student</span>
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center space-x-2 px-3 tracking-wide outline-hidden transition-colors ",
                  focus &&
                  "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                )}
                onClick={convertToPdf}
              >
                <ArrowDownTrayIcon className="size-4.5 stroke-2" />
                <span>Export Students</span>
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center space-x-2 px-3 tracking-wide outline-hidden transition-colors ",
                  focus &&
                  "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                )}
              >
                <Cog8ToothIcon className="size-4.5 stroke-2" />
                <span>Settings</span>
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Transition>
      {showNewStudent && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="relative w-full max-w-3xl rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">New Student</h2>
              <button
                onClick={handlePopUpClose}
                className="text-xl font-bold text-red-500"
                aria-label="Close PDF viewer"
              >
                &times;
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto rounded border p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newStudent.name}               
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring"
                  placeholder="Enter student name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Course</label>
                <select
                  name="courseId"
                  value={newStudent.courseId}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full rounded border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring"
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Branch</label>
                <select
                  name="branchId"
                  value={newStudent.branchId}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full rounded border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring"
                >
                  <option value="">Select a branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-4 text-right">
                <button
                  onClick={saveStudent}
                  type="submit"
                  className="rounded bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </Menu>

  );

}

Toolbar.propTypes = {
  query: PropTypes.string,
  setQuery: PropTypes.func,
   onStudentAdded: PropTypes.func,
};
