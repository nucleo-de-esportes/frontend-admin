export interface AuthTokenPayload {
    sub?: string;           // User ID (formato antigo)
    subject?: string;       // User ID (formato novo)
    email?: string;
    user_type?: "aluno" | "professor" | "admin"; // Formato novo (direto no payload)
    exp: number;            // Expiration timestamp
    iat?: number;           // Issued at timestamp
    aud?: string;
    role?: string;
    user_metadata?: {       // Formato antigo (nested)
      email: string;
      email_verified: boolean;
      nome: string;
      phone_verified: boolean;
      sub: string;
      user_type: "aluno" | "professor" | "admin";
    };
  }