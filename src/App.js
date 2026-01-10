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
      <div className="min-h-screen bg-gray-50 text-gray-800">
        
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="font-bold text-xl text-blue-700">
              PROMPTPAL
            </Link>

            <nav className="space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/signup" className="hover:underline hover:text-blue-600">
                    Signup
                  </Link>
                  <Link to="/login" className="hover:underline hover:text-blue-600">
                    Login
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/profile" className="hover:underline hover:text-blue-600">
                    Profile
                  </Link>
                  <Link to="/dashboard" className="hover:underline hover:text-blue-600">
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto p-4">
          <Routes>
            {/* Landing Page */}
            <Route
              path="/"
              element={
                <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
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


          </Routes>
        </main>

        {/* Footer */}
        <footer className="text-center py-4 text-gray-500 text-sm">
          © {new Date().getFullYear()} PROMPTPAL — Personalized AI Wellness
        </footer>

      </div>
    </Router>
  );
}
