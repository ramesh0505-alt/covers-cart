/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminLogin as apiAdminLogin, validateSession } from '../lib/api';
import {
  getAdminToken,
  getAdminUser,
  setAdminSession,
  clearAdminSession,
} from '../lib/authStorage';
import { isAdminPortalRole, normalizeRole } from '../constants/roles';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getAdminUser());
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    clearAdminSession();
    setUser(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const { token, user: loggedInUser } = await apiAdminLogin(email, password);

    if (!isAdminPortalRole(loggedInUser?.role)) {
      clearAdminSession();
      const err = new Error('Access denied. Admin credentials required.');
      err.status = 403;
      throw err;
    }

    setAdminSession(token, loggedInUser);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  // Validate stored JWT on boot — auto-logout on invalid session
  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const token = getAdminToken();
      if (!token) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const profile = await validateSession();
        if (!isAdminPortalRole(profile?.role)) {
          logout();
          return;
        }
        if (mounted) {
          setAdminSession(token, profile);
          setUser(profile);
        }
      } catch {
        logout();
      } finally {
        if (mounted) setLoading(false);
      }
    }

    bootstrap();
    return () => {
      mounted = false;
    };
  }, [logout]);

  const role = user ? normalizeRole(user.role) : null;
  const token = getAdminToken();
  const isAuthenticated = Boolean(user && token);
  const hasPortalAccess = isAdminPortalRole(role);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        loading,
        isAuthenticated,
        hasPortalAccess,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
