'use client';

import { useCallback, useState } from 'react';
import axios from 'axios';
import { authService } from '@/services/auth-service';
import {
  AuthErrorResponse,
  LoginRequest,
  LoginResponse,
  MeResponse,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/types/auth';

type AuthError = AuthErrorResponse | null;

const parseAuthError = (error: unknown): AuthErrorResponse => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as AuthErrorResponse | undefined;
    if (data) {
      return data;
    }
    return { error: error.message ?? 'Request failed' };
  }

  return { error: 'Unexpected error occurred' };
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
        setError(parseAuthError(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const register = useCallback(
    (payload: RegisterRequest): Promise<RegisterResponse> =>
      runWithState(() => authService.register(payload)),
    [runWithState]
  );

  const login = useCallback(
    (payload: LoginRequest): Promise<LoginResponse> =>
      runWithState(() => authService.login(payload)),
    [runWithState]
  );

  const getCurrentUser = useCallback(
    (): Promise<MeResponse> => runWithState(() => authService.getCurrentUser()),
    [runWithState]
  );

  const refreshToken = useCallback(
    (): Promise<RefreshTokenResponse> =>
      runWithState(() => authService.refreshToken()),
    [runWithState]
  );

  const logout = useCallback(() => {
    authService.logout();
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

