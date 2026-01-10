import React, { useState } from "react";
import axios from "axios";
import API from "../api";
import { Link } from "react-router-dom"; // ✅ Added this import

export default function LoginPage() {
  const [username, setUsername] = useState(""); // ✅ Defined properly
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("http://localhost:8080/api/auth/login", {
      username,
      password,
    });

    console.log("LOGIN RESPONSE:", res.data); // 👈 ADD THIS

    if (!res.data.token) {
      setMessage("❌ No token received from backend");
      return;
    }

    localStorage.setItem("promptpal_token", res.data.token);
    localStorage.setItem("promptpal_userId", res.data.userId);

    window.location.href = "/profile";
  } catch (err) {
    console.error("LOGIN ERROR:", err.response?.data);
    setMessage("❌ Invalid username or password.");
  }
};



  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full-screen background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>

      {/* Optional dark overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md bg-white bg-opacity-95 rounded-2xl shadow-2xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
            type="submit"
          >
            Log In
          </button>
        </form>

        {message && <p className="text-center mt-4 text-gray-700">{message}</p>}

        <div className="flex justify-between items-center mt-6 text-sm text-gray-800">
          <p>
            New here?{" "}
            <a href="/signup" className="text-indigo-600 hover:underline">
              Create an account
            </a>
          </p>
          {/* ✅ Added proper Link component here */}
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
