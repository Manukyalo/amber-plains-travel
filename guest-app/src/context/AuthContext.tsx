import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { GuestProfile } from '../types';

interface AuthContextType {
  user: any | null;
  guest: GuestProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updateProfile: (updates: Partial<GuestProfile>) => Promise<void>;
}

const DEFAULT_GUEST: GuestProfile = {
  id: 'guest-director-1',
  email: 'director@amberplains.co.ke',
  full_name: 'Dr. Jane Somerville',
  phone: '+254 700 123 456',
  nationality: 'United Kingdom',
  passport_number: 'GB98234190',
  emergency_contact: {
    name: 'Mark Somerville',
    relationship: 'Spouse',
    phone: '+44 7911 123456',
  },
  dietary_requirements: 'Pescatarian / Shellfish allergy',
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  guest: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
  updateProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [guest, setGuest] = useState<GuestProfile | null>(DEFAULT_GUEST);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial Supabase auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadGuestProfile(session.user.id, session.user.email || '');
      } else {
        // Provide seamless default guest access
        setGuest(DEFAULT_GUEST);
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadGuestProfile(session.user.id, session.user.email || '');
      } else {
        setUser(null);
        setGuest(DEFAULT_GUEST);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function loadGuestProfile(userId: string, email: string) {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (data && !error) {
        setGuest({
          id: data.id,
          email: data.email,
          full_name: data.full_name || data.name || email.split('@')[0],
          phone: data.phone || '',
          nationality: data.nationality || 'International',
          passport_number: data.passport_number || '',
        });
      } else {
        setGuest({
          id: userId,
          email: email,
          full_name: email.split('@')[0],
          phone: '',
          nationality: 'International',
        });
      }
    } catch {
      setGuest({
        id: userId,
        email: email,
        full_name: email.split('@')[0],
      });
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setLoading(false);
      return { error };
    }
    if (data.user) {
      setUser(data.user);
      await loadGuestProfile(data.user.id, data.user.email || '');
    }
    setLoading(false);
    return { error: null };
  };

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
        },
      },
    });
    if (error) {
      setLoading(false);
      return { error };
    }
    if (data.user) {
      setUser(data.user);
      setGuest({
        id: data.user.id,
        email,
        full_name: fullName,
        phone,
      });
    }
    setLoading(false);
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setGuest(DEFAULT_GUEST);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  };

  const updateProfile = async (updates: Partial<GuestProfile>) => {
    if (guest) {
      const updated = { ...guest, ...updates };
      setGuest(updated);
      try {
        await supabase
          .from('guests')
          .update({
            full_name: updated.full_name,
            phone: updated.phone,
            nationality: updated.nationality,
            passport_number: updated.passport_number,
          })
          .eq('email', guest.email);
      } catch {
        // local update preserved
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        guest,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
