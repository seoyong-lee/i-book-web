
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token?: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'readme_kids_auth_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname === '/chat') {
      router.push('/login');
    }
    if (!isLoading && isAuthenticated && pathname === '/login') {
      router.push('/chat');
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  const login = useCallback((token: string = 'dummy_token') => {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
    setIsAuthenticated(true);
    router.push('/chat');
  }, [router]);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
    setIsAuthenticated(false);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
