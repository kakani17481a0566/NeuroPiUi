// import { useState } from "react";
import { academics } from "./academics";
import { dashboards } from "./dashboards";
import { UserManagement } from "./UserManagement";
import { getSessionData } from "utils/sessionStorage";
const details=getSessionData();
const role=details.role;
let navigation=[];
if(role==="Teacher"){
   navigation=[academics]
}
 else if(role==="Nanny"){
    navigation=[dashboards]
}
else if(role=="chairman"){
    navigation=[dashboards,academics,UserManagement];
}


export { navigation };
export { baseNavigation } from './baseNavigation'
