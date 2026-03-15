import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8080/api/auth/signup", {
        username,
        email,
        password,
      });

      setMessage("✅ Signup successful! Please login.");
    } catch (err) {
      setMessage("❌ Signup failed. Try again.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
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

      {/* Atmospheric overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/55 via-slate-900/45 to-rose-900/55" />
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-fuchsia-300/25 blur-3xl" />

      <div className="relative z-10 min-h-screen px-4 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2">
          <section className="hidden lg:block text-white">
            <p className="mb-4 inline-flex rounded-full border border-white/35 bg-white/10 px-4 py-1 text-sm tracking-wide backdrop-blur-sm">
              Personalized Wellness Journey
            </p>
            <h1 className="text-5xl font-black leading-tight tracking-tight">
              Build Your PromptPal Profile In Seconds
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/85">
              Unlock skin, hair, and body guidance tailored to your goals.
              Create your account and get started with AI-powered wellness plans.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-white/40 bg-white/10 px-4 py-1">
                Smart Recommendations
              </span>
              <span className="rounded-full border border-white/40 bg-white/10 px-4 py-1">
                Progress Tracking
              </span>
              <span className="rounded-full border border-white/40 bg-white/10 px-4 py-1">
                Daily Action Plans
              </span>
            </div>
          </section>

          {/* Signup Form */}
          <section className="w-full">
            <div className="rounded-3xl border border-white/35 bg-white/16 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <h2 className="text-3xl font-extrabold text-white">Create Account</h2>
              <p className="mt-1 text-sm text-white/80">
                Start your personalized wellness experience today.
              </p>

              <form onSubmit={handleSignup} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-white/90">
                    Username
                  </label>
                  <input
                    className="w-full rounded-xl border border-white/40 bg-white/90 px-4 py-3 text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-white/90">
                    Email
                  </label>
                  <input
                    className="w-full rounded-xl border border-white/40 bg-white/90 px-4 py-3 text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white"
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-white/90">
                    Password
                  </label>
                  <input
                    className="w-full rounded-xl border border-white/40 bg-white/90 px-4 py-3 text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-semibold text-white shadow-lg transition hover:from-cyan-600 hover:to-blue-700"
                  type="submit"
                >
                  Sign Up
                </button>
              </form>

              {message && (
                <p className="mt-4 rounded-lg border border-white/35 bg-white/20 px-4 py-3 text-center text-sm text-white">
                  {message}
                </p>
              )}

              <div className="mt-6 text-center text-sm text-white/85">
                <p>
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-cyan-100 underline decoration-cyan-200/70 underline-offset-4 hover:text-white"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
