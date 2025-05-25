import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const fetchAuthState = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        setUser(data.session.user);
        //get user profile from data.session.user
        const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.session.user.id)
        .single();

      if (profileError) {
        console.error("Failed to fetch profile:", profileError.message);
      } else {
        // You can store the role or full profile in a separate state if needed
        console.log("User profile:", profile);
        if (profile && profile.role === "admin"){
          setIsAdmin(true)
        }
      }
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
    <AuthContext.Provider value={{ user, login, signup, logout, signInWithGoogle, isLoading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
