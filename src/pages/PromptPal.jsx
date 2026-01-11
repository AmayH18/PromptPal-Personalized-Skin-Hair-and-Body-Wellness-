import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
const GIFS = {
  skin: "/skincare.mp4",
  hair: "/haircare.gif",
  body: "/body.gif",
  all:  "/background.mp4" // temporary (explained below)
};
function Section({ title, content }) {
  return (
    <div className="border rounded-lg p-6 bg-gray-50">
      <h2 className="text-xl font-semibold text-indigo-600 mb-2">
        {title}
      </h2>
      <p className="whitespace-pre-line text-gray-700">
        {content}
      </p>
    </div>
  );
}



export default function PromptPal() {
  const [options, setOptions] = useState({
    skin: false,
    hair: false,
    body: false,
    all: false,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Count selected checkboxes
  const selectedCount =
    (options.skin ? 1 : 0) +
    (options.hair ? 1 : 0) +
    (options.body ? 1 : 0) +
    (options.all ? 1 : 0);

  const handleChange = (key) => {
    if (key === "all") {
      setOptions({
        skin: false,
        hair: false,
        body: false,
        all: !options.all,
      });
      return;
    }

    setOptions((prev) => ({
      ...prev,
      all: false,
      [key]: !prev[key],
    }));
  };

  const generateAdvice = async () => {
    setLoading(true);
    setError("");

    const payload = options.all
      ? { skin: true, hair: true, body: true }
      : {
          skin: options.skin,
          hair: options.hair,
          body: options.body,
        };

    try {
      const res = await API.post("/api/wellness/multi-advice", payload);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate AI advice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          PromptPal – Personalized Wellness
        </h1>

        {/* CHECKBOX SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

  {[
    { key: "skin", label: "Skin Care" },
    { key: "hair", label: "Hair Care" },
    { key: "body", label: "Body Wellness" },
    { key: "all",  label: "All (Skin + Hair + Body)" }
  ].map(({ key, label }) => (

    <div
      key={key}
      onClick={() => handleChange(key)}
      className={`relative cursor-pointer rounded-xl overflow-hidden shadow-lg border-4
        ${options[key] ? "border-indigo-600" : "border-transparent"}
      `}
    >
      {/* GIF */}
      <Media src={GIFS[key]} label={label} />


      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-lg font-semibold">
            {label}
          </h3>
          <input
            type="checkbox"
            checked={options[key]}
            readOnly
            className="w-5 h-5 accent-indigo-600"
          />
        </div>
      </div>

    </div>
  ))}
</div>


        {/* RULE MESSAGE */}
        <p className="text-center text-sm text-gray-600 mb-4">
          Choose <strong>any 1</strong> or <strong>maximum 2</strong> options.
        </p>

        {/* GENERATE BUTTON */}
        <div className="text-center mb-6">
          <button
            disabled={selectedCount === 0 || selectedCount > 2}
            onClick={generateAdvice}
            className={`px-6 py-2 rounded-lg text-white font-semibold
              ${
                selectedCount === 0 || selectedCount > 2
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {loading ? "Generating..." : "Generate Advice"}
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-center text-red-600">{error}</p>
        )}

        {/* RESULT SECTION */}
        {result && (
          <div className="mt-8 space-y-6">
            {result.skin && (
              <Section title="Skin Care" content={result.skin} />
            )}
            {result.hair && (
              <Section title="Hair Care" content={result.hair} />
            )}
            {result.body && (
              <Section title="Body Wellness" content={result.body} />
            )}
          </div>
        )}

        {/* BACK */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/profile")}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Profile
          </button>
        </div>

      </div>
    </div>
  );
}

/* ---------- Helper ---------- */

function Media({ src, label }) {
  if (src.endsWith(".mp4")) {
    return (
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-48 object-cover"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <img
      src={src}
      alt={label}
      className="w-full h-48 object-cover"
    />
  );
}
