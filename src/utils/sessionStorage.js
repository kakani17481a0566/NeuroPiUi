// src/utils/sessionStorage.js

let jwtToken = null;
let tenantId = null;
let userId = null;
let user=null;
let role=null;
let department=null;
let week = null;
let branch = null;
let term=null;
let course = null;

export const setSessionData = ({ token, tid, uid,userName ,roleName,departmentId,branchId,weekId,termId,courses}) => {
  jwtToken = token;
  tenantId = tid;
  userId = uid;
  user=userName;
  role=roleName;
  department=departmentId;
  branch=branchId;
  week=weekId;
  term=termId;
  course = courses;


  // localStorage.setItem("authToken", token);
  // localStorage.setItem("tenantId", tid);
  // localStorage.setItem("userId", uid);
  // localStorage.setItem("user",user);
  // localStorage.setItem("role",role);
  // localStorage.setItem("department", department);

};

export const getSessionData = () => ({
  token: jwtToken || localStorage.getItem("authToken"),
  tenantId: tenantId || localStorage.getItem("tenantId"),
  userId: userId || localStorage.getItem("userId"),
  user: user || localStorage.getItem("user"),
  role:role||localStorage.getItem("role"),
  department: department || localStorage.getItem("department"),
  week: week || localStorage.getItem("weekId"),
  branch: branch || localStorage.getItem("branchId"),
  term: term || localStorage.getItem("termId"),
  course: course || JSON.parse(localStorage.getItem("courses")),

});

export const clearSessionData = () => {
  jwtToken = null;
  tenantId = null;
  userId = null;

  localStorage.removeItem("authToken");
  localStorage.removeItem("tenantId");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
    localStorage.removeItem("user");

};
