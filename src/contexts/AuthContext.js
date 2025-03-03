import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchAuthState = async () => {
      // Restore session on page load
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
      } else {
        // If no session, get the user (useful for initial load)
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      }
    };
  
    fetchAuthState();
  
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
  
    return () => listener?.subscription.unsubscribe();
  }, []);
  

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
    if (error) {
      throw error; // Handle the error (e.g., show an alert)
    }
  
    setUser(data?.user); // Set the user state with the authenticated user
  };
  

  const signup = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }, // Stores in user_metadata
    });
  
    if (error) throw error;
  
    // Insert into profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([{ id: data.user.id, full_name: fullName, email: email }]);
  
    if (profileError) throw profileError;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // redirectTo: window.location.origin, // Adjust if needed
      },
    });
  
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
