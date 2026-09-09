// import authService from "@/services/auth.services";
// import { Navigate } from "react-router-dom";


// const ProtectedRoute = ({ allowedRoles = [], children }) => {
    
//   const isAuthenticated = authService.isAuthenticated();
//   const user = authService.getCurrentUser();
//     console.log("this is allowed role", allowedRoles);
//     console.log("User =>", user);
// console.log("Role =>", user?.role);
// console.log("Role Name =>", user?.role?.name);
//   // Case 1: Not logged in
//   if (!isAuthenticated) {
    
//     return <Navigate to="/login" replace />;
//   }
  
//   // Case 2: Logged in but role not allowed (authorization)
//   if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role?.name)) {
    
//     // Role not allowed – maybe redirect to their own dashboard or 403 page
//     return <Navigate to="/unauthorized" replace />;
//   }
  
//   // Case 3: Authorized – render child routes
  
//   return children;
// };

// export default ProtectedRoute;
import authService from "@/services/auth.services";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles = [], children }) => {

  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const roleName = user?.role?.name;

  // Super Admin Routes
  if (allowedRoles.includes("super-admin")) {

    if (roleName !== "super-admin") {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  }

  // Employee Routes
  if (allowedRoles.includes("employee")) {

    // Super Admin employee routes me nahi jayega
    if (roleName === "super-admin") {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  }

  return children;
};

export default ProtectedRoute;