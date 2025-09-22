
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithGitHub: () => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Setup admin role for specific email and handle OAuth user profiles
        if (session?.user) {
          setTimeout(async () => {
            try {
              // Check if user profile exists, create if not
              const { data: existingProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();

              if (!existingProfile) {
                // Create profile from OAuth data or email/password data
                const userMetadata = session.user.user_metadata || {};
                const { error: profileError } = await supabase
                  .from('profiles')
                  .insert({
                    id: session.user.id,
                    email: session.user.email,
                    first_name: userMetadata.full_name?.split(' ')[0] || userMetadata.first_name || '',
                    last_name: userMetadata.full_name?.split(' ').slice(1).join(' ') || userMetadata.last_name || '',
                    avatar_url: userMetadata.avatar_url || userMetadata.picture || null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  });

                if (profileError) {
                  console.error('Error creating user profile:', profileError);
                } else {
                  console.log('User profile created successfully');
                }
              }

              // Setup admin role for specific email
              if (session.user.email === 'enochosenwafulah@gmail.com') {
                const { data: existingRole } = await supabase
                  .from('user_roles')
                  .select('*')
                  .eq('user_id', session.user.id)
                  .eq('role', 'admin')
                  .maybeSingle();

                if (!existingRole) {
                  await supabase
                    .from('user_roles')
                    .insert({
                      user_id: session.user.id,
                      role: 'admin'
                    });
                  console.log('Admin role assigned successfully');
                }
              }
            } catch (error) {
              console.error('Error setting up user profile:', error);
            }
          }, 1000);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData?: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      
      if (error) {
        console.error('Google OAuth error:', error);
        return { error };
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Google OAuth exception:', error);
      return { error: { message: 'Failed to initiate Google sign-in. Please try again.' } };
    }
  };

  const signInWithGitHub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/`,
          scopes: 'user:email'
        }
      });
      
      if (error) {
        console.error('GitHub OAuth error:', error);
        return { error };
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('GitHub OAuth exception:', error);
      return { error: { message: 'Failed to initiate GitHub sign-in. Please try again.' } };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
