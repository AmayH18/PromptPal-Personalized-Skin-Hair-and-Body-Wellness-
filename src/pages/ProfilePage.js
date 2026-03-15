import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/dashboard");
  };

  useEffect(() => {
    const token = localStorage.getItem("promptpal_token");

    if (!token) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
  try {
    const res = await API.get("/api/auth/profile");

    setUser(res.data);
  } catch (err) {
    console.error("Profile fetch failed:", err);
    setUser(null);
  } finally {
    setLoading(false);
  }
};


    loadProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/55 via-slate-900/45 to-rose-900/55" />
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="rounded-2xl border border-white/35 bg-white/16 px-6 py-4 text-lg font-semibold text-white backdrop-blur-xl">
            Loading Profile...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/55 via-slate-900/45 to-rose-900/55" />
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="rounded-2xl border border-rose-300/60 bg-rose-500/25 px-6 py-4 text-lg text-white backdrop-blur-xl">
            Failed to load profile.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/55 via-slate-900/45 to-rose-900/55" />
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-fuchsia-300/25 blur-3xl" />

      <div className="relative z-10 min-h-screen px-4 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-2">
          <section className="hidden pt-6 text-white lg:block">
            <p className="mb-4 inline-flex rounded-full border border-white/35 bg-white/10 px-4 py-1 text-sm tracking-wide backdrop-blur-sm">
              Your Wellness Identity
            </p>
            <h1 className="text-5xl font-black leading-tight tracking-tight">
              Profile Snapshot And Health Inputs
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/85">
              Review your details and scoring metrics. Keep this profile accurate
              to unlock better AI insights and progress tracking.
            </p>
          </section>

          <section className="w-full">
            <div className="rounded-3xl border border-white/35 bg-white/16 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-3">
                <h2 className="text-3xl font-extrabold text-white">Your Profile</h2>
                <button
                  type="button"
                  onClick={goBack}
                  className="rounded-xl border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Back
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 text-sm text-white sm:grid-cols-2">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>
                <p><strong>Age:</strong> {user.age ?? "Not specified"}</p>
                <p><strong>Height:</strong> {user.height != null ? user.height + " cm" : "Not set"}</p>
                <p><strong>Weight:</strong> {user.weight != null ? user.weight + " kg" : "Not set"}</p>
                <p><strong>Skin Type:</strong> {user.skinType || "Not set"}</p>
                <p><strong>Hair Type:</strong> {user.hairType || "Not set"}</p>
                <p><strong>Body Goal:</strong> {user.bodyGoal || "Not set"}</p>
                <p><strong>Skin Concern Level:</strong> {user.skinConcernLevel ?? "Not set"}</p>
                <p><strong>Hair Concern Level:</strong> {user.hairConcernLevel ?? "Not set"}</p>
                <p><strong>Sleep Hours:</strong> {user.sleepHours ?? "Not set"}</p>
                <p><strong>Diet Score:</strong> {user.dietScore ?? "Not set"}</p>
                <p><strong>Exercise Score:</strong> {user.exerciseScore ?? "Not set"}</p>
                <p><strong>Allergies:</strong> {user.allergies || "None"}</p>
                <p className="sm:col-span-2"><strong>Daily Routine:</strong> {user.dailyRoutine || "Not provided"}</p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/edit-profile")}
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 font-semibold text-white shadow-lg transition hover:from-cyan-600 hover:to-blue-700"
                >
                  Edit Profile
                </button>

                <button
                  onClick={() => navigate("/promptpal")}
                  className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 font-semibold text-white shadow-lg transition hover:from-emerald-600 hover:to-teal-700"
                >
                  Generate Advice
                </button>

                <button
                  className="rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-4 py-2 font-semibold text-white shadow-lg transition hover:from-rose-600 hover:to-red-700"
                  onClick={() => {
                    localStorage.removeItem("promptpal_token");
                    localStorage.removeItem("promptpal_userId");
                    navigate("/login");
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
