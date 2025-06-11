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
        // Fetch profile and set isAdmin during initial load
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.session.user.id)
          .single();

        if (profileError) {
          console.error("Failed to fetch profile on initial load:", profileError.message);
        } else {
          if (profile && profile.role === "admin") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    };

    fetchAuthState();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session.user);
          fetchAuthState(); // Re-fetch auth state and isAdmin on sign-in
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAdmin(false);
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
      throw error; // Propagate error for UI handling
    }

    const loggedInUser = data.session?.user;
    setUser(loggedInUser); // Update user state

    let userIsAdmin = false;
    if (loggedInUser) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", loggedInUser.id)
        .single();

      if (profileError) {
        console.error("Failed to fetch profile after login:", profileError.message);
      } else {
        if (profile && profile.role === "admin") {
          setIsAdmin(true); // Update context's isAdmin state
          userIsAdmin = true;
        } else {
          setIsAdmin(false); // Update context's isAdmin state
        }
      }
    }

    console.log("User logged in:", loggedInUser);
    return { user: loggedInUser, isAdmin: userIsAdmin }; // Return admin status
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
    setIsAdmin(false); // Reset isAdmin on logout
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
