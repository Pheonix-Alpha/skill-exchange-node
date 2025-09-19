"use client";

import { useState } from "react";
 import api from "@/lib/axios"; 

export default function UserCard({ user, disabledRequests = new Set(), onRequestSent, isFromMatch = false }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [skillOffered, setSkillOffered] = useState("");
  const [skillWanted, setSkillWanted] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const requestKey = user.id || user._id;
  const isDisabled = disabledRequests.has(requestKey);
  const currentUser = JSON.parse(localStorage.getItem("user"));

 // import your Axios instance

const handleSendRequest = async () => {
  if (!skillOffered || !skillWanted) {
    setMessage("⚠️ Please select both skills");
    return;
  }

  try {
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");
    console.log("Sending request with:", {
      recipientId: requestKey,
      skillOffered,
      skillWanted,
      strict: isFromMatch,
      token,
    });

    const res = await api.post("/exchange/send", {
      recipientId: requestKey,
      skillOffered,
      skillWanted,
      strict: isFromMatch, // strict only for matches
    });

    console.log("Response from backend:", res.data);

    setMessage("✅ Request sent");
    onRequestSent?.(requestKey);
    setModalOpen(false);
  } catch (err) {
  if (err.response) {
    console.error("Server responded with error:", err.response.data);
    setMessage(err.response.data?.message || "❌ Failed to send request");
  } else if (err.request) {
    console.error("Request made but no response:", err.request);
    setMessage("❌ No response from server");
  } else {
    console.error("Error setting up request:", err.message);
    setMessage("❌ Error sending request");
  }
}
 finally {
    setLoading(false);
  }
};



  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 relative">
      <h3 className="text-lg font-semibold">{user.username}</h3>
      <p className="text-sm text-gray-600">{user.email}</p>

      <div className="mt-2">
        <strong>Offering:</strong> {user.offeringSkills.join(", ")}
      </div>
      <div>
        <strong>Wanting:</strong> {user.wantingSkills.join(", ")}
      </div>

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

      {modalOpen && !isDisabled && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 relative">
            <h4 className="text-lg font-semibold mb-4">Send Request</h4>

            <select
              value={skillOffered}
              onChange={(e) => setSkillOffered(e.target.value)}
              className="border p-2 rounded w-full mb-3"
              required
            >
              <option value="">Select skill to offer</option>
              {currentUser?.skillsOffered?.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={skillWanted}
              onChange={(e) => setSkillWanted(e.target.value)}
              className="border p-2 rounded w-full mb-3"
              required
            >
              <option value="">Select skill to request</option>
              {user.offeringSkills.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                disabled={loading}
                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>

            {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
