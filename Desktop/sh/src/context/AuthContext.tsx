import React, { createContext, useContext, useState } from 'react';
import { UserProfile, UserRole } from '../types/user';
import { authService, DEMO_PROFILES } from '../services/authService';

interface AuthContextType {
  currentUser: UserProfile;
  currentRole: UserRole;
  isLoggedIn: boolean;
  switchRole: (role: UserRole) => void;
  login: (email: string, pass: string, role: UserRole) => Promise<void>;
  register: (data: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(authService.getCurrentUser());
  const [currentRole, setCurrentRole] = useState<UserRole>(authService.getCurrentRole());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const switchRole = (role: UserRole) => {
    const user = authService.switchRole(role);
    setCurrentUser(user);
    setCurrentRole(role);
    setIsLoggedIn(true);
  };

  const login = async (email: string, pass: string, role: UserRole) => {
    const user = await authService.login(email, pass, role);
    setCurrentUser(user);
    setCurrentRole(role);
    setIsLoggedIn(true);
  };

  const register = async (data: Partial<UserProfile>) => {
    const user = await authService.register(data);
    setCurrentUser(user);
    setCurrentRole(user.role);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    const nextUser = authService.updateProfile(updated);
    setCurrentUser(nextUser);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isLoggedIn,
        switchRole,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
