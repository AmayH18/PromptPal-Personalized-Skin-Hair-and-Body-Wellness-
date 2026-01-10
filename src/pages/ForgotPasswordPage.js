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
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 overflow-hidden">

      {/* Center Card */}
      <div className="relative z-10 w-full max-w-md bg-white bg-opacity-95 rounded-2xl shadow-2xl p-8 border border-gray-100">
        
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Forgot Password
        </h2>

        {message && (
          <p className="text-center mb-4 text-red-500 font-medium">{message}</p>
        )}

        {/* --- STEP 1: ENTER EMAIL --- */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <label className="font-medium text-gray-700">Email Address</label>
            <input
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
            >
              Send OTP
            </button>
          </form>
        )}

        {/* --- STEP 2: ENTER OTP + NEW PASSWORD --- */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <label className="font-medium text-gray-700">Enter OTP</label>
            <input
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
              type="text"
              placeholder="Enter the 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <label className="font-medium text-gray-700">New Password</label>
            <input
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
            >
              Reset Password
            </button>
          </form>
        )}

        {/* --- STEP 3: SUCCESS --- */}
        {step === 3 && (
          <div className="text-center">
            <p className="text-green-600 text-lg font-semibold mb-4">
              Password reset successfully!
            </p>

            <a
              href="/login"
              className="text-indigo-600 text-lg font-medium hover:underline"
            >
              Go to Login →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
