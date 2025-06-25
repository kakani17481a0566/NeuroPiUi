// import { useState } from "react";
import { academics } from "./academics";
import { dashboards } from "./dashboards";
import { UserManagement } from "./UserManagement";
import { getSessionData } from "utils/sessionStorage";
const details=getSessionData();
// eslint-disable-next-line react-hooks/rules-of-hooks
let navigation=[];
console.log(details);
if(details.role=="Teacher"){
   navigation=[academics]
}
else{
    navigation=[UserManagement,dashboards];
}


export { navigation };
export { baseNavigation } from './baseNavigation'
