import { Button, Card, Table, TBody, Td, THead, Tr } from "components/ui";
import { useState, useEffect } from "react";
import { fetchStudents } from "app/pages/dashboards/Teacher/Students/data";
import { Checkbox, Avatar, Select } from "components/ui";
import {
  Pagination,
  PaginationItems,
  PaginationNext,
  PaginationPrevious,
  Spinner,
} from "components/ui";
import { fetchCourses } from "app/pages/dashboards/constantData/Courses";
import { fetchBranches } from "app/pages/dashboards/constantData/Branches";






export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState();
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    async function loadStudents() {
      const courses = await fetchCourses();
      const branches = await fetchBranches();
      if (!courses.length || !branches.length) return;

      setCourses(courses);
      setBranches(branches);
      setSelectedBranchId(branches[0].id);

      const data = await fetchStudents(courses[0].id, branches[0].id);
      setStudents(data.students);
      setLoading(false);
    }
    loadStudents();
  }, []);

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const totalPages = Math.ceil(students.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const currentStudents = students.slice(startIdx, startIdx + pageSize);

  const handleCourseChnage = async (e) => {
    const value = e.target.value;
    setLoading(true);
    const data = await fetchStudents(value, selectedBranchId);
    setStudents(data.students);
    setLoading(false);
  };

  const handleBranchChnage = async (e) => {
    const value = e.target.value;
    setSelectedBranchId(value);
  };

  const handleSave = () => {
    console.log("Save clicked – logic can be added here.");
  };

  return (
    <Card className="flex flex-col">
      {/* Filters and Header */}
      <div className="flex flex-wrap justify-between gap-4 items-center p-4 border-b border-gray-200 dark:border-dark-500">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700 dark:text-white">Course</label>
          <Select className="max-w-[160px] sm:max-w-xs w-full" onChange={handleCourseChnage}>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700 dark:text-white">Branch</label>
          <Select className="max-w-[160px] sm:max-w-xs w-full" onChange={handleBranchChnage}>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-600 dark:text-white">{currentDate}</p>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>

      {/* Table or Loader */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner color="primary" className="size-14 border-4" />
        </div>
      ) : (
        <div className="relative mt-5 w-full">
          <div className="overflow-x-auto w-full">
            <Table hoverable className="min-w-full text-left rtl:text-right">
              <THead>
                <Tr>
                  <Td className="text-base font-semibold">Student Name</Td>
                  <Td className="text-base font-semibold">Check IN</Td>
                  <Td className="text-base font-semibold">Check OUT</Td>
                </Tr>
              </THead>
              <TBody>
                {currentStudents.length === 0 ? (
                  <Tr>
                    <Td className="py-4 text-center dark:text-white" colSpan={3}>
                      No students found
                    </Td>
                  </Tr>
                ) : (
                  currentStudents.map((row) => (
                    <Tr key={row.id}>
                      <Td className="px-4 py-2 dark:text-white flex items-center gap-2">
                        <Avatar
                          src="https://res.cloudinary.com/kakani7/image/upload/v1750991225/MSI/STUDENTS/rkxdfpasbax4am8vfdo1.png"
                          alt={row.name}
                          className="h-10 w-10 min-w-10 min-h-10 rounded-full object-cover"
                        />
                        <span className="text-sm md:text-base truncate max-w-[150px]">{row.name}</span>
                      </Td>
                      <Td className="px-4 py-2 dark:text-white">
                        <label className="cursor-pointer">
                          <Checkbox />
                        </label>
                      </Td>
                      <Td className="px-4 py-2 dark:text-white">
                        <label className="cursor-pointer">
                          <Checkbox />
                        </label>
                      </Td>
                    </Tr>
                  ))
                )}
              </TBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="max-w-xl mt-4">
            <Pagination total={totalPages} value={currentPage} onChange={setCurrentPage}>
              <PaginationPrevious />
              <PaginationItems />
              <PaginationNext />
            </Pagination>
          </div>
        </div>
      )}
    </Card>
  );
}
