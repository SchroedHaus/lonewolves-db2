// Header.jsx
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { userAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { handleSignOut } from "./SignOut";
import { supabase } from "../supabaseClient";

const Header = () => {
  const { session } = userAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  

  useEffect(() => {
    const fetchFirstName = async () => {
      if (session?.user?.id) {
        const {data, error} = await supabase
          .from("profiles")
          .select("first_name")
          .eq("id", session.user.id)
          .single();
          if (data && data.first_name) setFirstName(data.first_name)
      }
    }
    fetchFirstName();

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

  }, [session])

  

  if (!session) return null;

  return (
    <header className="shadow-md fixed top-0 left-0 w-full z-50 bg-white dark:bg-[#343434]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div>
          {firstName && (
            <span className="font-semibold text-lg dark:text-white">
              Hi, {firstName}
            </span>
          )}
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6">
          <a
            href={`/profile/${session.user.id}`}
            className="hover:text-indigo-600"
          >
            Profile
          </a>
          <a href="/dashboard" className="hover:text-indigo-600">
            Dashboard
          </a>
          {isAdmin && (
            <a href="/admin" className="hover:text-indigo-600">
              Admin
            </a>
          )}
          <a
            onClick={() => handleSignOut(navigate)}
            className="cursor-pointer
        hover:text-indigo-600"
          >
            Sign Out
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          id="menuButton"
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} className="dark:stroke-white" />
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="bg-white dark:bg-[#343434] md:hidden shadow-lg px-4 py-4 space-y-2 text-gray-700">
          <a href="/profile" className="block hover:text-indigo-600">
            Profile
          </a>
          <a href="/review-request" className="block hover:text-indigo-600">
            Request Review
          </a>
          <a
            onClick={() => handleSignOut(navigate)}
            className="cursor-pointer
        hover:text-indigo-600 block"
          >
            Sign Out
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
