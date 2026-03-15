import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from "react-router-dom";

import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProtectedRoute from "./components/ProtectedRoute";
import EditProfilePage from "./pages/EditProfilePage";
import ChooseAdvicePage from "./pages/ChooseAdvicePage";
import PromptPal from "./pages/PromptPal";
import PromptPalResultPage from "./pages/PromptPalResultPage";



// Helper functions
function getToken() {
  return localStorage.getItem("promptpal_token");
}

function logout() {
  localStorage.removeItem("promptpal_token");
  localStorage.removeItem("promptpal_userId");
  window.location.href = "/login";
}

export default function App() {
  const isAuthenticated = !!getToken();

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link to="/" className="font-bold text-xl text-cyan-300 tracking-wide">
              PROMPTPAL
            </Link>

            <nav className="space-x-4 text-slate-200">
              {!isAuthenticated ? (
                <>
                  <Link to="/signup" className="hover:underline hover:text-cyan-300">
                    Signup
                  </Link>
                  <Link to="/login" className="hover:underline hover:text-cyan-300">
                    Login
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/profile" className="hover:underline hover:text-cyan-300">
                    Profile
                  </Link>
                  <Link to="/dashboard" className="hover:underline hover:text-cyan-300">
                    Dashboard
                  </Link>
                  <Link to="/choose-advice" className="hover:underline hover:text-cyan-300">
                    Choose Advice
                  </Link>
                  <button
                    onClick={logout}
                    className="rounded-lg bg-gradient-to-r from-rose-500 to-red-600 px-3 py-1 text-white transition hover:from-rose-600 hover:to-red-700"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-0">
          <Routes>
            {/* Landing Page */}
            <Route
              path="/"
              element={
                <Navigate to={isAuthenticated ? "/dashboard" : "/signup"} />
              }
            />

            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* PROTECTED ROUTES */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
  path="/edit-profile"
  element={
    <ProtectedRoute>
      <EditProfilePage />
    </ProtectedRoute>
  }
/>
<Route
  path="/choose-advice"
  element={
    <ProtectedRoute>
      <ChooseAdvicePage />
    </ProtectedRoute>
  }
/>
<Route
 path="/promptpal" element={<PromptPal />} />
 <Route
  path="/promptpal/result"
  element={
    <ProtectedRoute>
      <PromptPalResultPage />
    </ProtectedRoute>
  }
/>



          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 py-4 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} PROMPTPAL — Personalized Skin,Hair and Body Wellness
        </footer>

      </div>
    </Router>
  );
}
