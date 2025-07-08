// Local Imports
import StudentAttendance from "./OrdersTable";
import { Page } from "components/shared/Page";
import { Overview } from "./Overview";
import { Calendar } from "./Calendar";
// import { Budget } from "./Budget";
// import { Income } from "./Income";
// import { Expense } from "./Expense";
// import { TopSellers } from "./TopSellers";
// import { SocialTraffic } from "./SocialTraffic";
// import { TopCountries } from "./TopCountries";
import {useState,useEffect} from "react";
import { studentDetails } from "./OrdersTable/data";

// ----------------------------------------------------------------------

export default function Orders() {
    const [selectedDate, setSelectedDate] = useState(new Date());
      const [studentsData, setStudentsData] = useState(null);

useEffect(() => {
    async function fetchData() {
      try {
        const data = await studentDetails({
          date: selectedDate,
          tenantId: 1
        });
        setStudentsData(data);
      } catch (err) {
        console.error(err);
      }
    }
      fetchData();
    
  }, [selectedDate]);
  return (
    <Page title="Orders Dashboard">
      <div className="transition-content mt-5 px-(--margin-x) pb-8 lg:mt-6">
        <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
          <Overview data={studentsData} />
          
          <div className="col-span-12 grid grid-cols-4 gap-4 sm:grid-cols-2 sm:gap-5 lg:col-span-4 lg:grid-cols-2 lg:gap-6">
            <Calendar onDateChange={(date) => setSelectedDate(date)} />
          </div>
          {/* <TopSellers /> */}
          {/* <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:col-span-7 lg:gap-6 xl:col-span-6">
            <SocialTraffic />
            <TopCountries />
          </div>  */}
          <StudentAttendance date={selectedDate}/>
        </div>
      </div>
    </Page>
  );
}
