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

export const setSessionData = ({ token, tid, uid, userName, roleName, departmentId, branchId, weekId, termId, courses }) => {
  jwtToken = token;
  tenantId = tid;
  userId = uid;
  user = userName;
  role = roleName;
  department = departmentId;
  branch = branchId;
  week = weekId;
  term = termId;
  course = courses;

  localStorage.setItem("authToken", token);
  localStorage.setItem("tenantId", tid);
  localStorage.setItem("userId", uid);
  localStorage.setItem("user", user);
  localStorage.setItem("role", role);
  localStorage.setItem("department", department);
  localStorage.setItem("weekId", week);  
  localStorage.setItem("termId", term);  
  localStorage.setItem("branchId", branch); 
  localStorage.setItem("courses", JSON.stringify(course)); 
};

export const getSessionData = () => ({
  token: jwtToken || localStorage.getItem("authToken"),
  tenantId: tenantId || localStorage.getItem("tenantId"),
  userId: userId || localStorage.getItem("userId"),
  user: user || localStorage.getItem("user"),
  role: role || localStorage.getItem("role"),
  department: department || localStorage.getItem("department"),
  week: week || localStorage.getItem("weekId"), 
  term: term || localStorage.getItem("termId"), 
  branch: branch || localStorage.getItem("branchId"), 
  course: course || JSON.parse(localStorage.getItem("courses") || "null"), 
});

export const clearSessionData = () => {
  jwtToken = null;
  tenantId = null;
  userId = null;
  user = null;
  role = null;
  department = null;
  week = null;
  term = null;
  course = null;
  branch = null;

  localStorage.removeItem("authToken");
  localStorage.removeItem("tenantId");
  localStorage.removeItem("userId");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  localStorage.removeItem("department");
  localStorage.removeItem("weekId");
  localStorage.removeItem("termId");
  localStorage.removeItem("branchId");
  localStorage.removeItem("courses");
};

