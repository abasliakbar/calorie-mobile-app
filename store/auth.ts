import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';
import type { Profile } from '../types/database';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  initialized: boolean;
  profile: Profile | null;
  profileLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  initialize: () => void;
  setProfile: (profile: Profile | null) => void;
  setProfileLoading: (loading: boolean) => void;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  loading: false,
  initialized: false,
  profile: null,
  profileLoading: false,

  initialize: () => {
    // Get the current session on startup
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session, user: session?.user ?? null, initialized: true });

      // Fetch profile if we have a user
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (!error && data) {
              set({ profile: data as Profile });
            }
          });
      }
    });

    // Listen for auth state changes (login, logout, token refresh)
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });

      // Fetch profile when auth state changes
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (!error && data) {
              set({ profile: data as Profile });
            } else {
              // Clear profile if user exists but no profile found
              set({ profile: null });
            }
          });
      } else {
        // Clear profile when signed out
        set({ profile: null });
      }
    });
  },

  signUp: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signUp({ email, password });
    set({ loading: false });
    return { error: error?.message ?? null };
  },

  signIn: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    set({ loading: false });
    return { error: error?.message ?? null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, profile: null });
  },

  setProfile: (profile: Profile | null) =>
    set({ profile, profileLoading: false }),

  setProfileLoading: (loading: boolean) =>
    set({ profileLoading: loading }),

  updateProfile: async (updates: Partial<Profile>) => {
    set({ profileLoading: true });
    try {
      const { user } = useAuthStore.getState();
      if (!user) {
        throw new Error('No user logged in');
      }

      // Use upsert to create profile if it doesn't exist, or update if it does
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...updates })
        .eq('id', user.id);

      if (error) throw error;

      // Fetch updated profile
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) throw fetchError;

      set({ profile: data as Profile, profileLoading: false });
      return { error: null };
    } catch (err) {
      set({ profileLoading: false });
      return { error: err instanceof Error ? err.message : 'An unknown error occurred' };
    }
  }
}));
