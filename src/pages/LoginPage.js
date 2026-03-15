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
              PromptPal Access
            </p>
            <h1 className="text-5xl font-black leading-tight tracking-tight">
              Welcome Back To Your Wellness Hub
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/85">
              Log in to continue tracking your progress and get AI-powered
              recommendations tailored to your goals.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-white/40 bg-white/10 px-4 py-1">
                Secure Login
              </span>
              <span className="rounded-full border border-white/40 bg-white/10 px-4 py-1">
                Instant Insights
              </span>
              <span className="rounded-full border border-white/40 bg-white/10 px-4 py-1">
                Personalized Plans
              </span>
            </div>
          </section>

          <section className="w-full">
            <div className="rounded-3xl border border-white/35 bg-white/16 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <h2 className="text-3xl font-extrabold text-white">Welcome Back</h2>
              <p className="mt-1 text-sm text-white/80">
                Sign in to continue your personalized wellness journey.
              </p>

              <form onSubmit={handleLogin} className="mt-6 space-y-4">
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
                  Log In
                </button>
              </form>

              {message && (
                <p className="mt-4 rounded-lg border border-white/35 bg-white/20 px-4 py-3 text-center text-sm text-white">
                  {message}
                </p>
              )}

              <div className="mt-6 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                <p className="text-white/85">
                  New here?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold text-cyan-100 underline decoration-cyan-200/70 underline-offset-4 hover:text-white"
                  >
                    Create an account
                  </Link>
                </p>

                <Link
                  to="/forgot-password"
                  className="font-medium text-cyan-100 underline decoration-cyan-200/70 underline-offset-4 hover:text-white"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
