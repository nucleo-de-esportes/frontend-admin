export interface User {
    user_id: string;
    email: string;
    name: string;
    user_type: "aluno" | "professor" | "admin";
    token: string;
  }