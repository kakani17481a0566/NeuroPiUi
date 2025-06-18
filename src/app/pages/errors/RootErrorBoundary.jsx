// Import Dependencies
import { isRouteErrorResponse, useRouteError } from "react-router";
import { lazy } from "react";

// Local Imports
import { Loadable } from "components/shared/Loadable";

// ----------------------------------------------------------------------

const app = {
  401: lazy(() => import("./401")),
  // 403: lazy(() => import("./403")),
  404: lazy(() => import("./404")),
  429: lazy(() => import("./429")),
  500: lazy(() => import("./500")),
};

function RootErrorBoundary() {
  const error = useRouteError();
  
  // Handle route error responses (HTTP errors)
  if (isRouteErrorResponse(error)) {
    // Try to get the exact error message from different possible locations
    const errorMessage = 
      error.data?.message || 
      error.statusText || 
      `HTTP Error ${error.status}`;

    // Check if we have a specific component for this status code
    if (app[error.status]) {
      const Component = Loadable(app[error.status]);
      return <Component errorMessage={errorMessage} />;
    }

    // Fallback for unhandled status codes
    return (
      <div>
        <h1>Error {error.status}</h1>
        <p>{errorMessage}</p>
        {error.data && <pre>{JSON.stringify(error.data, null, 2)}</pre>}
      </div>
    );
  }

  // Handle Error objects
  if (error instanceof Error) {
    return (
      <div>
        <h1>Application Error</h1>
        <p>{error.message}</p>
        {import.meta.env.MODE === 'development' && (
          <pre>{error.stack}</pre>
        )}
      </div>
    );
  }

  // Handle string errors (if someone throws just a string)
  if (typeof error === 'string') {
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  // Fallback for completely unknown errors
  return (
    <div>
      <h1>Unknown Error</h1>
      <p>{JSON.stringify(error, null, 2)}</p>
    </div>
  );
}

export default RootErrorBoundary;