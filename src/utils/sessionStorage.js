// src/utils/sessionStorage.js

let jwtToken = null;
let tenantId = null;
let userId = null;
let user=null;

export const setSessionData = ({ token, tid, uid,userProfile }) => {
  jwtToken = token;
  tenantId = tid;
  userId = uid;
  user=userProfile;

  localStorage.setItem("authToken", token);
  localStorage.setItem("tenantId", tid);
  localStorage.setItem("userId", uid);
  localStorage.setItem("user",user);
};

export const getSessionData = () => ({
  token: jwtToken || localStorage.getItem("authToken"),
  tenantId: tenantId || localStorage.getItem("tenantId"),
  userId: userId || localStorage.getItem("userId"),
  user: user || localStorage.getItem("user"),

});

export const clearSessionData = () => {
  jwtToken = null;
  tenantId = null;
  userId = null;

  localStorage.removeItem("authToken");
  localStorage.removeItem("tenantId");
  localStorage.removeItem("userId");
};
