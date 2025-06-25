import { Page } from "components/shared/Page";
import { UserCard } from "./UserCard";
import { fetchStudents } from "app/pages/dashboards/Teacher/Students/data";
import { useEffect, useState } from "react";
import { getSessionData } from "utils/sessionStorage";

// 🔥 If you want search/filter later, uncomment and use useFuse
import { useFuse } from "hooks";
import { Toolbar } from "./Toolbar";
// import { fetchCourses, fetchBranches } from './Toolbar';

export default function UsersCard2() {

  const [studentsList, setStudentsList] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const token = getSessionData("accessToken");
      const result = await fetchStudents(token);
      if (Array.isArray(result)) {
        setStudentsList(result);
      }
    };


    fetchData();
  }, [refreshTrigger]);
  const handleRefresh = () => setRefreshTrigger((prev) => !prev);
  const {
    // result:studentsList ,
    query,
    setQuery,
  } = useFuse(studentsList, {
    keys: ["name", "location"],
    threshold: 0.2,
    matchAllOnEmptyQuery: true,
  });
  // const [selectedBranch, setSelectedBranch] = useState("");
  // const [selectedCourse, setSelectedCourse] = useState("");

  // const branches = fetchBranches();
  // const courses = fetchCourses();
  return (
    <Page title="Users Card 2">
      <div className="transition-content w-full px-(--margin-x) pb-8">
        {/* Uncomment if you're adding search */}
        <Toolbar setQuery={setQuery} query={query} onStudentAdded={handleRefresh} />
        {/* <div className="mb-4 flex gap-4">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Branches</option>
            {branches.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>

          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Courses</option>
            {courses.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div> */}



        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
          {studentsList.map((student) => (
            <UserCard
              key={student.id}
              name={student.name}
              course={student.courseName}
              branchName={student.branchName}
              socialLinks={{
                twitter: "https://twitter.com",
                instagram: "https://instagram.com",
                facebook: "https://facebook.com",
              }}
              // Optional props if your card handles them:
              avatar={student.avatar || "https://res.cloudinary.com/kakani7/image/upload/v1750826264/MSI/wgs9xojgcs44xhupfh2f.png"}
              cover={student.cover || "/images/800x600.png"}
              // src="https://res.cloudinary.com/kakani7/image/upload/v1746172182/MSI/yqjbpqtuvuf0co08zai4.svg"
              color="primary" // or assign based on logic
              //socialLinks={{}} // or dummy data
              chartData={[20, 30, 40]} // if you want to mock some data
            />
          ))}
        </div>
      </div>
    </Page>
  );
}
