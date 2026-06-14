/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import API from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Fetch User Profile ──────────────────────────────────────────────────────
  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) {
        console.error('Error fetching profile:', error.message);
      } else if (data) {
        setProfile(data);
      }
      
      // Sync to Backend Prisma
      try {
        await API.get('/auth/me');
      } catch (syncErr) {
        console.error('Failed to sync profile to backend:', syncErr);
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
    }
  }, []);

  // ── Boot & Session Persistence ──────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (!mounted) return;
      setSession(initialSession);
      if (initialSession) {
        fetchProfile(initialSession.user.id).finally(() => {
          if (mounted) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;
      setSession(currentSession);
      if (currentSession) {
        setLoading(true);
        await fetchProfile(currentSession.user.id);
        if (mounted) setLoading(false);
      } else {
        setProfile(null);
        if (mounted) setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // ── Email/Password Signup ───────────────────────────────────────────────────
  const register = useCallback(async (name, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });
    if (error) throw error;
    return data.user;
  }, []);

  // ── Email/Password Login ────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  }, []);

  // ── Google OAuth Login ──────────────────────────────────────────────────────
  const googleLogin = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return data;
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  // Expose token as access_token for backwards compatibility
  const token = session?.access_token || null;

  // Construct a unified user object
  const user = session
    ? {
        ...session.user,
        id: session.user.id,
        email: session.user.email,
        name: profile?.full_name || session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
        role: profile?.role || 'customer',
        avatarUrl: profile?.avatar_url || session.user.user_metadata?.avatar_url || '',
      }
    : null;

  const role            = profile?.role || (session ? 'customer' : null);
  const isAuthenticated = Boolean(session && user);

  // Auto-logout on invalid/expired sessions: intercept fetch and call logout on 401
  useEffect(() => {
    const originalFetch = window.fetch;
    const safeFetch = async (...args) => {
      try {
        const res = await originalFetch(...args);
        if (res && res.status === 401) {
          // Best-effort logout (no await to avoid waiting on network)
          logout().catch(() => {});
        }
        return res;
      } catch (e) {
        throw e;
      }
    };
    window.fetch = safeFetch;
    return () => {
      window.fetch = originalFetch;
    };
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        token,
        loading,
        isAuthenticated,
        login,
        register,
        googleLogin,
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
