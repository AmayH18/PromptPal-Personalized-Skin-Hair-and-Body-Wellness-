import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const WELLNESS_MEDIA = [
  {
    id: "skin",
    title: "Skin Glow Ritual",
    type: "video",
    src: "/skincare.mp4",
    caption: "Hydration, SPF, and barrier repair are the strongest daily foundation.",
  },
  {
    id: "hair",
    title: "Hair Strength Flow",
    type: "gif",
    src: "/haircare.gif",
    caption: "Consistency in scalp care and gentle routines beats one-time treatments.",
  },
  {
    id: "body",
    title: "Body Wellness Momentum",
    type: "gif",
    src: "/body.gif",
    caption: "Better sleep, movement, and nutrition together drive visible progress.",
  },
];

export default function PromptPalResultPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [expandedTip, setExpandedTip] = useState(0);
  const [copied, setCopied] = useState(false);
  const hasAdvice = Boolean(state && state.advice);
  const advice = hasAdvice ? state.advice : "";
  const accuracy = hasAdvice ? state.accuracy : 0;
  const confidence = Number.isFinite(accuracy) ? Math.max(0, Math.min(100, accuracy)) : 0;
  const media = WELLNESS_MEDIA[activeMediaIndex];

  const adviceBlocks = useMemo(() => {
    return String(advice)
      .split(/\n\s*\n/g)
      .map((part) => part.trim())
      .filter(Boolean);
  }, [advice]);

  const quickHighlights = useMemo(() => {
    const source = String(advice).toLowerCase();
    const highlights = [];

    if (source.includes("sleep")) highlights.push("Sleep consistency is a top lever.");
    if (source.includes("hydration") || source.includes("water")) highlights.push("Hydration is a foundational habit.");
    if (source.includes("protein") || source.includes("diet") || source.includes("nutrition")) highlights.push("Nutrition quality has direct score impact.");
    if (source.includes("exercise") || source.includes("workout") || source.includes("walk")) highlights.push("Movement routine should be sustainable.");

    if (highlights.length === 0) {
      highlights.push("Follow the daily plan consistently for best score improvement.");
      highlights.push("Track progress weekly and adjust habits gradually.");
    }

    return highlights.slice(0, 3);
  }, [advice]);

  // Safety check
  if (!hasAdvice) {
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
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="rounded-2xl border border-rose-300/60 bg-rose-500/25 px-6 py-4 text-lg text-white backdrop-blur-xl">
            No AI result found. Please generate advice again.
          </div>
        </div>
      </div>
    );
  }

  const copyAdvice = async () => {
    try {
      await navigator.clipboard.writeText(String(advice));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy advice", err);
    }
  };

  const showPrevMedia = () => {
    setActiveMediaIndex((prev) =>
      prev === 0 ? WELLNESS_MEDIA.length - 1 : prev - 1
    );
  };

  const showNextMedia = () => {
    setActiveMediaIndex((prev) =>
      prev === WELLNESS_MEDIA.length - 1 ? 0 : prev + 1
    );
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
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-fuchsia-300/25 blur-3xl" />

      <div className="relative z-10 min-h-screen px-4 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/35 bg-white/16 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 inline-flex rounded-full border border-white/35 bg-white/10 px-4 py-1 text-xs font-semibold tracking-wider text-white">
                CORE WELLNESS RESULT
              </p>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                PromptPal Personalized Action Blueprint
              </h1>
              <p className="mt-2 text-white/85">
                Interactive guidance generated from your selected wellness goals.
              </p>
            </div>
            <button
              onClick={copyAdvice}
              className="rounded-xl border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              {copied ? "Copied" : "Copy Full Advice"}
            </button>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/30 bg-white/10 p-5 text-white lg:col-span-1">
              <p className="text-sm text-white/80">AI Confidence Score</p>
              <p className="mt-1 text-4xl font-extrabold">{confidence.toFixed(1)}%</p>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-300 transition-all duration-700"
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-white/80">
                Higher confidence means stronger alignment with your profile inputs.
              </p>
            </div>

            <div className="rounded-2xl border border-white/30 bg-white/10 p-5 text-white lg:col-span-2">
              <p className="text-sm font-semibold text-white/90">Quick Highlights</p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {quickHighlights.map((item, index) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/30 bg-white/10 p-3 text-sm"
                  >
                    <span className="mr-2 font-bold text-cyan-200">0{index + 1}</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="rounded-2xl border border-white/30 bg-white/10 p-4 lg:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Wellness Motion</h2>
                <div className="flex gap-2">
                  <button
                    onClick={showPrevMedia}
                    className="rounded-lg border border-white/35 bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
                  >
                    Prev
                  </button>
                  <button
                    onClick={showNextMedia}
                    className="rounded-lg border border-white/35 bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-white/25">
                {media.type === "video" ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-56 w-full object-cover"
                  >
                    <source src={media.src} type="video/mp4" />
                  </video>
                ) : (
                  <img src={media.src} alt={media.title} className="h-56 w-full object-cover" />
                )}
              </div>

              <p className="mt-3 text-sm text-white/90">{media.title}</p>
              <p className="mt-1 text-xs text-white/75">{media.caption}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {WELLNESS_MEDIA.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      idx === activeMediaIndex
                        ? "bg-cyan-300 text-slate-900"
                        : "border border-white/35 bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/30 bg-white/10 p-4 lg:col-span-3">
              <h2 className="mb-3 text-lg font-bold text-white">Advice Explorer</h2>
              <div className="space-y-3">
                {adviceBlocks.map((block, index) => (
                  <div key={`advice-${index}`} className="rounded-xl border border-white/25 bg-white/10">
                    <button
                      type="button"
                      onClick={() => setExpandedTip(expandedTip === index ? -1 : index)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left"
                    >
                      <span className="text-sm font-semibold text-white">
                        Step {index + 1}
                      </span>
                      <span className="text-xs font-bold text-cyan-200">
                        {expandedTip === index ? "Hide" : "View"}
                      </span>
                    </button>
                    {expandedTip === index && (
                      <div className="border-t border-white/20 px-4 py-3 text-sm leading-relaxed text-white/90 whitespace-pre-line">
                        {block}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate("/promptpal")}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2 font-semibold text-white shadow-lg transition hover:from-cyan-600 hover:to-blue-700"
            >
              Generate Again
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2 font-semibold text-white shadow-lg transition hover:from-emerald-600 hover:to-teal-700"
            >
              Go To Dashboard
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-2 font-semibold text-white shadow-lg transition hover:from-slate-700 hover:to-slate-800"
            >
              Back To Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
