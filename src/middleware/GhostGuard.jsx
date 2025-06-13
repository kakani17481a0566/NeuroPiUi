// Import Dependencies
import { Navigate, useOutlet } from "react-router";

// Local Imports
import { useAuthContext } from "app/contexts/auth/context";
import { HOME_PATH, REDIRECT_URL_KEY } from "constants/app.constant";

// ----------------------------------------------------------------------


export default function GhostGuard() {
  const outlet = useOutlet();
  const { isAuthenticated } = useAuthContext();

  const url = `${new URLSearchParams(window.location.search).get(
    REDIRECT_URL_KEY,
  )}`;
    const redirectUrl = url && url !== "null" ? url : null;


  if (isAuthenticated) {
    if(redirectUrl){
    if (url && url !== "") {
      return <Navigate to={url} replace />;
    }

    return <Navigate to={HOME_PATH}  replace/>;
  }
}

  return <>{outlet}</>;
}
