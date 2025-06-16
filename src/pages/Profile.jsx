import { useEffect, useState } from "react";
import { userAuth } from "../context/AuthContext";
import Button from "../components/Buttons";
import { supabase } from "../supabaseClient";
import fetchProfile from "../components/FetchProfile";
import { getSanitizedLink } from "../components/SanitizeLink";
import CategorySelector from "../components/CategorySelector";
import { updateUserCategories } from "../components/categoryService";
import { useParams } from "react-router-dom";
import deleteProfile from "../components/deleteProfile";

const Profile = () => {
  const { id } = useParams();
  const { session } = userAuth();
  const [profile, setProfile] = useState({
    first_name: "",
    surname: "",
    email: "",
    phone: "",
    link: "",
    company_name: "",
    more_info: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userId = id ? id : session?.user?.id;

    const fetchSessionUser = async () => {
      if (session?.user?.id) {
        const { data } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", session.user.id)
          .single();
        setIsAdmin(data?.is_admin === true);
      }
    };

    fetchSessionUser();

    if (userId) {
      setLoading(true);
      fetchProfile(userId).then(({ data, all, selected, list, error }) => {
        if (error) {
          setError("Update Your Profile");
        } else if (data) {
          setProfile(data);
          setAllCategories(all);
          setSelectedCategoryIds(selected);
          setSelectedCategories(list);
        }
        setLoading(false);
      });
    }
  }, [id, session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: session.user.id, ...profile });

    if (error) {
      setError("Error updating profile: " + error.message);
    } else {
      setSuccessMessage("Profile updated successfully");
      setEditMode(false);
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }

    await updateUserCategories(profile.id, selectedCategoryIds);

    setLoading(false);
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="flex flex-col place-content-center items-left pb-20">
      <h2 className="font-bold text-2xl pt-6">User Profile</h2>
      {error && <p className="text-red-600 mt-2">{error}</p>}

      {!editMode ? (
        <div className="mt-6 space-y-4 flex flex-col">
          <div>
            <strong>First Name:</strong> {profile.first_name}
          </div>
          <div>
            <strong>Surname:</strong> {profile.surname}
          </div>
          <div>
            <strong>Email:</strong> {profile.email}
          </div>
          <div>
            <strong>Phone:</strong> {profile.phone}
          </div>
          <div>
            <strong>Link:</strong>{" "}
            <a
              href={getSanitizedLink(profile.link)}
              target="_blank"
              className="appearance-auto"
            >
              {profile.link || ""}
            </a>
          </div>
          <div>
            <strong>Company Name:</strong> {profile.company_name}
          </div>
          <div>
            <strong>More info:</strong> {profile.more_info}
          </div>
          <div>
            <strong>Categories: </strong>
            {selectedCategories}
          </div>
          {(session?.user?.id === profile.id || isAdmin) &&
          <>
          <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
            <Button onClick={() => deleteProfile(session)} className="bg-red-600 text-white">
  Delete Profile
</Button>
            
          </>
            

          }

          {successMessage && (
            <p className="text-green-600 mt-2">{successMessage}</p>
          )}
        </div>
      ) : (
        <form
          onSubmit={updateProfile}
          className="flex flex-col place-content-center items-left"
        >
          <div className="mt-6 flex gap-1">
            <label>
              First Name:
              <input
                type="text"
                name="first_name"
                value={profile.first_name || ""}
                placeholder="Your first name"
                onChange={handleChange}
                className="border w-full p-2 rounded-sm"
              />
            </label>
            <label>
              Surname:
              <input
                type="text"
                name="surname"
                value={profile.surname || ""}
                placeholder="Your surname"
                onChange={handleChange}
                className="border w-full p-2 rounded-sm"
              />
            </label>
          </div>
          <div className="mt-6">
            <label>
              Email:
              <input
                type="text"
                name="email"
                value={session?.user?.email}
                placeholder="Your email"
                disabled
                className="border w-full p-2 rounded-sm bg-gray-100"
              />
            </label>
          </div>
          <div className="mt-6">
            <label>
              Phone:
              <input
                type="text"
                name="phone"
                value={profile.phone || ""}
                placeholder="Your phone number"
                onChange={handleChange}
                className="border w-full p-2 rounded-sm"
              />
            </label>
          </div>
          <div className="mt-6">
            <label>
              Link:
              <input
                type="text"
                name="link"
                value={profile.link || ""}
                placeholder="A link to more info about you."
                onChange={handleChange}
                className="border w-full p-2 rounded-sm"
              />
            </label>
          </div>
          <div className="mt-6">
            <label>
              Company Name:
              <input
                type="text"
                name="company_name"
                value={profile.company_name || ""}
                placeholder="Please enter the name of your consulting company here if you have one."
                onChange={handleChange}
                className="border w-full p-2 rounded-sm"
              />
            </label>
          </div>
          <div className="mt-6">
            <label>
              More info:
              <textarea
                type="text"
                name="more_info"
                value={profile.more_info || ""}
                placeholder="More information about the services you provide."
                onChange={handleChange}
                className="border w-full p-2 rounded-sm"
              />
            </label>
          </div>
          <CategorySelector
            allCategories={allCategories}
            selectedCategoryIds={selectedCategoryIds}
            setSelectedCategoryIds={setSelectedCategoryIds}
          />
          <div className="flex gap-2 mt-6">
            <Button
              type="submit"
              disabled={loading}
              className="h-[59px] w-full bg-[#c0c0c0] dark:text-black"
            >
              {loading ? "Loading..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              onClick={() => setEditMode(false)}
              className="h-[59px] w-full bg-gray-300 dark:text-black"
            >
              Cancel
            </Button>
          </div>

          {successMessage && (
            <p className="text-green-600 mt-2">{successMessage}</p>
          )}
        </form>
      )}
    </div>
  );
};

export default Profile;
