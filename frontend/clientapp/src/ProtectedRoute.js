import { useContext, useLocation } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const location = useLocation();
  const { authLogin } = useContext(localStorage.getItem("isLogged"));
  console.log("authLogin", authLogin);

  return authLogin ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};
