// import { useState } from "react";
import { academics } from "./academics";
import { dashboards } from "./dashboards";
import { UserManagement } from "./UserManagement";
import { getSessionData } from "utils/sessionStorage";
const details=getSessionData();
const role=details.role;
let navigation=[];
console.log(details);
if(role==="Teacher"){
   navigation=[academics,dashboards]
}
 else if(role==="Nanny"){
    navigation=[dashboards]
}
else{
    navigation=[UserManagement,dashboards];
}


export { navigation };
export { baseNavigation } from './baseNavigation'
