import React, { useEffect, useState } from "react";
import API, { getWellnessProgress, getWellnessScore } from "../api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function DashboardPage() {
  const navigate = useNavigate();

  // STATE
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(null);
  const [progress, setProgress] = useState([]);
  const [isImproveLoading, setIsImproveLoading] = useState(false);

  const token = localStorage.getItem("promptpal_token");
  const userId = localStorage.getItem("promptpal_userId");

  // 🚧 CHECK LOGIN FIRST
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate, token]);

  // 📊 LOAD DASHBOARD SCORE + PROGRESS
  useEffect(() => {
    if (!userId) return;

    async function loadData() {
      try {
        const scoreRes = await getWellnessScore(userId);
        setScore(scoreRes.data);

        const progressRes = await getWellnessProgress(userId);
        setProgress(progressRes.data);
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
      }
    }

    loadData();
  }, [userId]);

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

  const askHowToImproveScore = async () => {
    if (!userId) return;

    const totalScore = score?.totalScore ?? "N/A";
    const skinScore = score?.skinScore ?? score?.skin ?? "N/A";
    const sleepScore = score?.sleepScore ?? score?.sleep ?? "N/A";

    const prompt = `User wellness score: ${totalScore}\n\nSkin score: ${skinScore}\nSleep score: ${sleepScore}\n\nHow can the user improve their wellness score?`;

    try {
      setIsImproveLoading(true);
      const res = await axios.post(
        `http://localhost:8080/api/wellness/advice/${userId}`,
        { adviceType: "CUSTOM", customPrompt: prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResults([res.data, ...results]);
      setMessage("");
    } catch (err) {
      console.error("Error generating improvement advice:", err);
      setMessage("Failed to generate score improvement advice.");
    } finally {
      setIsImproveLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 px-4 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-5xl rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <h2 className="mb-6 text-center text-3xl font-bold text-cyan-200">
          🧠 AI Personalized Wellness Dashboard
        </h2>

        <div className="mb-6 flex flex-wrap justify-center gap-4">
          <button
            className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-white transition hover:from-cyan-600 hover:to-blue-700"
            onClick={() => generateAdvice("SKIN")}
          >
            Generate Skin Advice
          </button>
          <button
            className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-white transition hover:from-emerald-600 hover:to-teal-700"
            onClick={() => generateAdvice("HAIR")}
          >
            Generate Hair Advice
          </button>
          <button
            className="rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-600 px-4 py-2 text-white transition hover:from-violet-600 hover:to-fuchsia-700"
            onClick={() => generateAdvice("BODY")}
          >
            Generate Body Advice
          </button>
          <button
            className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-white transition hover:from-amber-600 hover:to-orange-700 disabled:opacity-60"
            onClick={askHowToImproveScore}
            disabled={isImproveLoading}
          >
            {isImproveLoading ? "Asking AI..." : "How to Improve Score"}
          </button>
          <button
            className="rounded-lg bg-gradient-to-r from-slate-600 to-slate-700 px-4 py-2 text-white transition hover:from-slate-700 hover:to-slate-800"
            onClick={() => navigate("/choose-advice")}
          >
            Open Advice Hub
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-6">
            <h2 className="text-xl font-bold text-emerald-200">Wellness Score</h2>
            <h1 className="text-4xl text-emerald-300">
              {score?.totalScore ?? "--"}/100
            </h1>
          </div>
          <div className="rounded-2xl border border-cyan-300/30 bg-cyan-500/10 p-6">
            <p className="text-sm text-cyan-200">Progress Entries</p>
            <p className="text-2xl font-bold text-cyan-100">{progress.length}</p>
          </div>
        </div>

        <div className="mb-6 overflow-x-auto rounded-2xl border border-white/15 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-bold text-white">Wellness Progress</h2>
          <LineChart width={500} height={300} data={progress}>
            <CartesianGrid stroke="#334155" />
            <XAxis dataKey="createdAt" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip />
            <Line type="monotone" dataKey="totalScore" stroke="#4CAF50" />
          </LineChart>
        </div>

        {message && <p className="text-center text-rose-300">{message}</p>}

        <div className="space-y-6">
          {results.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-cyan-300/20 bg-cyan-500/10 p-5"
            >
              <p className="mb-2 font-semibold text-cyan-200">
                🩵 Advice Type: {r.adviceType}
              </p>
              <p className="mb-2 text-slate-100">
                <strong>🧠 AI Response:</strong> {r.aiResponse}
              </p>
              <p className="text-sm text-slate-300">
                ⏰ {new Date(r.generationTime).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
