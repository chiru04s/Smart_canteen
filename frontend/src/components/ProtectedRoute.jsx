import { Navigate, Outlet } from "react-router-dom";

const UserProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  console.log("User Protected:", token, role);

  // If the user is logged in and has a user role, allow access
  return token && role === "user" ? <Outlet /> : <Navigate to="/login" />;
};

const AdminProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  console.log("Admin Protected:", token, role);

  // If the admin is logged in and has an admin role, allow access
  return token && role === "admin" ? <Outlet /> : <Navigate to="/admin" />;
};

export { UserProtectedRoute, AdminProtectedRoute };
