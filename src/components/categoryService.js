import { supabase } from "../supabaseClient";

export const fetchAllCategories = async () => {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) throw error;
  return data;
};

export const fetchUserCategoryIds = async (userId) => {
  const { data, error } = await supabase
    .from("profile_categories")
    .select("category_id")
    .eq("profile_id", userId);
  if (error) throw error;
  return data.map((row) => row.category_id);
};

export const updateUserCategories = async (
  userId,
  categoryIds
) => {
  // Clear existing
  await supabase.from("profile_categories").delete().eq("profile_id", userId);

  // Insert new
  const inserts = categoryIds.map((category_id) => ({
    profile_id: userId,
    category_id,
  }));

  const { error } = await supabase.from("profile_categories").insert(inserts);
  if (error) throw error;
};
