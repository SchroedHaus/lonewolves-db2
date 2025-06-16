// SignOut.jsx
import { supabase } from "../supabaseClient";

export const handleSignOut = async (navigate) => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error.message);
  } else {
    navigate("/", { replace: true });
  }
};
