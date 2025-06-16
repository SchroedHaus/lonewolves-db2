import { supabase } from "../supabaseClient";
import { fetchAllCategories, fetchUserCategoryIds } from "./categoryService";

const fetchProfile = async (userId) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  const all = await fetchAllCategories();
  const selected = await fetchUserCategoryIds(userId);

  const list = selected
    .map((catId) => all.find((cat) => cat.id === catId)?.name)
    .join(", ");

  return { data, all, selected, list, error };
};

export default fetchProfile;
