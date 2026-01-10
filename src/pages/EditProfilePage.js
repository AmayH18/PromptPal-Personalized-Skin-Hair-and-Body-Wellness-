import React, { useState, useEffect } from "react";
import axios from "axios";

export default function EditProfilePage() {
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [skinType, setSkinType] = useState("");
  const [hairType, setHairType] = useState("");
  const [bodyGoal, setBodyGoal] = useState("");
  const [allergies, setAllergies] = useState("");
  const [dailyRoutine, setDailyRoutine] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("promptpal_token");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const u = res.data;

        setPhone(u.phone || "");
        setAge(u.age || "");
        setHeight(u.height || "");
        setWeight(u.weight || "");
        setSkinType(u.skinType || "");
        setHairType(u.hairType || "");
        setBodyGoal(u.bodyGoal || "");
        setAllergies(u.allergies || "");
        setDailyRoutine(u.dailyRoutine || "");
      } catch (err) {
        console.error("Error loading profile:", err);
        setMessage("Failed to load profile.");
      }
    };

    loadProfile();
  }, [token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!phone || phone.length < 10) return setMessage("Enter a valid phone number.");
    if (age < 10 || age > 100) return setMessage("Enter a valid age.");
    if (height < 50 || height > 250) return setMessage("Enter valid height.");
    if (weight < 20 || weight > 300) return setMessage("Enter valid weight.");

    try {
      await axios.put(
        "http://localhost:8080/api/auth/update-profile",
        {
          phone,
          age,
          height,
          weight,
          skinType,
          hairType,
          bodyGoal,
          allergies,
          dailyRoutine,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-5 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-4">
        Edit Profile
      </h2>

      {message && (
        <p className="text-center text-red-600 font-semibold mb-3">{message}</p>
      )}

      <form onSubmit={handleUpdate} className="space-y-4">

        {/* PHONE */}
        <label className="font-semibold">Phone Number:</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        {/* AGE */}
        <label className="font-semibold">Age:</label>
        <input
          type="number"
          className="w-full border rounded p-2"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />

        {/* HEIGHT */}
        <label className="font-semibold">Height (cm):</label>
        <input
          type="number"
          className="w-full border rounded p-2"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          required
        />

        {/* WEIGHT */}
        <label className="font-semibold">Weight (kg):</label>
        <input
          type="number"
          className="w-full border rounded p-2"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />

        {/* SKIN TYPE */}
        <label className="font-semibold">Skin Type:</label>
        <select
          className="w-full border rounded p-2"
          value={skinType}
          onChange={(e) => setSkinType(e.target.value)}
          required
        >
          <option value="">Select Skin Type</option>
          <option value="OILY">Oily</option>
          <option value="DRY">Dry</option>
          <option value="NORMAL">Normal</option>
          <option value="COMBINATION">Combination</option>
        </select>

        {/* HAIR TYPE */}
        <label className="font-semibold">Hair Type:</label>
        <select
          className="w-full border rounded p-2"
          value={hairType}
          onChange={(e) => setHairType(e.target.value)}
          required
        >
          <option value="">Select Hair Type</option>
          <option value="STRAIGHT">Straight</option>
          <option value="WAVY">Wavy</option>
          <option value="CURLY">Curly</option>
          <option value="COILY">Coily</option>
        </select>

        {/* BODY GOAL */}
        <label className="font-semibold">Body Goal:</label>
        <select
          className="w-full border rounded p-2"
          value={bodyGoal}
          onChange={(e) => setBodyGoal(e.target.value)}
          required
        >
          <option value="">Select Body Goal</option>
          <option value="WEIGHT_LOSS">Weight Loss</option>
          <option value="WEIGHT_GAIN">Weight Gain</option>
          <option value="FITNESS">Fitness</option>
          <option value="MUSCLE_GAIN">Muscle Gain</option>
        </select>

        {/* ALLERGIES */}
        <label className="font-semibold">Allergies:</label>
        <textarea
          className="w-full border rounded p-2"
          placeholder="Enter any allergies"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
        />

        {/* DAILY ROUTINE */}
        <label className="font-semibold">Daily Routine (max 75 characters):</label>
        <textarea
          className="w-full border rounded p-2"
          maxLength={75}
          value={dailyRoutine}
          onChange={(e) => setDailyRoutine(e.target.value)}
        />
        <p className="text-sm text-gray-500 text-right">
          {dailyRoutine.length} / 75
        </p>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}
