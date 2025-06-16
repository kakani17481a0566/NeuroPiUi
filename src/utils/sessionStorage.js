// src/utils/sessionStorage.js

let jwtToken = null;
let tenantId = null;
let userId = null;
let user=null;
let role=null;

export const setSessionData = ({ token, tid, uid,userName ,roleName}) => {
  jwtToken = token;
  tenantId = tid;
  userId = uid;
  user=userName;
  role=roleName;

  localStorage.setItem("authToken", token);
  localStorage.setItem("tenantId", tid);
  localStorage.setItem("userId", uid);
  localStorage.setItem("user",user);
  localStorage.setItem("role",role);

};

export const getSessionData = () => ({
  token: jwtToken || localStorage.getItem("authToken"),
  tenantId: tenantId || localStorage.getItem("tenantId"),
  userId: userId || localStorage.getItem("userId"),
  user: user || localStorage.getItem("user"),
  role:role||localStorage.getItem("role"),

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
