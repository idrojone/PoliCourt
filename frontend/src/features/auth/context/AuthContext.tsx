import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { AuthResponse, AuthMeResponse } from "../../types/auth/auth";
import { setToken } from "@/lib/token";
import { authService } from "../service/auth.sb.service";

export type AuthUser = AuthResponse & Partial<AuthMeResponse>;

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (data: AuthResponse) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKENS_KEY = "auth_tokens";

type StoredTokens = Pick<AuthResponse, "accessToken" | "refreshToken" | "familyId" | "role">

const saveTokens = (data: AuthResponse) => {
  const tokens: StoredTokens = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    familyId: data.familyId,
    role: data.role,
  };
  localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
};

const clearTokens = () => localStorage.removeItem(TOKENS_KEY);

const loadTokens = (): StoredTokens | null => {
  const raw = localStorage.getItem(TOKENS_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  const fetchAndSetMe = useCallback(async (tokens: StoredTokens) => {
    try {
      const me = await authService.me();
      setUserState({ ...tokens, ...me });
    } catch {
      clearTokens();
      setToken(null);
      setUserState(null);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const login = useCallback(async (data: AuthResponse) => {
    setToken(data.accessToken || null);
    saveTokens(data);
    await fetchAndSetMe(data);

    const channel = new BroadcastChannel("auth_channel");
    channel.postMessage({ type: "LOGIN", payload: { accessToken: data.accessToken, refreshToken: data.refreshToken, familyId: data.familyId } });
    channel.close();
  }, [fetchAndSetMe]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // silent
    }

    setToken(null);
    clearTokens();
    setUserState(null);

    const channel = new BroadcastChannel("auth_channel");
    channel.postMessage({ type: "LOGOUT" });
    channel.close();
  }, []);

  const logoutAll = useCallback(async () => {
    try {
      await authService.logoutAll();
    } catch {
      // silent
    }

    setToken(null);
    clearTokens();
    setUserState(null);

    const channel = new BroadcastChannel("auth_channel");
    channel.postMessage({ type: "LOGOUT" });
    channel.close();
  }, []);

  useEffect(() => {
    const tokens = loadTokens();
    if (tokens?.accessToken) {
      setToken(tokens.accessToken);
      fetchAndSetMe(tokens);
    } else {
      setIsInitializing(false);
    }

    const channel = new BroadcastChannel("auth_channel");

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "LOGOUT") {
        setToken(null);
        clearTokens();
        setUserState(null);
      } else if (event.data?.type === "LOGIN") {
        const tokens: StoredTokens = event.data.payload;
        setToken(tokens.accessToken || null);
        fetchAndSetMe(tokens);
      }
    };

    channel.addEventListener("message", handleMessage);

    return () => {
      channel.removeEventListener("message", handleMessage);
      channel.close();
    };
  }, [fetchAndSetMe]);

  const value = {
    user,
    isAuthenticated: !!user,
    isInitializing,
    login,
    logout,
    logoutAll,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
