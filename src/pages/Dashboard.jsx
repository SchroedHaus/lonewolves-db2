import { useEffect, useState } from "react";
import { userAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [profiles, setProfiles] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { session } = userAuth();

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!session) return;

      // Fetch all categories for the filter dropdown
      const { data: categoriesData } = await supabase
        .from("categories")
        .select("id, name");
      setAllCategories(categoriesData || []);

      const { data, error } = await supabase.from("profiles")
        .select(`id, first_name, company_name, email, phone, more_info,profile_categories:profile_categories (
            category:categories (
              id,
              name
            )
          )`);

      if (error) {
        alert("Error fetching profiles: " + error.message);
        setLoading(false);
        return;
      }

      const profilesWithCategories = data.map((profile) => {
        const categoryNames =
          profile.profile_categories
            ?.map((pc) => pc.category?.name)
            .filter(Boolean)
            .join(", ") || "None selected";
        const categoryIds =
          profile.profile_categories
            ?.map((pc) => pc.category?.id)
            .filter(Boolean) || [];
        return { ...profile, categoryList: categoryNames, categoryIds };
      });

      setProfiles(profilesWithCategories);
      setLoading(false);
    };

    fetchProfiles();
  }, [session]);

  const goToProfile = (id) => {
    return `/profile/${id}`;
  };

  // Toggle category selection
  const toggleCategory = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId]
    );
  };

  // Clear all filters
  const clearFilters = () => setSelectedCategories([]);

  // Filter profiles by selected category
  const filteredProfiles =
    selectedCategories.length > 0
      ? profiles.filter((profile) =>
          profile.categoryIds.some((catId) =>
            selectedCategories.includes(String(catId))
          )
        )
      : profiles;

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="w-full">
      <h2 className="text-center text-3xl p-5">All User Profiles</h2>
      <div className="mb-4 flex flex-wrap gap-2 justify-center">
        {allCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => toggleCategory(String(cat.id))}
            className={`px-4 py-2 rounded border ${
              selectedCategories.includes(String(cat.id))
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 text-black border-gray-300"
            }`}
          >
            {cat.name}
          </button>
        ))}
        <button
          type="button"
          onClick={clearFilters}
          className={`px-4 py-2 rounded border ml-2 ${
                selectedCategories.length === 0
                  ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                  : "bg-red-100 text-red-700 border-red-300"
              }`}
        >
          Clear Filters
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 400px))",
          gap: "1rem",
          justifyContent: "center",
        }}
      >
        {filteredProfiles.map((profile) => (
          <Link
            key={profile.id}
            to={goToProfile(profile.id)}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "box-shadow 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                height: "300px",
              }}
            >
              <h3>{profile.first_name || "Unnamed User"}</h3>
              <p>
                <strong>More info:</strong> {profile.more_info || "No bio"}
              </p>
              <p>
                <strong>Phone:</strong> {profile.phone || "No phone"}
              </p>
              <div>
                <strong>Categories: </strong>
                {profile.categoryList || "None selected"}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
