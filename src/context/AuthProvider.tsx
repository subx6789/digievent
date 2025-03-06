/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

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
      // Calculate the absolute expiration time in milliseconds
      expiresIn: Date.now() + data.expiresIn * 1000,
    };
    storage.setItem("auth", JSON.stringify(userData));
    setUser(userData);

    // Redirect based on user role
    if (data.role === "admin") {
      router.push("/admin/dashboard/overview");
    } else if (data.role === "super-admin") {
      router.push("/super-admin/dashboard/overview");
    } else if (data.role === "organizer") {
      router.push("/organizer/dashboard/events");
    }
  };

  const logout = () => {
    const currentUser = user;
    localStorage.removeItem("auth");
    sessionStorage.removeItem("auth");
    setUser(null);
    // Redirect based on user role
    if (currentUser) {
      if (currentUser.role === "admin") {
        router.push("/admin/auth/login");
      } else if (currentUser.role === "super-admin") {
        router.push("/super-admin/auth/login");
      } else if (currentUser.role === "organizer") {
        router.push("/organizer/auth/login");
      } else {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  };

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
