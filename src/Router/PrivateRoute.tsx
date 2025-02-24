import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../src/Store/useAuthStore";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const role = useAuthStore().grupo;

  if (!role) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role) && (role=='Admin' || role==='Mesero')) return <Navigate to="/mesasBar" replace />;
  if (!allowedRoles.includes(role) && role=='Cliente') return <Navigate to="/client/dashboard" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
