import { createContext, useContext, useEffect, useState, ReactNode } from "react";
  import { jwtDecode } from "jwt-decode";
  import { AuthTokenPayload } from "../types/AuthTokenPayload";
  import { User } from "../types/User";
  
  interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
  }
  
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
  
    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (token) {
          try {
            const decoded = jwtDecode<AuthTokenPayload>(token);
            const { sub, email, exp, user_metadata } = decoded;
            const { nome, user_type } = user_metadata;
      
            if (Date.now() >= exp * 1000) {
              logout();
            } else {
              setUser({ user_id: sub, email, name: nome, user_type, token });
            }
          } catch (err) {
            console.error("Token inválido", err);
            logout();
          }
        }
      }, []);
  
    const login = (token: string) => {
        localStorage.setItem("auth_token", token);
        const decoded = jwtDecode<AuthTokenPayload>(token);
        const { sub, email, user_metadata } = decoded;
        const { nome, user_type } = user_metadata;
      
        setUser({ user_id: sub, email, name: nome, user_type, token });
    };
  
    const logout = () => {
      localStorage.removeItem("auth_token");
      setUser(null);
    };
  
    return (
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
    return context;
  };
  