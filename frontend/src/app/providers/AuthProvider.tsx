import type { ReactNode } from 'react';
import { AuthContext, defaultUserAccess } from '@/app/providers/auth-context';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthContext.Provider value={defaultUserAccess}>
      {children}
    </AuthContext.Provider>
  );
};
