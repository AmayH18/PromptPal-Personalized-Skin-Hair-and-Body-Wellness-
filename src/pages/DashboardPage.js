import React, { useEffect, useState } from "react";
import API from "../api";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();

  // STATE
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("promptpal_token");
  const userId = localStorage.getItem("promptpal_userId");

  // 🚧 CHECK LOGIN FIRST
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate, token]);

  // 📜 LOAD WELLNESS HISTORY
  useEffect(() => {
    if (!userId) return;

    API.get("/wellness/history/" + userId)
      .then((res) => setResults(res.data))
      .catch(() => setMessage("Error loading data."));
  }, [userId]);

  // ✨ GENERATE WELLNESS ADVICE
  const generateAdvice = async (type) => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/wellness/advice/${userId}`,
        { adviceType: type },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResults([res.data, ...results]);
    } catch (err) {
      console.error("Error generating advice:", err);
      setMessage("Failed to generate advice.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          🧠 AI Personalized Wellness Dashboard
        </h2>

        <div className="flex justify-center gap-4 mb-6">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={() => generateAdvice("SKIN")}
          >
            Generate Skin Advice
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            onClick={() => generateAdvice("HAIR")}
          >
            Generate Hair Advice
          </button>
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            onClick={() => generateAdvice("BODY")}
          >
            Generate Body Advice
          </button>
        </div>

        {message && <p className="text-center text-gray-600">{message}</p>}

        <div className="space-y-6">
          {results.map((r) => (
            <div
              key={r.id}
              className="border border-blue-100 bg-blue-50 rounded-xl p-5 shadow-sm"
            >
              <p className="font-semibold text-blue-800 mb-2">
                🩵 Advice Type: {r.adviceType}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>🧠 AI Response:</strong> {r.aiResponse}
              </p>
              <p className="text-gray-500 text-sm">
                ⏰ {new Date(r.generationTime).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
