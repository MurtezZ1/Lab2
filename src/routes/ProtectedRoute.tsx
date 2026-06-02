import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

export default function ProtectedRoute() {
  const user = useAppSelector((state) => state.auth.user);
  return user ? <Outlet /> : <Navigate to="/account" replace />;
}
