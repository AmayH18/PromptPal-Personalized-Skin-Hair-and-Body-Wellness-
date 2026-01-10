import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("promptpal_token");

    if (!token) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await API.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (err) {
        console.error("Profile fetch failed:", err);
        localStorage.removeItem("promptpal_token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-semibold">
        Loading Profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 text-xl">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border border-gray-200">
        
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Your Profile
        </h2>

        <div className="space-y-4 text-gray-700 text-lg">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>
          <p><strong>Age:</strong> {user.age || "Not specified"}</p>
          <p><strong>Height:</strong> {user.height ? user.height + " cm" : "Not set"}</p>
          <p><strong>Weight:</strong> {user.weight ? user.weight + " kg" : "Not set"}</p>
          <p><strong>Skin Type:</strong> {user.skinType || "Not set"}</p>
          <p><strong>Hair Type:</strong> {user.hairType || "Not set"}</p>
          <p><strong>Body Goal:</strong> {user.bodyGoal || "Not set"}</p>
          <p><strong>Allergies:</strong> {user.allergies || "None"}</p>
          <p><strong>Daily Routine:</strong> {user.dailyRoutine || "Not provided"}</p>
        </div>

        <div className="mt-8 text-center">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            onClick={() => {
              localStorage.removeItem("promptpal_token");
              localStorage.removeItem("promptpal_userId");
              navigate("/login");
            }}
          >
            Logout
          </button>
          <button
  onClick={() => navigate("/edit-profile")}
  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 mr-3"
>
  Edit Profile
</button>

        </div>

      </div>
    </div>
  );
}
