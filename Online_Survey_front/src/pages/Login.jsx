import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup
      ? "http://localhost:8080/api/users/signup"
      : "http://localhost:8080/api/users/login";

    try {
      const { data } = await axios.post(endpoint, form);

      if (data.status === "ok") {
        if (!isSignup) {
          // ✅ Store user and notify Navbar immediately
          localStorage.setItem(
            "user",
            JSON.stringify({ id: data.userId, name: data.name })
          );
          window.dispatchEvent(new Event("userChange")); // ✅ Fix Navbar sync
          navigate("/dashboard");
        } else {
          alert("✅ Signup successful! Please login now.");
          setIsSignup(false);
        }
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch {
      alert("Server error. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#0b1120] via-[#111827] to-[#1e293b]">
      <div className="w-full max-w-md bg-white/10 border border-white/10 rounded-2xl p-8 backdrop-blur-lg shadow-2xl text-white">
        <h2 className="text-3xl font-bold mb-2 text-center">
          {isSignup ? "Create Account ✨" : "Welcome Back 👋"}
        </h2>
        <p className="text-center text-gray-400 mb-8">
          {isSignup
            ? "Join Surveyly and start exploring insights."
            : "Sign in to your account."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full bg-[#1e293b]/70 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full bg-[#1e293b]/70 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full bg-[#1e293b]/70 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 py-2.5 rounded-lg font-semibold hover:opacity-90 transition"
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-400 hover:underline"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
