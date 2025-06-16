import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);
  const [loading, setLoading] = useState(true);

  // Sign up
  const signUpNewUser = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error("There was a problem signing up:".error);
      return { success: false, error };
    }

    // Create a profile for the new user
    const { user } = data;
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([{ id: user.id, email: user.email }]);

    if (profileError) {
      console.error("There was a problem creating the profile: ", profileError);
    }

    return { success: true, data };
  };

  // Sign in
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        console.error("Sign in error occurred: ", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error("An error occurred: ", error);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    // Fetch the session on initial load
    const initSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    initSession();

    // Listen for auth changes (e.g., login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading, signUpNewUser, signInUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const userAuth = () => useContext(AuthContext);
