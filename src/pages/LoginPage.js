import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/api/auth/login", {
        username,
        password,
      });

      if (!res.data.token) {
        setMessage("❌ No token received from backend");
        return;
      }

      // ✅ Store token consistently
      localStorage.setItem("promptpal_token", res.data.token);
      localStorage.setItem("promptpal_userId", res.data.userId);

      // ✅ React Router navigation (NO reload)
      navigate("/profile");
    } catch (err) {
      console.error("Login failed:", err);
      setMessage("❌ Invalid username or password.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 w-full max-w-md bg-white bg-opacity-95 rounded-2xl shadow-2xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full border border-gray-300 rounded-lg p-3"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            className="w-full border border-gray-300 rounded-lg p-3"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg"
            type="submit"
          >
            Log In
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-red-600">{message}</p>
        )}

        <div className="flex justify-between items-center mt-6 text-sm">
          <p>
            New here?{" "}
            <Link to="/signup" className="text-indigo-600 hover:underline">
              Create an account
            </Link>
          </p>

          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
