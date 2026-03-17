"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import Layout from "@/components/Layout";
import { Inbox, Check, X, Clock, ArrowRightLeft } from "lucide-react";

export default function InboxPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (!token || !storedUser) return;

        const currentUser = JSON.parse(storedUser);
        const currentUserId = currentUser.id || currentUser._id;

        const res = await axios.get("/exchange/my-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userRequests = res.data.filter(
          (r) =>
            r.recipient?._id?.toString() === currentUserId.toString() ||
            r.requester?._id?.toString() === currentUserId.toString()
        );

        setRequests(userRequests);
      } catch (err) {
        console.error("Failed to fetch requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem("token");
      await axios.put(`/exchange/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    } catch (err) {
      console.error("Failed to update request:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const avatarColors = [
    { bg: "#EFF6FF", text: "#2563EB" },
    { bg: "#ECFDF5", text: "#059669" },
    { bg: "#F5F3FF", text: "#7C3AED" },
    { bg: "#FFFBEB", text: "#D97706" },
    { bg: "#FFF1F2", text: "#E11D48" },
  ];
  const getAvatarColor = (name = "") => {
    const idx = (name.charCodeAt(0) || 0) % avatarColors.length;
    return avatarColors[idx];
  };

  const pending = requests.filter((r) => r.status === "pending");
  const others = requests.filter((r) => r.status !== "pending");

  return (
    <Layout>
      <div
        className="min-h-screen px-4 sm:px-6 py-10 max-w-3xl mx-auto"
        style={{ background: "#F8FAFC" }}
      >
        {/* Header */}
        <div className="mb-10">
          <span
            className="inline-block text-xs font-bold uppercase tracking-[0.18em] mb-3 px-3 py-1 rounded-full"
            style={{ background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE" }}
          >
            Inbox
          </span>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black" style={{ color: "#0F172A" }}>
              Skill Requests
            </h1>
            {!loading && pending.length > 0 && (
              <span
                className="px-2.5 py-1 rounded-full text-sm font-bold"
                style={{ background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE" }}
              >
                {pending.length} pending
              </span>
            )}
          </div>
          <p className="text-sm mt-2" style={{ color: "#64748B" }}>
            Manage incoming and outgoing skill exchange requests.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl p-5 animate-pulse"
                style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="w-32 h-3.5 bg-slate-100 rounded-full" />
                    <div className="w-48 h-2.5 bg-slate-100 rounded-full" />
                  </div>
                  <div className="w-24 h-9 rounded-xl bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && requests.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-20 text-center rounded-2xl"
            style={{ background: "#FFFFFF", border: "1.5px dashed #E2E8F0" }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}
            >
              <Inbox size={22} style={{ color: "#2563EB" }} />
            </div>
            <h3 className="font-bold text-base mb-1" style={{ color: "#0F172A" }}>
              No requests yet
            </h3>
            <p className="text-sm max-w-xs" style={{ color: "#94A3B8" }}>
              When someone sends you a skill exchange request, it will appear here.
            </p>
          </div>
        )}

        {/* Pending Requests */}
        {!loading && pending.length > 0 && (
          <section className="mb-8">
            <p
              className="text-[11px] font-bold uppercase tracking-widest mb-3"
              style={{ color: "#94A3B8" }}
            >
              Pending
            </p>
            <div className="space-y-3">
              {pending.map((req) => {
                const currentUserId =
                  JSON.parse(localStorage.getItem("user")).id ||
                  JSON.parse(localStorage.getItem("user"))._id;
                const isRecipient =
                  req.recipient._id.toString() === currentUserId.toString();
                const otherUser = isRecipient ? req.requester : req.recipient;
                const av = getAvatarColor(otherUser?.name);
                const isUpdating = updatingId === req._id;

                return (
                  <div
                    key={req._id}
                    className="rounded-2xl p-5 transition-shadow hover:shadow-md"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                        style={{ background: av.bg, color: av.text }}
                      >
                        {otherUser?.name?.charAt(0).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm" style={{ color: "#0F172A" }}>
                          {otherUser?.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span
                            className="text-xs px-2 py-0.5 rounded-lg font-medium"
                            style={{ background: "#ECFDF5", color: "#059669" }}
                          >
                            Offers: {req.skillOffered}
                          </span>
                          <ArrowRightLeft size={10} style={{ color: "#CBD5E1" }} />
                          <span
                            className="text-xs px-2 py-0.5 rounded-lg font-medium"
                            style={{ background: "#EFF6FF", color: "#2563EB" }}
                          >
                            Wants: {req.skillWanted}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      {isRecipient ? (
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleUpdateStatus(req._id, "accepted")}
                            disabled={isUpdating}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                            style={{
                              background: isUpdating ? "#D1FAE5" : "#ECFDF5",
                              color: "#059669",
                              border: "1px solid #A7F3D0",
                            }}
                            onMouseEnter={(e) =>
                              !isUpdating &&
                              (e.currentTarget.style.background = "#D1FAE5")
                            }
                            onMouseLeave={(e) =>
                              !isUpdating &&
                              (e.currentTarget.style.background = "#ECFDF5")
                            }
                          >
                            {isUpdating ? (
                              <span className="w-3.5 h-3.5 border-2 border-green-300 border-t-green-600 rounded-full animate-spin" />
                            ) : (
                              <Check size={14} />
                            )}
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(req._id, "rejected")}
                            disabled={isUpdating}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                            style={{
                              background: "#FFF1F2",
                              color: "#E11D48",
                              border: "1px solid #FECDD3",
                            }}
                            onMouseEnter={(e) =>
                              !isUpdating &&
                              (e.currentTarget.style.background = "#FFE4E6")
                            }
                            onMouseLeave={(e) =>
                              !isUpdating &&
                              (e.currentTarget.style.background = "#FFF1F2")
                            }
                          >
                            <X size={14} />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="flex-shrink-0">
                          <span
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                            style={{
                              background: "#FFFBEB",
                              color: "#D97706",
                              border: "1px solid #FDE68A",
                            }}
                          >
                            <Clock size={11} />
                            Awaiting reply
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Past Requests */}
        {!loading && others.length > 0 && (
          <section>
            <p
              className="text-[11px] font-bold uppercase tracking-widest mb-3"
              style={{ color: "#94A3B8" }}
            >
              Past requests
            </p>
            <div className="space-y-3">
              {others.map((req) => {
                const currentUserId =
                  JSON.parse(localStorage.getItem("user")).id ||
                  JSON.parse(localStorage.getItem("user"))._id;
                const isRecipient =
                  req.recipient._id.toString() === currentUserId.toString();
                const otherUser = isRecipient ? req.requester : req.recipient;
                const av = getAvatarColor(otherUser?.name);
                const accepted = req.status === "accepted";

                return (
                  <div
                    key={req._id}
                    className="rounded-2xl p-5"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                      opacity: 0.85,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                        style={{ background: av.bg, color: av.text }}
                      >
                        {otherUser?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm" style={{ color: "#0F172A" }}>
                          {otherUser?.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span
                            className="text-xs px-2 py-0.5 rounded-lg font-medium"
                            style={{ background: "#F8FAFC", color: "#64748B" }}
                          >
                            Offers: {req.skillOffered}
                          </span>
                          <ArrowRightLeft size={10} style={{ color: "#CBD5E1" }} />
                          <span
                            className="text-xs px-2 py-0.5 rounded-lg font-medium"
                            style={{ background: "#F8FAFC", color: "#64748B" }}
                          >
                            Wants: {req.skillWanted}
                          </span>
                        </div>
                      </div>
                      <span
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold flex-shrink-0"
                        style={
                          accepted
                            ? { background: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0" }
                            : { background: "#FFF1F2", color: "#E11D48", border: "1px solid #FECDD3" }
                        }
                      >
                        {accepted ? <Check size={11} /> : <X size={11} />}
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}