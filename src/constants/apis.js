import { getSessionData } from "utils/sessionStorage";
const {tenantId}=getSessionData();
// export const USER_LIST=`https://localhost:7171/api/user/by-tenant?tenantId=${tenantId}`;

export const BASE_URL=`https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api`;

export const USER_LIST=`${BASE_URL}/user/by-tenant?tenantId=${tenantId}`;

export const USER_LOGIN=`${BASE_URL}/User/login?username=aaa&password=aa`;

export const WEEK_PLAN_LIST=`${BASE_URL}/VwComprehensive/all`;


// EXAMPLE URL  : // https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/VwTermPlanDetailsView/GetAll/1 
export const TERM_PLAN_DETAILS=`${BASE_URL}/VwTermPlanDetailsView/GetAll?tenantId=${tenantId}`;

export const WEEKLY_TIMETABLE_API=`${BASE_URL}/TimeTable/weekId/1/tenantId/${tenantId}/courseId/1`



