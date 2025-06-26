import { useEffect, useState } from "react";
import { StudentCard } from "./StudentCard";
import { Spinner } from "components/ui";
import { UserGroupIcon } from "@heroicons/react/24/outline"; // Import the outline icon

export function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle device resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://localhost:7202/api/Student/by-tenant-course-branch?tenantId=1&courseId=1&branchId=1"
        );
        const result = await response.json();
        if (result.statusCode === 200 && Array.isArray(result.data)) {
          const enriched = result.data.map((s, index) => ({
            uid: s.id,
            name: s.name,
            avatar: "https://res.cloudinary.com/kakani7/image/upload/v1750826264/MSI/wgs9xojgcs44xhupfh2f.png",
            isOnline: index % 2 === 0,
            progress: Math.floor(Math.random() * 100),
            messagesCount: index % 3 === 0 ? index : null,
          }));
          setStudents(enriched);
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="sm:col-span-2 lg:col-span-1 text-primary-600">
      <div className="flex h-8 items-center justify-between">
        <UserGroupIcon className="w-6 h-6 text-[#1A4255]" />
      <h2 className="font-medium tracking-wide text-gray-800 dark:text-dark-100">
        Students
      </h2>
        <a
          href="##"
          className="border-b border-dotted border-current pb-0.5 text-xs-plus font-medium text-primary-600 outline-hidden transition-colors duration-300 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70"
        >
          View All
        </a>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <Spinner
            color="primary"
            className={isMobile ? "size-10 border-2" : "size-14 border-4"}
          />
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-5 lg:grid-cols-1">
          {students.map((student) => (
            <StudentCard
              key={student.uid}
              name={student.name}
              avatar={student.avatar}
              isOnline={student.isOnline}
              progress={student.progress}
              messagesCount={student.messagesCount}
            />
          ))}
        </div>
      )}
    </div>
  );
}
