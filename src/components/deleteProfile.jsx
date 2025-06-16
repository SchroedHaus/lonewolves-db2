import { supabase } from "../supabaseClient";

const deleteProfile = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to delete your account?"
  );
  if (!confirmed) return;

  const { data, error } = await supabase.functions.invoke("delete-user");

  if (error) {
    console.error("Error deleting user:", error.message);
    return;
  }

  alert("User deleted.");
  await supabase.auth.signOut();
  window.location.href = "/";
};

export default deleteProfile;
