import { getSessionData } from "utils/sessionStorage";
const {tenantId}=getSessionData();
// export const USER_LIST=`https://localhost:7171/api/user/by-tenant?tenantId=${tenantId}`;



export const USER_LIST=`https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/user/by-tenant?tenantId=${tenantId}`;

export const USER_LOGIN=`https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/User/login?username=aaa&password=aa`;
//https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/VwComprehensive/all


export const WEEAK_PLAN_LIST=`https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/VwComprehensive/all`;

//   'https://localhost:7202/api/User/login?username=aaa&password=aa' \
