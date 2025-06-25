import { Button, Card, Table, TBody, Td, THead, Tr } from "components/ui";
// import { PaginationSection } from "./PaginationSection";
// import { SelectedRowsActions } from "./SelectedRowsActions";
import { useState, useEffect } from "react";
import { fetchStudents } from "app/pages/dashboards/Teacher/Students/data";
//import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel } from "@tanstack/react-table";
// import { columns } from "./columns";
// import clsx from "clsx";
import { Checkbox,Avatar } from "components/ui";
import {
  Pagination,
  PaginationItems,
  PaginationNext,
  PaginationPrevious,
} from "components/ui";


// import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";
// const isSafari = getUserAgentBrowser() === "Safari";






export default function Attendance() {
  const [students, setStudents] = useState([]);
  useEffect(() => {
    async function loadStudents() {
      const data = await fetchStudents();
      console.log(data);
      setStudents(data);
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

  const handleSave = () => {
    const selected = students.getSelectedRowModel().rows.map(row => row.original);
    console.log("Selected Students:", selected);
    // TODO: call save API or logic here
  };
  // const table = useReactTable({
  //   data: students,
  //   // columns,
  //   // state: {
  //   //   sorting,
  //   //   globalFilter,
  //   // },
  //   // onSortingChange: setSorting,
  //   getCoreRowModel: getCoreRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  // });
  return (
    <Card className="flex flex-col">
      {/* 🆕 Top Section with Course and Date */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-dark-500">
        <div>
          <h2 className="text-lg font-semibold">Course: Nursery</h2>
          <p className="text-sm text-gray-600">{currentDate}</p>
        </div>
        <Button onClick={handleSave} className="ml-auto">Save</Button>
      </div>

      {/* 👇 Table */}
      <div className="relative mt-5">
        <div className="table-wrapper min-w-full overflow-x-auto">
          <Table hoverable className="w-full text-left rtl:text-right">
            <THead>
              <Tr>
                <Td className="text-lg font-semibold">
                  Student Name
                </Td>
                <Td className="text-lg font-semibold">
                Attendance
                </Td>

              </Tr>
            </THead>
            <TBody>
              {currentStudents.length === 0 ? (
                <Tr>
                  <Td  className="py-4 text-center dark:text-white">
                    No students found
                  </Td>
                </Tr>
              ) : (
                currentStudents.map((row) => (
                  <Tr key={row.id}>
                      <Td key={row.id}className="px-4 py-2 dark:text-white flex items-center gap-2">
                        <Avatar src="https://res.cloudinary.com/kakani7/image/upload/v1750751860/MSI/gor6z4k9ms5ylqzanugm.png" />
                        {row.name}
                      </Td>
                       <Td key={row.id} className="px-4 py-2 dark:text-white">
                        <Checkbox defaultChecked />
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
    </Card>
  );
}
