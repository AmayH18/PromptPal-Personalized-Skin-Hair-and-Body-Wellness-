import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [skinType, setSkinType] = useState("");
  const [hairType, setHairType] = useState("");
  const [bodyGoal, setBodyGoal] = useState("");
  const [skinConcernLevel, setSkinConcernLevel] = useState(5);
  const [hairConcernLevel, setHairConcernLevel] = useState(5);
  const [sleepHours, setSleepHours] = useState(8);
  const [dietScore, setDietScore] = useState(70);
  const [exerciseScore, setExerciseScore] = useState(70);
  const [allergies, setAllergies] = useState("");
  const [dailyRoutine, setDailyRoutine] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("promptpal_token");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const u = res.data;

        setPhone(u.phone || "");
        setAge(u.age || "");
        setHeight(u.height || "");
        setWeight(u.weight || "");
        setSkinType(u.skinType || "");
        setHairType(u.hairType || "");
        setBodyGoal(u.bodyGoal || "");
        setSkinConcernLevel(u.skinConcernLevel ?? 5);
        setHairConcernLevel(u.hairConcernLevel ?? 5);
        setSleepHours(u.sleepHours ?? 8);
        setDietScore(u.dietScore ?? 70);
        setExerciseScore(u.exerciseScore ?? 70);
        setAllergies(u.allergies || "");
        setDailyRoutine(u.dailyRoutine || "");
      } catch (err) {
        console.error("Error loading profile:", err);
        setMessage("Failed to load profile.");
      }
    };

    loadProfile();
  }, [token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!phone || phone.length < 10) return setMessage("Enter a valid phone number.");
    if (age < 10 || age > 100) return setMessage("Enter a valid age.");
    if (height < 50 || height > 250) return setMessage("Enter valid height.");
    if (weight < 20 || weight > 300) return setMessage("Enter valid weight.");
    if (skinConcernLevel < 1 || skinConcernLevel > 10) {
      return setMessage("Skin concern level must be between 1 and 10.");
    }
    if (hairConcernLevel < 1 || hairConcernLevel > 10) {
      return setMessage("Hair concern level must be between 1 and 10.");
    }
    if (sleepHours < 0 || sleepHours > 24) {
      return setMessage("Sleep hours must be between 0 and 24.");
    }
    if (dietScore < 1 || dietScore > 100) {
      return setMessage("Diet score must be between 1 and 100.");
    }
    if (exerciseScore < 1 || exerciseScore > 100) {
      return setMessage("Exercise score must be between 1 and 100.");
    }

    try {
      await axios.put(
        "http://localhost:8080/api/auth/update-profile",
        {
          phone,
          age,
          height,
          weight,
          skinType,
          hairType,
          bodyGoal,
          skinConcernLevel,
          hairConcernLevel,
          sleepHours,
          dietScore,
          exerciseScore,
          allergies,
          dailyRoutine,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile.");
    }
  };

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
          <section className="hidden lg:block text-white pt-6">
            <p className="mb-4 inline-flex rounded-full border border-white/35 bg-white/10 px-4 py-1 text-sm tracking-wide backdrop-blur-sm">
              Profile Settings
            </p>
            <h1 className="text-5xl font-black leading-tight tracking-tight">
              Fine-Tune Your Wellness Profile
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/85">
              Update health details and scoring metrics so PromptPal can deliver
              sharper, more personalized guidance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-white/40 bg-white/10 px-4 py-1">
                Better AI Prompts
              </span>
              <span className="rounded-full border border-white/40 bg-white/10 px-4 py-1">
                Better Score Tracking
              </span>
              <span className="rounded-full border border-white/40 bg-white/10 px-4 py-1">
                Better Daily Plans
              </span>
            </div>
          </section>

          <section className="w-full">
            <div className="rounded-3xl border border-white/35 bg-white/16 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-3xl font-extrabold text-white">Edit Profile</h2>
                  <p className="mt-1 text-sm text-white/80">
                    Keep your profile updated for accurate recommendations.
                  </p>
                  <p className="mt-1 text-xs text-cyan-200">Fields marked with * are compulsory.</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="rounded-xl border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Back
                </button>
              </div>

              {message && (
                <p
                  className={`mt-4 rounded-lg border px-4 py-3 text-center text-sm text-white ${
                    message.toLowerCase().includes("success")
                      ? "border-emerald-300/60 bg-emerald-500/25"
                      : "border-rose-300/60 bg-rose-500/25"
                  }`}
                >
                  {message}
                </p>
              )}

              <form onSubmit={handleUpdate} className="mt-6 space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-white/90">Phone Number *</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-white/40 bg-white/90 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-white/90">Age *</label>
                    <input
                      type="number"
                      className="w-full rounded-xl border border-white/40 bg-white/90 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-white/90">Height (cm) *</label>
                    <input
                      type="number"
                      className="w-full rounded-xl border border-white/40 bg-white/90 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-white/90">Weight (kg) *</label>
                    <input
                      type="number"
                      className="w-full rounded-xl border border-white/40 bg-white/90 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-white/90">Skin Type *</label>
                    <select
                      className="w-full rounded-xl border border-white/40 bg-white/90 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
                      value={skinType}
                      onChange={(e) => setSkinType(e.target.value)}
                      required
                    >
                      <option value="">Select Skin Type</option>
                      <option value="OILY">Oily</option>
                      <option value="DRY">Dry</option>
                      <option value="NORMAL">Normal</option>
                      <option value="COMBINATION">Combination</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-white/90">Hair Type *</label>
                    <select
                      className="w-full rounded-xl border border-white/40 bg-white/90 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
                      value={hairType}
                      onChange={(e) => setHairType(e.target.value)}
                      required
                    >
                      <option value="">Select Hair Type</option>
                      <option value="STRAIGHT">Straight</option>
                      <option value="WAVY">Wavy</option>
                      <option value="CURLY">Curly</option>
                      <option value="COILY">Coily</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-white/90">Body Goal *</label>
                    <select
                      className="w-full rounded-xl border border-white/40 bg-white/90 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
                      value={bodyGoal}
                      onChange={(e) => setBodyGoal(e.target.value)}
                      required
                    >
                      <option value="">Select Body Goal</option>
                      <option value="WEIGHT_LOSS">Weight Loss</option>
                      <option value="WEIGHT_GAIN">Weight Gain</option>
                      <option value="FITNESS">Fitness</option>
                      <option value="MUSCLE_GAIN">Muscle Gain</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/35 bg-white/10 p-4 sm:p-5">
                  <h3 className="mb-3 text-lg font-semibold text-white">Wellness Scoring Inputs</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-white/90">Skin Concern Level (1-10) *</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        className="w-full rounded-xl border border-white/40 bg-white/90 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
                        value={skinConcernLevel}
                        onChange={(e) => setSkinConcernLevel(Number(e.target.value))}
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-white/90">Hair Concern Level (1-10) *</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        className="w-full rounded-xl border border-white/40 bg-white/90 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
                        value={hairConcernLevel}
                        onChange={(e) => setHairConcernLevel(Number(e.target.value))}
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-white/90">Sleep Hours (0-24) *</label>
                      <input
                        type="number"
                        min="0"
                        max="24"
                        className="w-full rounded-xl border border-white/40 bg-white/90 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
                        value={sleepHours}
                        onChange={(e) => setSleepHours(Number(e.target.value))}
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-white/90">Diet Score (1-100) *</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        className="w-full rounded-xl border border-white/40 bg-white/90 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
                        value={dietScore}
                        onChange={(e) => setDietScore(Number(e.target.value))}
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-white/90">Exercise Score (1-100) *</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        className="w-full rounded-xl border border-white/40 bg-white/90 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
                        value={exerciseScore}
                        onChange={(e) => setExerciseScore(Number(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-white/90">Allergies (Optional)</label>
                  <textarea
                    className="w-full rounded-xl border border-white/40 bg-white/90 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
                    placeholder="Enter any allergies"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-white/90">Daily Routine (Optional, max 75 characters)</label>
                  <textarea
                    className="w-full rounded-xl border border-white/40 bg-white/90 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
                    maxLength={75}
                    value={dailyRoutine}
                    onChange={(e) => setDailyRoutine(e.target.value)}
                  />
                  <p className="mt-1 text-right text-xs text-white/85">{dailyRoutine.length} / 75</p>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-semibold text-white shadow-lg transition hover:from-cyan-600 hover:to-blue-700"
                >
                  Save Profile
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
