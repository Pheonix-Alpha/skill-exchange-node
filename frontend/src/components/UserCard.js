"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { ArrowLeftRight, X } from "lucide-react";

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
  const [currentUser, setCurrentUser] = useState(null);

  const requestKey = user?.id || user?._id;
  const isDisabled = disabledRequests.has(requestKey);

  // ✅ Safe localStorage access
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  }, []);

  const handleSendRequest = async () => {
    if (!skillOffered || !skillWanted) {
      setMessage("Please select both skills to continue.");
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("success");
      onRequestSent?.(requestKey);

      setTimeout(() => setModalOpen(false), 1200);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to send request. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="group bg-[#111118] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all hover:bg-[#14141e]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4F8EF7] flex items-center justify-center text-white text-sm font-black shrink-0">
              {user?.username?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h3 className="text-white font-semibold text-sm leading-none">
                {user?.username}
              </h3>
              <p className="text-white/30 text-xs mt-0.5">Skill exchanger</p>
            </div>
          </div>

          <button
            onClick={() => !isDisabled && setModalOpen(true)}
            disabled={isDisabled}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isDisabled
                ? "bg-white/5 text-white/20 cursor-not-allowed"
                : "bg-[#4F8EF7]/10 border border-[#4F8EF7]/20 text-[#4F8EF7] hover:bg-[#4F8EF7] hover:text-white"
            }`}
          >
            <ArrowLeftRight size={12} />
            {isDisabled ? "Sent" : "Exchange"}
          </button>
        </div>

        <div className="space-y-2.5">
          <div>
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mb-1.5">
              Offering
            </p>

            <div className="flex flex-wrap gap-1.5">
              {(user?.offeringSkills || []).slice(0, 3).map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mb-1.5">
              Wanting
            </p>

            <div className="flex flex-wrap gap-1.5">
              {(user?.wantingSkills || []).slice(0, 3).map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111118] border border-white/10 rounded-2xl w-full max-w-sm p-6 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
            >
              <X size={14} />
            </button>

            <h4 className="text-white font-bold text-base mb-1">
              Propose an exchange
            </h4>

            <p className="text-white/30 text-xs mb-5">
              with{" "}
              <span className="text-white/60 font-medium">
                {user?.username}
              </span>
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="text-white/30 text-[10px] font-bold uppercase tracking-widest block mb-1.5">
                  You will offer
                </label>

                <select
                  value={skillOffered}
                  onChange={(e) => setSkillOffered(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                >
                  <option value="">Select a skill</option>

                  {(currentUser?.skillsOffered || []).map((s, i) => (
                    <option key={i} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-center py-1">
                <ArrowLeftRight size={14} className="text-white/20" />
              </div>

              <div>
                <label className="text-white/30 text-[10px] font-bold uppercase tracking-widest block mb-1.5">
                  You will receive
                </label>

                <select
                  value={skillWanted}
                  onChange={(e) => setSkillWanted(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                >
                  <option value="">Select a skill</option>

                  {(user?.offeringSkills || []).map((s, i) => (
                    <option key={i} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {message === "success" ? (
              <div className="py-3 text-center text-emerald-400 text-sm font-semibold">
                ✓ Request sent successfully
              </div>
            ) : (
              <>
                {message && (
                  <p className="text-red-400 text-xs mb-3">{message}</p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/40 text-sm font-medium"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSendRequest}
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl bg-[#4F8EF7] text-white text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    {loading ? "Sending..." : "Send request"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}