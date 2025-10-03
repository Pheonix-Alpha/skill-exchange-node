"use client";

import { useState } from "react";
import api from "@/lib/axios";

export default function UserCard({
  user,
  disabledRequests = new Set(),
  onRequestSent,
  isFromMatch = false,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [skillOffered, setSkillOffered] = useState("");
  const [skillWanted, setSkillWanted] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const requestKey = user.id || user._id;
  const isDisabled = disabledRequests.has(requestKey);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const handleSendRequest = async () => {
    if (!skillOffered || !skillWanted) {
      setMessage("⚠️ Please select both skills");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const token = localStorage.getItem("token");

      await api.post(
        "/exchange/send",
        {
          recipientId: requestKey,
          skillOffered,
          skillWanted,
          strict: isFromMatch,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ Request sent successfully!");
      onRequestSent?.(requestKey);
      setModalOpen(false);
    } catch (err) {
      if (err.response) setMessage(err.response.data?.message || "❌ Failed");
      else if (err.request) setMessage("❌ No response from server");
      else setMessage("❌ Error sending request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 relative w-full sm:w-80">
      {/* Avatar and User Info */}
      <div className="flex items-center mb-2">
        <div className="w-12 h-12 rounded-full bg-[#6358DC] text-white flex items-center justify-center text-lg font-bold mr-4">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <h3 className="text-lg font-semibold">{user.username}</h3>
      </div>

      <div className="text-sm mb-1">
        <strong>Offering:</strong> {user.offeringSkills.join(", ")}
      </div>
      <div className="text-sm">
        <strong>Wanting:</strong> {user.wantingSkills.join(", ")}
      </div>

      {/* Send Request Button */}
      <button
        onClick={() => setModalOpen(true)}
        className={`absolute top-4 right-4 px-3 py-1 rounded ${
          isDisabled
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
        disabled={isDisabled}
      >
        {isDisabled ? "Requested" : "Send"}
      </button>

      {/* Modal */}
      {modalOpen && !isDisabled && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm relative animate-slideIn">
            <h4 className="text-lg font-semibold mb-4">Send Request</h4>

            {/* Skill selection */}
            <select
              value={skillOffered}
              onChange={(e) => setSkillOffered(e.target.value)}
              className="border p-2 rounded w-full mb-3"
            >
              <option value="">Select skill to offer</option>
              {currentUser?.skillsOffered?.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={skillWanted}
              onChange={(e) => setSkillWanted(e.target.value)}
              className="border p-2 rounded w-full mb-3"
            >
              <option value="">Select skill to request</option>
              {user.offeringSkills.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                disabled={loading}
                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center"
              >
                {loading && (
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"></span>
                )}
                {loading ? "Sending..." : "Send"}
              </button>
            </div>

            {/* Message */}
            {message && (
              <p
                className={`mt-2 text-sm ${
                  message.includes("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
