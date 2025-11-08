import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // ✅ Re-check user whenever route changes (fixes missed event under StrictMode)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location]);

  useEffect(() => {
    const syncUser = () => {
      const updatedUser = localStorage.getItem("user");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };
    window.addEventListener("storage", syncUser);
    window.addEventListener("userChange", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("userChange", syncUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("userChange"));
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight"
        >
          Surveyly
        </Link>

        <nav className="flex gap-5 items-center text-gray-300 text-sm">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="hover:text-blue-400 font-medium transition-all"
              >
                Dashboard
              </Link>
              <Link
                to="/mysurveys"
                className="hover:text-blue-400 font-medium transition-all"
              >
                My Surveys
              </Link>
              <Link
                to="/create"
                className="hover:text-blue-400 font-medium transition-all"
              >
                Create Survey
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-3 py-1.5 rounded-lg hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-400 font-medium transition-all"
              >
                Login
              </Link>
              <Link
                to="/create"
                className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-3 py-1.5 rounded-lg hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition font-medium"
              >
                Create Survey
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
