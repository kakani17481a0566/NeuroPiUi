import { Button, Card, Table, TBody, Td, THead, Tr } from "components/ui";
// import { PaginationSection } from "./PaginationSection";
// import { SelectedRowsActions } from "./SelectedRowsActions";
import { useState, useEffect } from "react";
import { fetchStudents } from "app/pages/dashboards/Teacher/Students/data";
//import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel } from "@tanstack/react-table";
// import { columns } from "./columns";
// import clsx from "clsx";
import { Checkbox, Avatar, Select } from "components/ui";
import {
  Pagination,
  PaginationItems,
  PaginationNext,
  PaginationPrevious,
  Spinner
} from "components/ui";
import { fetchCourses } from "app/pages/dashboards/constantData/Courses";
import { fetchBranches } from "app/pages/dashboards/constantData/Branches";






export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState(); // ID of selected course
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadStudents() {
      const courses = await fetchCourses();
      const branches = await fetchBranches();
      setCourses(courses);
      setBranches(branches);
      setSelectedBranchId(branches[0].id);
      const data = await fetchStudents(courses[0].id, branches[0].id);
      setStudents(data.students);
      setLoading(false);
    }
    loadStudents()
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;


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
    setLoading(true)
    const data = await fetchStudents(value, selectedBranchId);
    setStudents(data.students);
    setLoading(false);
  }
  const handleBranchChnage = async (e) => {
    const value = e.target.value;
    setSelectedBranchId(value);

  }



  const handleSave = () => {
    const selected = students.getSelectedRowModel().rows.map(row => row.original);
    console.log("Selected Students:", selected);
  }

  return (
    <Card className="flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-dark-500">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Course</label>
          <div className="relative z-10">
            <Select  onChange={handleCourseChnage}>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Branch</label>
          <div className="relative z-10">
            <Select  onChange={handleBranchChnage}>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-600">{currentDate}</p>
          <Button onClick={handleSave} className="ml-auto">
            Save
          </Button>
        </div>
      </div>



      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner color="primary" className="size-14 border-4" />
        </div>
      ) : (
        <div className="relative mt-5">
          <div className="table-wrapper min-w-full overflow-x-auto">
            <Table hoverable className="w-full text-left rtl:text-right">
              <THead>
                <Tr>
                  <Td className="text-lg font-semibold">
                    Student Name
                  </Td>
                  <Td className="text-lg font-semibold">
                    Check IN
                  </Td>
                  <Td className="text-lg font-semibold">
                    Check OUT
                  </Td>

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
          <Avatar src="https://res.cloudinary.com/kakani7/image/upload/v1750826264/MSI/wgs9xojgcs44xhupfh2f.png" />
          {row.name}
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

          {/* <SelectedRowsActions table={table} /> */}
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
