import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChooseAdvicePage() {
  const navigate = useNavigate();
  const [advice, setAdvice] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [profileComplete, setProfileComplete] = useState(false);
  const [profileChecked, setProfileChecked] = useState(false);
  const [missingFields, setMissingFields] = useState([]);

  const token = localStorage.getItem("promptpal_token");
  const userId = localStorage.getItem("promptpal_userId");

  const getMissingCompulsoryFields = (user) => {
    if (!user) return ["Profile data"];

    const missing = [];

    if (!String(user.phone || "").trim()) missing.push("Phone");
    if (!(Number(user.age) > 0)) missing.push("Age");
    if (!(Number(user.height) > 0)) missing.push("Height");
    if (!(Number(user.weight) > 0)) missing.push("Weight");
    if (!String(user.skinType || "").trim()) missing.push("Skin Type");
    if (!String(user.hairType || "").trim()) missing.push("Hair Type");
    if (!String(user.bodyGoal || "").trim()) missing.push("Body Goal");

    // Wellness scoring inputs (compulsory)
    if (!(Number(user.skinConcernLevel) >= 1 && Number(user.skinConcernLevel) <= 10)) {
      missing.push("Skin Concern Level (1-10)");
    }
    if (!(Number(user.hairConcernLevel) >= 1 && Number(user.hairConcernLevel) <= 10)) {
      missing.push("Hair Concern Level (1-10)");
    }
    if (!(Number(user.sleepHours) >= 0 && Number(user.sleepHours) <= 24)) {
      missing.push("Sleep Hours (0-24)");
    }
    if (!(Number(user.dietScore) >= 1 && Number(user.dietScore) <= 100)) {
      missing.push("Diet Score (1-100)");
    }
    if (!(Number(user.exerciseScore) >= 1 && Number(user.exerciseScore) <= 100)) {
      missing.push("Exercise Score (1-100)");
    }

    return missing;
  };

  const loadProfileStatus = async () => {
    if (!token) {
      setProfileComplete(false);
      setProfileChecked(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile.");
      }

      const data = await response.json();
      const missing = getMissingCompulsoryFields(data);
      setMissingFields(missing);
      setProfileComplete(missing.length === 0);
    } catch (err) {
      console.error(err);
      setProfileComplete(false);
      setMissingFields(["Profile data"]);
    } finally {
      setProfileChecked(true);
    }
  };

  const loadHistory = async () => {
    if (!token || !userId) {
      setMessage("Please login first.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/wellness/history/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch history.");
      }

      const data = await response.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setMessage("Error loading advice history.");
    }
  };

  useEffect(() => {
    loadProfileStatus();
    loadHistory();
  }, []);

  const generateAdvice = async (type) => {
    if (!token || !userId) {
      setMessage("Please login first.");
      return;
    }

    if (!profileComplete) {
      alert("Please complete your wellness profile first");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      let aiResponse = "";

      if (type === "all") {
        const response = await fetch(
          `http://localhost:8080/api/wellness/multi-advice/${userId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ skin: true, hair: true, body: true }),
          }
        );

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || "Failed to generate full wellness advice.");
        }

        const data = await response.json();
        const parts = [];
        if (data.skin) parts.push(`Skin Advice:\n${data.skin}`);
        if (data.hair) parts.push(`Hair Advice:\n${data.hair}`);
        if (data.body) parts.push(`Body Advice:\n${data.body}`);
        aiResponse = parts.join("\n\n");
      } else {
        const adviceType = type.toUpperCase();
        const response = await fetch(
          `http://localhost:8080/api/wellness/advice/${userId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ adviceType }),
          }
        );

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || `Failed to generate ${type} advice.`);
        }

        const data = await response.json();
        aiResponse = data.aiResponse || "No advice generated.";
      }

      setAdvice(aiResponse);
      await loadHistory();
    } catch (err) {
      console.error(err);
      const errorText = err?.message || "Error generating advice.";

      if (errorText.toLowerCase().includes("profile") || errorText.toLowerCase().includes("user not found")) {
        alert("Please complete your wellness profile first");
        setMessage("Please complete your wellness profile first.");
      } else {
        setMessage(errorText);
      }
    } finally {
      setLoading(false);
    }
  };

  const disableGenerate = loading || !profileComplete;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-10">
      <div className="mx-auto w-full max-w-5xl rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <h2 className="mb-6 text-center text-3xl font-bold text-cyan-200">
          Choose Your Wellness Advice
        </h2>

        <div className="mb-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => generateAdvice("skin")}
            disabled={disableGenerate}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 font-semibold text-white transition hover:from-cyan-600 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Skin Advice
          </button>

          <button
            onClick={() => generateAdvice("hair")}
            disabled={disableGenerate}
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2 font-semibold text-white transition hover:from-emerald-600 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Hair Advice
          </button>

          <button
            onClick={() => generateAdvice("body")}
            disabled={disableGenerate}
            className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 px-5 py-2 font-semibold text-white transition hover:from-violet-600 hover:to-fuchsia-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Body Advice
          </button>

          <button
            onClick={() => generateAdvice("all")}
            disabled={disableGenerate}
            className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2 font-semibold text-white transition hover:from-amber-600 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Full Wellness Advice
          </button>
        </div>

        {loading && <p className="mb-4 text-center text-cyan-200">Generating advice...</p>}
        {profileChecked && !profileComplete && (
          <div className="mb-4 text-center">
            <p className="mb-3 text-amber-300">
              Complete compulsory profile fields first. Allergies and Daily Routine are optional.
            </p>
            {missingFields.length > 0 && (
              <p className="mb-3 text-xs text-slate-300">
                Missing: {missingFields.join(", ")}
              </p>
            )}
            <button
              type="button"
              onClick={() => navigate("/edit-profile")}
              className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 font-semibold text-white transition hover:from-amber-600 hover:to-orange-700"
            >
              Complete Profile
            </button>
          </div>
        )}
        {message && <p className="mb-4 text-center text-rose-300">{message}</p>}

        <div className="advice-box mb-8 min-h-[120px] whitespace-pre-line rounded-2xl border border-white/20 bg-white/5 p-5 text-slate-100">
          {advice || "Your AI advice will appear here."}
        </div>

        <h3 className="mb-4 text-2xl font-bold text-cyan-200">Advice History</h3>
        <div className="space-y-4">
          {history.length === 0 && <p className="text-slate-300">No past advice found yet.</p>}

          {history.map((item) => (
            <div key={item.id} className="rounded-xl border border-white/20 bg-white/5 p-4">
              <p className="font-semibold text-cyan-200">{item.adviceType} Advice</p>
              <p className="mt-1 whitespace-pre-line text-slate-100">{item.aiResponse}</p>
              <p className="mt-2 text-xs text-slate-400">
                {item.generationTime
                  ? new Date(item.generationTime).toLocaleString()
                  : "Time unavailable"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
