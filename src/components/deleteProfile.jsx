import { userAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

const deleteProfile = async (session) => {

  const confirmed = window.confirm(
    "Are you sure you want to delete your profile? This cannot be undone."
  );
  if (!confirmed) return;

  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", session.user.id);

  if (error) {
    console.error("Error deleting profile:", error.message);
  } else {
    alert("Profile deleted. You will now be signed out.");
    await supabase.auth.signOut();
    // optionally redirect to homepage
    window.location.href = "/";
  }
};

export default deleteProfile;
