import { Navigate } from "react-router";
import { getSessionData } from "utils/sessionStorage";

export default function RoleBasedRedirect() {
  const { role } = getSessionData();
  if (role === "Nanny") return <Navigate to="/dashboards/attendance" />;
  return <Navigate to="/dashboards/teacher" />;
}
