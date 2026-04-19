import { Navigate, Outlet } from "react-router-dom";

export const UserProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");
  return token && role === "user" ? <Outlet /> : <Navigate to="/login" />;
};

export const AdminProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");
  return token && role === "admin" ? <Outlet /> : <Navigate to="/admin" />;
};

export const CatererProtectedRoute = () => {
  const token = localStorage.getItem("catererToken");
  return token ? <Outlet /> : <Navigate to="/caterer/login" />;
};
