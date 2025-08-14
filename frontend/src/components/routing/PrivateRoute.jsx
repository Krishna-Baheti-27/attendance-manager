import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

export default function PrivateRoute() {
  const { token } = useContext(AuthContext);
  if (token) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
}
