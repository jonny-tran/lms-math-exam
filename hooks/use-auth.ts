"use client";

import { useCallback, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { authService } from "@/services/auth-service";
import {
  AuthErrorResponse,
  LoginRequest,
  LoginResponse,
  MeResponse,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth";

type AuthError = AuthErrorResponse | null;

const parseAuthError = (error: unknown): AuthErrorResponse => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as AuthErrorResponse | undefined;
    if (data) {
      return data;
    }
    return { error: error.message ?? "Request failed" };
  }

  return { error: "Unexpected error occurred" };
};

const getAuthErrorMessage = (error: AuthErrorResponse): string => {
  if ("errors" in error) {
    return Object.entries(error.errors)
      .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
      .join(" | ");
  }

  if ("message" in error && typeof error.message === "string") {
    return error.message;
  }

  if ("error" in error && typeof error.error === "string") {
    return error.error;
  }

  return "An unexpected error occurred. Please try again.";
};

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError>(null);

  const runWithState = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T> => {
      setLoading(true);
      setError(null);

      try {
        return await fn();
      } catch (err) {
        const parsedError = parseAuthError(err);
        setError(parsedError);
        toast.error(getAuthErrorMessage(parsedError));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const register = useCallback(
    async (payload: RegisterRequest): Promise<RegisterResponse> => {
      const result = await runWithState(() => authService.register(payload));
      toast.success(result.message ?? "Registration successful.");
      return result;
    },
    [runWithState]
  );

  const login = useCallback(
    async (payload: LoginRequest): Promise<LoginResponse> => {
      const result = await runWithState(() => authService.login(payload));
      toast.success(result.message ?? "Signed in successfully.");
      return result;
    },
    [runWithState]
  );

  const getCurrentUser = useCallback(async (): Promise<MeResponse> => {
    const result = await runWithState(() => authService.getCurrentUser());
    toast.success("Loaded profile successfully.");
    return result;
  }, [runWithState]);

  const refreshToken = useCallback(async (): Promise<RefreshTokenResponse> => {
    const result = await runWithState(() => authService.refreshToken());
    toast.success(result.message ?? "Token refreshed successfully.");
    return result;
  }, [runWithState]);

  const logout = useCallback(() => {
    authService.logout();
    toast.success("Signed out successfully.");
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    register,
    login,
    getCurrentUser,
    refreshToken,
    logout,
    loading,
    error,
    clearError,
  };
};

