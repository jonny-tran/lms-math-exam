export type AuthRole = "Teacher" | "Student" | "Admin";

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: AuthRole;
}

export interface RegisterResponse {
  token: string;
  message: string;
  email: string;
}

export interface RegisterUsernameTakenError {
  error: "Username already taken";
}

export interface ValidationErrors {
  [key: string]: string[];
}

export interface ValidationErrorResponse {
  type: string;
  title: string;
  status: number;
  errors: ValidationErrors;
  traceId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  accessTokenExpiry: string;
  email: string;
  message: string;
  role: AuthRole | string;
}

export interface MeResponse {
  userId: string;
  email: string;
  role: AuthRole | string;
  username: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  accessTokenExpiry: string;
  email: string;
  message: string;
  role: AuthRole | string;
}

export type AuthErrorResponse =
  | RegisterUsernameTakenError
  | ValidationErrorResponse
  | { error: string };
