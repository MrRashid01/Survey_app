import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login.jsx";
import CreateSurvey from "./pages/CreateSurvey.jsx";
import TakeSurvey from "./pages/TakeSurvey.jsx";
import Analysis from "./pages/Analysis.jsx";
import MySurveys from "./pages/MySurveys.jsx";
import Dashboard from "./pages/Dashboard.jsx"; // ✅ New modern dashboard

// 🌙 Navbar Component
function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    // Sync user state across tabs
    const syncUser = () => {
      const updatedUser = localStorage.getItem("user");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight"
        >
          Surveyly
        </Link>

        {/* Navigation */}
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

// ⚙️ App Component
export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#1e293b] text-gray-100">
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-6 animate-fadeIn">
          <Routes>
            {/* 🏠 Landing Page */}
            <Route
              path="/"
              element={
                <div className="flex flex-col items-center justify-center text-center min-h-[70vh]">
                  <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
                    Welcome to Surveyly 🚀
                  </h1>
                  <p className="text-gray-400 max-w-lg text-lg leading-relaxed mb-8">
                    Create beautiful surveys, share them instantly, and get
                    real-time analytics — powered by React + Spring Boot.
                  </p>
                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition font-semibold"
                  >
                    Get Started →
                  </Link>
                </div>
              }
            />

            {/* 🔐 Authentication & Features */}
            <Route path="/login" element={<Login />} />
            <Route path="/create" element={<CreateSurvey />} />
            <Route path="/take-survey/:id" element={<TakeSurvey />} />
            <Route path="/analysis/:id" element={<Analysis />} />

            {/* 📊 Dashboard & Surveys */}
            <Route path="/dashboard" element={<Dashboard />} /> {/* new modern dashboard */}
            <Route path="/mysurveys" element={<MySurveys />} /> {/* your created surveys */}
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 text-center py-6 text-sm text-gray-500 mt-10 bg-[#0b1120]/80 backdrop-blur">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-blue-400">Surveyly</span> — Designed
          with 💙 using React + Spring Boot
        </footer>
      </div>
    </BrowserRouter>
  );
}
