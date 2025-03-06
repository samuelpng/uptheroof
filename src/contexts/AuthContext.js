import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const fetchAuthState = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        setUser(data.session.user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    fetchAuthState();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  },[]);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("Login error:", error.message);
      throw error; // Handle the error properly in UI
    }

    console.log("User logged in:", data.session?.user);
    setUser(data.session?.user); // Correct way to set user
  };

  const signup = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }, // Stores in user_metadata
    });

    if (error) throw error;

    if (data.user) {
      // Insert into profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([{ id: data.user.id, full_name: fullName, email }]);

      if (profileError) throw profileError;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, signInWithGoogle, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
