import authService from "@/services/auth.services";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Support both user.role === "admin" and user.role.name === "admin"
  const userRole = typeof user?.role === "string" ? user.role : user?.role?.name || "admin";

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole) && userRole !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;