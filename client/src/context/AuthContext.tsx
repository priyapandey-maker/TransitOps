import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Role } from '../types/common.types';
import type { AuthUser } from '../types/auth.types';
import { STORAGE_KEYS } from '../constants/storage';

interface AuthContextValue {
  currentUser: AuthUser | null;
  userRole: Role | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getStoredAuth(): { token: string | null; user: AuthUser | null } {
  if (typeof window === 'undefined') return { token: null, user: null };

  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const userJson = localStorage.getItem(STORAGE_KEYS.USER);

  if (token && userJson) {
    try {
      const user = JSON.parse(userJson) as AuthUser;
      return { token, user };
    } catch {
      return { token: null, user: null };
    }
  }

  return { token: null, user: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState(getStoredAuth);

  const login = useCallback((token: string, user: AuthUser) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    setAuth({ token, user });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setAuth({ token: null, user: null });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser: auth.user,
        userRole: auth.user?.role ?? null,
        token: auth.token,
        isAuthenticated: !!auth.token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
