import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loading from "./Loading";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  // Se o usuário já está autenticado, redireciona para /home
  if (user) {
    return <Navigate to="/turmas" replace />;
  }

  // Se não está autenticado, mostra a página pública (login/cadastro)
  return <>{children}</>;
};

export default PublicRoute;
