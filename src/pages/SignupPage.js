import React, { useState } from "react";
import axios from "axios";

export default function SignupPage() {
  // ✅ Declare all your state variables INSIDE the component function
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  


  const handleSignup = async (e) => {
    e.preventDefault();
    if (!username || !password || !email || !phone) {
    setMessage("⚠️ All fields (username, password, email, phone) are required.");
    return;
  }
    try {
      await axios.post("http://localhost:8080/api/auth/signup", {
        username,
        password,
        phone,
        email
      });
      setMessage("✅ Signup successful! Please login.");
    } catch (err) {
  const msg =
    err.response?.data?.error ||
    err.response?.data?.message ||
    "Signup failed.";
  setMessage(msg);
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
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Form container */}
      <div className="relative z-10 w-full max-w-md bg-white bg-opacity-95 rounded-2xl shadow-2xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Create Your Account
        </h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Phone number (optional)"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
          >
            Sign Up
          </button>
        </form>

        {message && <p className="text-center mt-4 text-gray-700">{message}</p>}

        <p className="text-sm text-center mt-6 text-gray-800">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
