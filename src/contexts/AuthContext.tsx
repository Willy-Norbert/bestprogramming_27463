import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api';

export type UserRole = 'admin' | 'staff' | 'student';

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  avatarUrl?: string;
  active: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, username: string, password: string, role: UserRole) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    console.log('🔍 [FRONTEND] Checking authentication...');
    try {
      const response = await apiClient.get('/auth/me');
      console.log('✅ [FRONTEND] Auth check successful:', { 
        userId: response.data?.id, 
        username: response.data?.username 
      });
      if (response.data) {
        setUser(response.data);
        console.log('✅ [FRONTEND] User state set from auth check');
      }
    } catch (error: any) {
      // Not authenticated - silently handle 401 errors
      if (error.response?.status !== 401) {
        console.error('❌ [FRONTEND] Auth check error:', error);
        console.error('❌ [FRONTEND] Error response:', error.response?.data);
      } else {
        console.log('ℹ️ [FRONTEND] Not authenticated (401) - this is normal for logged out users');
      }
      setUser(null);
    } finally {
      setLoading(false);
      console.log('✅ [FRONTEND] Auth check completed, loading set to false');
    }
  };

  const login = async (username: string, password: string, rememberMe = false) => {
    console.log('🔐 [FRONTEND] Login attempt:', { username, rememberMe });
    try {
      const response = await apiClient.post('/auth/login', { username, password, rememberMe });
      console.log('✅ [FRONTEND] Login response received:', { 
        hasUser: !!response.data.user, 
        hasToken: !!response.data.token,
        userRole: response.data.user?.role 
      });
      if (response.data.user) {
        setUser(response.data.user);
        console.log('✅ [FRONTEND] User state updated:', response.data.user.username);
        // Store token in localStorage as fallback (backend also sets HttpOnly cookie)
        if (response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
          console.log('✅ [FRONTEND] Token stored in localStorage');
        }
      }
    } catch (error: any) {
      console.error('❌ [FRONTEND] Login error:', error);
      console.error('❌ [FRONTEND] Error response:', error.response?.data);
      console.error('❌ [FRONTEND] Error status:', error.response?.status);
      throw error;
    }
  };

  const logout = async () => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const register = async (name: string, username: string, password: string, role: UserRole) => {
    const response = await apiClient.post('/auth/register', { name, username, password, role });
    if (response.data.user) {
      setUser(response.data.user);
      // Store token in localStorage as fallback (backend also sets HttpOnly cookie)
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
    } else {
      throw new Error('Registration failed - no user data returned');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

