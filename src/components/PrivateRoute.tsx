import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type PrivateRouteProps =
  | {
    allowedTypes: string[];
    children: React.ReactElement;
    elementByType?: never;
  }
  | {
    allowedTypes: string[];
    children?: never;
    elementByType?: { [key: string]: React.ReactElement };
  };

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedTypes, children, elementByType }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (!allowedTypes.includes(user.user_type)) {
    return <Navigate to="/turmas" />;
  }

  if (elementByType) {
    const Component = elementByType[user.user_type];
    return Component || <Navigate to="/" />;
  }

  return children!;
};

export default PrivateRoute;