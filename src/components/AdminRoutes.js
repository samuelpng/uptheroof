// components/AdminRoute.js
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminRoute = () => {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;
  
  if (!isAdmin) return <Navigate to="/login" />; // Or a custom "Not authorized" page

  return <Outlet />;
};

export default AdminRoute;
