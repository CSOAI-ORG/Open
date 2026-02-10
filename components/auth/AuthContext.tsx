/**
 * Authentication Context
 * Syncs user authentication state with the backend session (cookie-based)
 * Uses tRPC auth.me endpoint to verify session on mount and after login
 */

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { trpc } from '@/lib/trpc';

interface User {
  id: number;
  email: string | null;
  name?: string | null;
  role?: string | null;
  openId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Query the backend to get the current user from session cookie
  const { data: sessionUser, isLoading, refetch } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Sync user state with backend session
  useEffect(() => {
    if (!isLoading) {
      if (sessionUser) {
        setUser({
          id: sessionUser.id,
          email: sessionUser.email,
          name: sessionUser.name,
          role: sessionUser.role,
          openId: sessionUser.openId,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    }
  }, [sessionUser, isLoading]);

  // Login mutation
  const loginMutation = trpc.emailAuth.login.useMutation();
  
  // Logout mutation
  const logoutMutation = trpc.auth.logout.useMutation();

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginMutation.mutateAsync({ email, password });
    if (result.success && result.user) {
      setUser({
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
      });
      // Refetch to ensure we have the full user data from session
      await refetch();
    }
  }, [loginMutation, refetch]);

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    // Redirect to home page after logout
    window.location.href = '/';
  }, [logoutMutation]);

  // Signup mutation
  const signupMutation = trpc.emailAuth.register.useMutation();

  const signup = useCallback(async (email: string, password: string, name?: string) => {
    await signupMutation.mutateAsync({ 
      email, 
      password, 
      name: name || email.split('@')[0] 
    });
    // After signup, redirect to login page
    window.location.href = '/login';
  }, [signupMutation]);

  const refetchUser = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup, refetchUser }}>
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
