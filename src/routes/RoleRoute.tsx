import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

export default function RoleRoute({ roles }: { roles: string[] }) {
  const user = useAppSelector((state) => state.auth.user);
  if (!user) return <Navigate to="/account" replace />;
  return roles.map((role) => role.toLowerCase()).includes(user.role.toLowerCase())
    ? <Outlet />
    : <Navigate to="/" replace />;
}
