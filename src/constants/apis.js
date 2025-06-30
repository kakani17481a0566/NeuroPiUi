import { getSessionData } from "utils/sessionStorage";
const {tenantId,week,branch,course}=getSessionData();
// export const USER_LIST=`https://localhost:7171/api/user/by-tenant?tenantId=${tenantId}`;
const defaultCourse = course && course.length > 0 ? course[0].id : null;
export const BASE_URL=`https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api`;

export const USER_LIST=`${BASE_URL}/user/by-tenant?tenantId=${tenantId}`;

// export const USER_LOGIN=`${BASE_URL}/User/login?username=aaa&password=aa`;

export const WEEK_PLAN_LIST=`${BASE_URL}/VwComprehensive/all`;


// EXAMPLE URL  : // https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/VwTermPlanDetailsView/GetAll/1 
export const TERM_PLAN_DETAILS=`${BASE_URL}/VwTermPlanDetailsView/GetAll?tenantId=${tenantId}`;

export const WEEKLY_TIMETABLE_API=`${BASE_URL}/TimeTable/weekId/${week}/tenantId/${tenantId}/courseId/${defaultCourse}`;

export const STUDENTS_LIST=`${BASE_URL}/Student/by-tenant-course-branch?tenantId=${tenantId}`;

export const GET_GRADES_BY_TENANTID_COURSEID_BRANCHID_TIMETABLEID=`${BASE_URL}/AssessmentMatrix/timetable/1/tenant/${tenantId}/course/${defaultCourse}/branch/${branch}`;


export const SAVE_ASSESSMENT_MATRIX = "https://localhost:7202/api/DailyAssessment/save-matrix";
export const COURSES_LIST=`${BASE_URL}/Course/tenant/${tenantId}`;
export const BRANCHES_LIST=`${BASE_URL}/Branch/tenant/${tenantId}`;
