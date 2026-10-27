import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AuthUser, UserRole } from '@/types';

interface AppContextType {
  // Auth
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;

  // Demo role switcher (for development)
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;

  // Theme
  isDark: boolean;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // Theme
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mediflow_theme') === 'dark' ||
        (!localStorage.getItem('mediflow_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('mediflow_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark((p) => !p), []);

  // Auth
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('mediflow_auth');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('mediflow_auth', JSON.stringify(user));
    } else {
      localStorage.removeItem('mediflow_auth');
    }
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('mediflow_auth');
  }, []);

  // Demo role
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return (localStorage.getItem('mediflow_role') as UserRole) || 'USER';
  });

  useEffect(() => {
    localStorage.setItem('mediflow_role', activeRole);
  }, [activeRole]);

  return (
    <AppContext.Provider value={{ user, setUser, logout, activeRole, setActiveRole, isDark, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
