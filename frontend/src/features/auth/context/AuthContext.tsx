import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AuthState, User } from "../types";
import { api } from "@/lib/axios";

interface AuthContextType extends AuthState {
    setUser: (user: User | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: {children: ReactNode }) => {
    const [state, setState] = useState<AuthState>({
        user: null ,
        token: null,
        isAuthenticated: false,
        isLoading: true,
        role: [],
    });

    const setUser = (user: User | null) => {
        const token = localStorage.getItem('token');
        setState({
            user,
            token,
            isAuthenticated: !!user,
            role: user ? user.role : [],  
            isLoading: false,
        });
    }

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    }

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setState(prev => ({...prev, isLoading: false}));
                return;
            }

            try {
                const response = await api.get("/auth/me");
                const userData = response.data.data.user;
                setUser(userData);
            } catch (error) {
                logout();
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{...state, setUser, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext debe usarse dentro de AuthProvider");
  return context;
};