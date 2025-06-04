import React, { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type PrivateRouteProps = {
  children: JSX.Element;
  allowedTypes: string[];
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedTypes }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>; // ou qualquer loader
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (!allowedTypes.includes(user.user_type)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;