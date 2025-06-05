import { getSessionData } from "utils/sessionStorage";
const {tenantId}=getSessionData();
export const USER_LIST=`https://localhost:7171/api/user/by-tenant?tenantId=${tenantId}`;
