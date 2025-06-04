import { User } from "./User";

export type AuthContextType = {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean; // 🆕
};
