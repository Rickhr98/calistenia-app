import { useEffect, useState, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

export interface UseAuthResult {
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string) => Promise<{ error: string | null }>;
  signInWithDevMode: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const DEV_MODE_SESSION_KEY = '__devModeSession';

// Create a mock session for development
function createDevModeSession(): Session {
  const devUserId = 'dev-mode-test-user-00000000000';
  return {
    access_token: 'dev-mode-token',
    token_type: 'bearer',
    expires_in: 3600,
    refresh_token: 'dev-mode-refresh',
    user: {
      id: devUserId,
      aud: 'authenticated',
      role: 'authenticated',
      email: 'dev@localhost',
      email_confirmed_at: new Date().toISOString(),
      phone: '',
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: { provider: 'email', providers: ['email'] },
      user_metadata: {},
      identities: [
        {
          id: devUserId,
          user_id: devUserId,
          identity_id: devUserId,
          identity_data: { email: 'dev@localhost', sub: devUserId },
          provider: 'email',
          created_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
        },
      ],
      is_anonymous: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  } as Session;
}

export function useAuth(): UseAuthResult {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if dev mode session is stored
    const storedDevSession = localStorage.getItem(DEV_MODE_SESSION_KEY);
    if (storedDevSession) {
      setSession(createDevModeSession());
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const signInWithEmail = useCallback(async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + window.location.pathname },
    });
    return { error: error?.message ?? null };
  }, []);

  const signInWithDevMode = useCallback(async () => {
    try {
      localStorage.setItem(DEV_MODE_SESSION_KEY, 'true');
      setSession(createDevModeSession());
      return { error: null };
    } catch (err) {
      return { error: 'Error en modo desarrollo' };
    }
  }, []);

  const signOut = useCallback(async () => {
    localStorage.removeItem(DEV_MODE_SESSION_KEY);
    await supabase.auth.signOut();
  }, []);

  return { session, loading, signInWithEmail, signInWithDevMode, signOut };
}
