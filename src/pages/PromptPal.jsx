import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

const GIFS = {
  skin: "/skincare.mp4",
  hair: "/haircare.gif",
  body: "/body.gif",
  all: "/background.mp4",
};

export default function PromptPal() {
  const [options, setOptions] = useState({
    skin: false,
    hair: false,
    body: false,
    all: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activePreview, setActivePreview] = useState("skin");

  const navigate = useNavigate();
  const userId = localStorage.getItem("promptpal_userId");

  const selectedCount =
    (options.skin ? 1 : 0) +
    (options.hair ? 1 : 0) +
    (options.body ? 1 : 0) +
    (options.all ? 1 : 0);

  const isInvalidSelection = selectedCount === 0 || selectedCount > 2;

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

    if (!userId) {
      setError("User session not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      let adviceText = "";
      let accuracy = 90;

      // Single selection should generate only one advice stream.
      if (selectedCount === 1 && !options.all) {
        const adviceType = options.skin ? "SKIN" : options.hair ? "HAIR" : "BODY";

        const res = await API.post(`/api/wellness/advice/${userId}`, {
          adviceType,
        });

        adviceText = res.data?.aiResponse || "No advice generated.";
      } else {
        // Multi-selection (or ALL) uses the grouped endpoint.
        const payload = options.all
          ? { skin: true, hair: true, body: true }
          : {
              skin: options.skin,
              hair: options.hair,
              body: options.body,
            };

        const res = await API.post(`/api/wellness/multi-advice/${userId}`, payload);
        const grouped = res.data || {};

        const parts = [];
        if (grouped.skin) parts.push(`Skin Advice:\n${grouped.skin}`);
        if (grouped.hair) parts.push(`Hair Advice:\n${grouped.hair}`);
        if (grouped.body) parts.push(`Body Advice:\n${grouped.body}`);

        adviceText = parts.join("\n\n");
      }

      navigate("/promptpal/result", {
        state: {
          advice: adviceText,
          accuracy,
        },
      });
    } catch (err) {
      console.error(err);
      setError("Failed to generate AI advice.");
    } finally {
      setLoading(false);
    }
  };

  const previewLabel =
    activePreview === "skin"
      ? "Skin Care"
      : activePreview === "hair"
      ? "Hair Care"
      : activePreview === "body"
      ? "Body Wellness"
      : "Complete Wellness";

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
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/35 bg-white/16 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 inline-flex rounded-full border border-white/35 bg-white/10 px-4 py-1 text-xs font-semibold tracking-wider text-white">
                WELLNESS GENERATOR
              </p>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Build Your PromptPal Advice
              </h1>
              <p className="mt-2 text-white/85">
                Pick one or two wellness domains. We will generate precise,
                personalized action guidance.
              </p>
            </div>
            <button
              onClick={() => navigate("/profile")}
              className="rounded-xl border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Back to Profile
            </button>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="rounded-2xl border border-white/30 bg-white/10 p-4 lg:col-span-2">
              <h2 className="text-lg font-bold text-white">Preview</h2>
              <p className="mt-1 text-sm text-white/80">{previewLabel}</p>

              <div className="mt-3 overflow-hidden rounded-xl border border-white/25">
                <Media src={GIFS[activePreview]} label={previewLabel} />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  { key: "skin", label: "Skin" },
                  { key: "hair", label: "Hair" },
                  { key: "body", label: "Body" },
                  { key: "all", label: "All" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActivePreview(item.key)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      activePreview === item.key
                        ? "bg-cyan-300 text-slate-900"
                        : "border border-white/35 bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/30 bg-white/10 p-4 lg:col-span-3">
              <h2 className="mb-3 text-lg font-bold text-white">Select Focus Areas</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { key: "skin", label: "Skin Care" },
                  { key: "hair", label: "Hair Care" },
                  { key: "body", label: "Body Wellness" },
                  { key: "all", label: "All (Skin + Hair + Body)" },
                ].map(({ key, label }) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => handleChange(key)}
                    className={`group relative overflow-hidden rounded-xl border text-left transition ${
                      options[key]
                        ? "border-cyan-300 bg-cyan-200/20"
                        : "border-white/30 bg-white/5 hover:bg-white/15"
                    }`}
                  >
                    <div className="absolute inset-0 opacity-35">
                      <Media src={GIFS[key]} label={label} compact />
                    </div>
                    <div className="relative flex items-center justify-between p-4">
                      <span className="font-semibold text-white">{label}</span>
                      <input
                        type="checkbox"
                        checked={options[key]}
                        readOnly
                        className="h-5 w-5 accent-cyan-500"
                      />
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-white/25 bg-white/10 p-3 text-sm text-white/90">
                Choose <strong>any 1</strong> or <strong>maximum 2</strong> options.
                {selectedCount > 0 && (
                  <span className="ml-2 font-semibold text-cyan-200">
                    Selected: {selectedCount}
                  </span>
                )}
              </div>

              {error && (
                <p className="mt-4 rounded-lg border border-rose-300/60 bg-rose-500/25 px-4 py-2 text-sm text-white">
                  {error}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  disabled={isInvalidSelection}
                  onClick={generateAdvice}
                  className={`rounded-xl px-6 py-2 font-semibold text-white shadow-lg transition ${
                    isInvalidSelection
                      ? "cursor-not-allowed bg-slate-500/80"
                      : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  }`}
                >
                  {loading ? "Generating..." : "Generate Advice"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setOptions({ skin: false, hair: false, body: false, all: false })
                  }
                  className="rounded-xl border border-white/40 bg-white/10 px-4 py-2 font-semibold text-white transition hover:bg-white/20"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Media({ src, label, compact = false }) {
  const className = compact
    ? "h-28 w-full object-cover"
    : "h-56 w-full object-cover";

  if (src.endsWith(".mp4")) {
    return (
      <video autoPlay loop muted playsInline className={className}>
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  return <img src={src} alt={label} className={className} />;
}
