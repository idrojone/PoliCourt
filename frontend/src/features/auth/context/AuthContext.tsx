import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { AuthResponse } from "../../types/auth/auth";
import { setToken } from "@/lib/axios.sb";

interface AuthContextType {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<AuthResponse | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = useCallback((data: AuthResponse) => {
    setToken(data.accessToken || null);
    setUserState(data);
    localStorage.setItem("user", JSON.stringify(data));
    
    const channel = new BroadcastChannel("auth_channel");
    channel.postMessage({ type: "LOGIN", payload: data });
    channel.close();
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserState(null);
    localStorage.removeItem("user");
    
    const channel = new BroadcastChannel("auth_channel");
    channel.postMessage({ type: "LOGOUT" });
    channel.close();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        const parsed = JSON.parse(storedUser) as AuthResponse;
        if (parsed?.accessToken) {
            setToken(parsed.accessToken);
        }
    }

    const channel = new BroadcastChannel("auth_channel");
    
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "LOGOUT") {
        setToken(null);
        setUserState(null);
        localStorage.removeItem("user");
      } else if (event.data?.type === "LOGIN") {
        setToken(event.data.payload.accessToken || null);
        setUserState(event.data.payload);
        localStorage.setItem("user", JSON.stringify(event.data.payload));
      }
    };

    channel.addEventListener("message", handleMessage);

    return () => {
      channel.removeEventListener("message", handleMessage);
      channel.close();
    };
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
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
