export interface User {
  user_id: string;
  user_type: "aluno" | "professor" | "admin";
  token: string;
}