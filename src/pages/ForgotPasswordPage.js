import React, { useState } from "react";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  // STEP 1 — SEND OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8080/api/auth/forgot-password", {
  email: email
});

      setMessage(res.data);
      setStep(2);
    } catch (err) {
      const msg = err.response?.data || "Failed to send OTP.";
      setMessage(msg);
    }
  };

  // STEP 2 — RESET PASSWORD
  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `http://localhost:8080/api/auth/reset-password?email=${email}&otp=${otp}&newPassword=${newPassword}`
      );
      setMessage(res.data);
      setStep(3);
    } catch (err) {
      const msg = err.response?.data || "Failed to reset password.";
      setMessage(msg);
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

      <div className="relative z-10 mx-auto w-full max-w-md px-4 py-12">
        <div className="rounded-2xl border border-white/30 bg-white/15 p-8 shadow-2xl backdrop-blur-xl">
        
        <h2 className="text-3xl font-bold text-center text-cyan-200 mb-6">
          Forgot Password
        </h2>

        {message && (
          <p className="text-center mb-4 text-rose-300 font-medium">{message}</p>
        )}

        {/* --- STEP 1: ENTER EMAIL --- */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <label className="font-medium text-white">Email Address</label>
            <input
              className="w-full rounded-lg border border-white/40 bg-white/90 p-3 text-slate-900 focus:ring-2 focus:ring-cyan-500"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 py-2 px-4 font-semibold text-white transition-all hover:from-cyan-600 hover:to-blue-700"
            >
              Send OTP
            </button>
          </form>
        )}

        {/* --- STEP 2: ENTER OTP + NEW PASSWORD --- */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <label className="font-medium text-white">Enter OTP</label>
            <input
              className="w-full rounded-lg border border-white/40 bg-white/90 p-3 text-slate-900 focus:ring-2 focus:ring-cyan-500"
              type="text"
              placeholder="Enter the 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <label className="font-medium text-white">New Password</label>
            <input
              className="w-full rounded-lg border border-white/40 bg-white/90 p-3 text-slate-900 focus:ring-2 focus:ring-cyan-500"
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 py-2 px-4 font-semibold text-white transition-all hover:from-emerald-600 hover:to-teal-700"
            >
              Reset Password
            </button>
          </form>
        )}

        {/* --- STEP 3: SUCCESS --- */}
        {step === 3 && (
          <div className="text-center">
            <p className="text-emerald-300 text-lg font-semibold mb-4">
              Password reset successfully!
            </p>

            <a
              href="/login"
              className="text-cyan-200 text-lg font-medium hover:underline"
            >
              Go to Login →
            </a>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
