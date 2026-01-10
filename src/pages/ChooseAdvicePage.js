import React, { useState } from "react";
import axios from "axios";

export default function ChooseAdvicePage() {
  const [skin, setSkin] = useState(false);
  const [hair, setHair] = useState(false);
  const [body, setBody] = useState(false);
  const [results, setResults] = useState(null);

  const token = localStorage.getItem("promptpal_token");
  const userId = localStorage.getItem("promptpal_userId");

  const handleGenerate = async () => {
    if (!skin && !hair && !body) {
      alert("Please select at least one option.");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:8080/api/wellness/multi-advice/${userId}`,
        { skin, hair, body },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResults(res.data);
    } catch (err) {
      console.error(err);
      alert("Error generating advice.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-10 flex justify-center">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8">

        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Choose Your Wellness Advice
        </h2>

        {/* Checkboxes */}
        <div className="space-y-4 text-lg">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={skin}
              onChange={() => setSkin(!skin)}
            />
            <span>Skin Wellness Advice</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={hair}
              onChange={() => setHair(!hair)}
            />
            <span>Hair Wellness Advice</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={body}
              onChange={() => setBody(!body)}
            />
            <span>Body Wellness Advice</span>
          </label>
        </div>

        {/* Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleGenerate}
            className="bg-indigo-600 text-white px-6 py-3 text-lg rounded-xl shadow hover:bg-indigo-700 transition"
          >
            Generate AI Advice
          </button>
        </div>

        {/* Display Results */}
        {results && (
          <div className="mt-8 space-y-6">
            {results.skin && (
              <div className="p-5 bg-purple-50 border-l-4 border-purple-700 rounded-lg">
                <h3 className="font-bold text-purple-700">Skin Advice</h3>
                <p>{results.skin}</p>
              </div>
            )}

            {results.hair && (
              <div className="p-5 bg-blue-50 border-l-4 border-blue-700 rounded-lg">
                <h3 className="font-bold text-blue-700">Hair Advice</h3>
                <p>{results.hair}</p>
              </div>
            )}

            {results.body && (
              <div className="p-5 bg-green-50 border-l-4 border-green-700 rounded-lg">
                <h3 className="font-bold text-green-700">Body Advice</h3>
                <p>{results.body}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
