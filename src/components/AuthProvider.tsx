import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";
import { AuthTokenPayload } from "../types/AuthTokenPayload";
import { User } from "../types/User";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 🆕 novo estado

  const login = (token: string) => {
    localStorage.setItem("auth_token", token);
    const decoded = jwtDecode<AuthTokenPayload>(token);
    setUser({
      user_id: decoded.sub || decoded.subject || "",
      user_type: decoded.user_type || decoded.user_metadata?.user_type || "aluno",
      token,
    });
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      try {
        const decoded = jwtDecode<AuthTokenPayload>(token);
        if (Date.now() >= decoded.exp * 1000) return logout();
        setUser({
          user_id: decoded.sub || decoded.subject || "",
          user_type: decoded.user_type || decoded.user_metadata?.user_type || "aluno",
          token,
        });
      } catch {
        logout();
      }
    }
    setIsLoading(false); // <- termina o carregamento
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
