import { createContext, useContext } from 'react';

export type UserAccess = {
  isLoggedIn: boolean;
  isAdmin: boolean;
};

export const defaultUserAccess: UserAccess = {
  isLoggedIn: true,
  isAdmin: false,
};

export const AuthContext = createContext<UserAccess | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');

  return context;
};
