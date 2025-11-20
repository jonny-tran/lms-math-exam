import axios from "axios";
import { http, setAccessTokenCookie, clearAccessTokenCookie } from "@/lib/http";
import {
  AuthErrorResponse,
  LoginRequest,
  LoginResponse,
  MeResponse,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth";

const handleAuthError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    throw error;
  }

  throw error;
};

const register = async (
  payload: RegisterRequest
): Promise<RegisterResponse> => {
  try {
    const { data } = await http.post<RegisterResponse>(
      "/api/Auth/register",
      payload
    );
    return data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  try {
    const { data } = await http.post<LoginResponse>("/api/Auth/login", payload);
    setAccessTokenCookie(data.accessToken, data.accessTokenExpiry);
    return data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

const getCurrentUser = async (): Promise<MeResponse> => {
  try {
    const { data } = await http.get<MeResponse>("/api/Auth/me");
    return data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

const refreshToken = async (): Promise<RefreshTokenResponse> => {
  try {
    const { data } = await http.post<RefreshTokenResponse>(
      "/api/Auth/refresh-token"
    );
    setAccessTokenCookie(data.accessToken, data.accessTokenExpiry);
    return data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

const logout = () => {
  clearAccessTokenCookie();
};

export const authService = {
  register,
  login,
  getCurrentUser,
  refreshToken,
  logout,
};

export type { AuthErrorResponse };
