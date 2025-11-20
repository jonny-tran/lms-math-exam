import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";
import { RefreshTokenResponse } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const ACCESS_TOKEN_KEY = "accessToken";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const getAccessToken = (): string | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }

  return Cookies.get(ACCESS_TOKEN_KEY);
};

const setAccessTokenCookie = (token: string, expiry?: string) => {
  if (typeof window === "undefined") {
    return;
  }

  const cookieOptions: Cookies.CookieAttributes = {
    path: "/",
    sameSite: "lax",
  };

  if (expiry) {
    const parsedExpiry = new Date(expiry);
    if (!Number.isNaN(parsedExpiry.getTime())) {
      cookieOptions.expires = parsedExpiry;
    }
  }

  if (!cookieOptions.expires) {
    cookieOptions.expires = 1;
  }

  Cookies.set(ACCESS_TOKEN_KEY, token, cookieOptions);
};

const clearAccessTokenCookie = () => {
  if (typeof window === "undefined") {
    return;
  }

  Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
};

const redirectToSignIn = () => {
  if (typeof window !== "undefined") {
    window.location.assign("/signin");
  }
};

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  if (!API_URL) {
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = (async () => {
      isRefreshing = true;
      try {
        const response = await axios.post<RefreshTokenResponse>(
          `${API_URL}/api/Auth/refresh-token`,
          undefined,
          { withCredentials: true }
        );
        const { accessToken, accessTokenExpiry } = response.data;
        setAccessTokenCookie(accessToken, accessTokenExpiry);
        return accessToken;
      } catch {
        clearAccessTokenCookie();
        redirectToSignIn();
        return null;
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
};

const isAuthRoute = (url?: string) => {
  if (!url) return false;
  const normalized = url.toLowerCase();
  return (
    normalized.includes("/api/auth/login") ||
    normalized.includes("/api/auth/register") ||
    normalized.includes("/api/auth/refresh-token")
  );
};

const http: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRoute(originalRequest.url)
    ) {
      if (isRefreshing) {
        const newToken = await refreshAccessToken();
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return http(originalRequest);
      }

      originalRequest._retry = true;
      const newToken = await refreshAccessToken();

      if (newToken && originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return http(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export { http, setAccessTokenCookie, clearAccessTokenCookie };
