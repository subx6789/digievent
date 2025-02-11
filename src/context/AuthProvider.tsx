/* eslint-disable react-hooks/exhaustive-deps */
// src/context/AuthProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  email: string;
  role: string;
  accessToken: string;
  expiresIn: number;
}

interface AuthContextType {
  user: User | null;
  isInitialized: boolean;
  login: (data: User, remember: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser =
          localStorage.getItem("auth") || sessionStorage.getItem("auth");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.expiresIn > Date.now()) {
            setUser(parsedUser);
          } else {
            logout();
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        logout();
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const login = (data: User, remember: boolean) => {
    const storage = remember ? localStorage : sessionStorage;
    const userData = {
      ...data,
      expiresIn: Date.now() + data.expiresIn * 1000,
    };
    storage.setItem("auth", JSON.stringify(userData));
    setUser(userData);
    router.push("/admin/dashboard/overview");
  };

  const logout = () => {
    localStorage.removeItem("auth");
    sessionStorage.removeItem("auth");
    setUser(null);
    router.push("/");
  };

  useEffect(() => {
    if (isInitialized && !user && pathname.startsWith("/admin/dashboard")) {
      router.replace("/");
    }
  }, [user, pathname, isInitialized]);

  const value = useMemo(
    () => ({
      user,
      isInitialized,
      login,
      logout,
    }),
    [user, isInitialized]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
