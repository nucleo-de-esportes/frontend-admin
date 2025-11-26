export interface AuthTokenPayload {
  sub: string;
  email: string;
  user_type: "aluno" | "professor" | "admin";
  exp: number;
  iat: number;
  aud: string;
  role: string;
  user_metadata: {
    email: string;
    email_verified: boolean;
    nome: string;
    phone_verified: boolean;
    sub: string;
    user_type: "aluno" | "professor" | "admin";
  };
}