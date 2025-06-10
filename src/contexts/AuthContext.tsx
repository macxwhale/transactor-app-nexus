
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define the types for our auth context
type AuthContextType = {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  signIn: async () => false,
  signUp: async () => false,
  signOut: async () => {},
  isAuthenticated: false,
  isLoading: true,
});

// Create a hook for using the auth context
export const useAuth = () => useContext(AuthContext);

// Auth state cleanup utility
const cleanupAuthState = () => {
  // Clear all auth-related keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Clear from sessionStorage if available
  if (typeof sessionStorage !== 'undefined') {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  }
};

// Create the auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    console.log("Setting up auth state listener...");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle auth events
        if (event === 'SIGNED_IN' && session?.user) {
          console.log("User signed in successfully");
          toast.success("Welcome! You're now signed in.");
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          setUser(null);
          setSession(null);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Error getting session:", error);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log("Attempting to sign in with email:", email);
      
      // Clean up existing state first
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log("Global signout failed, continuing...");
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        toast.error(error.message || "Failed to sign in");
        return false;
      }

      if (data.user) {
        console.log("Sign in successful for user:", data.user.email);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Unexpected sign in error:", error);
      toast.error("An unexpected error occurred during sign in");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log("Attempting to sign up with email:", email);
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        console.error("Sign up error:", error);
        toast.error(error.message || "Failed to sign up");
        return false;
      }

      if (data.user) {
        console.log("Sign up successful for user:", data.user.email);
        
        if (data.user.email_confirmed_at) {
          toast.success("Account created successfully! You're now signed in.");
        } else {
          toast.success("Account created! Please check your email to confirm your account.");
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Unexpected sign up error:", error);
      toast.error("An unexpected error occurred during sign up");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      console.log("Signing out user");
      
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error("Sign out error:", error);
        toast.error("Error signing out");
      } else {
        console.log("Sign out successful");
        toast.success("You've been signed out successfully");
      }
      
      // Force page reload for clean state
      window.location.href = '/auth';
    } catch (error) {
      console.error("Unexpected sign out error:", error);
      toast.error("An unexpected error occurred during sign out");
    }
  };

  const value = {
    user,
    session,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!session?.user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
