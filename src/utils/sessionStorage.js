// src/utils/sessionStorage.js

let jwtToken = null;
let tenantId = null;
let userId = null;

export const setSessionData = ({ token, tid, uid }) => {
  jwtToken = token;
  tenantId = tid;
  userId = uid;

  localStorage.setItem("authToken", token);
  localStorage.setItem("tenantId", tid);
  localStorage.setItem("userId", uid);
};

export const getSessionData = () => ({
  token: jwtToken || localStorage.getItem("authToken"),
  tenantId: tenantId || localStorage.getItem("tenantId"),
  userId: userId || localStorage.getItem("userId"),
});

export const clearSessionData = () => {
  jwtToken = null;
  tenantId = null;
  userId = null;

  localStorage.removeItem("authToken");
  localStorage.removeItem("tenantId");
  localStorage.removeItem("userId");
};
