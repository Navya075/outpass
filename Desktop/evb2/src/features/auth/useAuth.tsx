import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, setToken, removeToken, getToken } from '@/services/apiClient';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: 'author' | 'reviewer' | 'admin' | 'viewer';
}

interface AuthContextType {
  session: UserSession | null;
  login: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiClient.get<{ success: boolean; user: any }>('/auth/me');
        if (response.user) {
          setSession({
            id: response.user.id,
            email: response.user.email,
            name: response.user.name,
            role: response.user.role.toLowerCase() as UserSession['role'],
          });
        }
      } catch (error) {
        console.error('Session restoration failed:', error);
        removeToken();
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string): Promise<boolean> => {
    try {
      const response = await apiClient.post<{ success: boolean; token: string; user: any }>('/auth/login', {
        email,
      });

      if (response.token && response.user) {
        setToken(response.token);
        setSession({
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role.toLowerCase() as UserSession['role'],
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeToken();
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider value={{ session, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
