"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import axios from "@/lib/axios";
import {
  Calendar,
  Video,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  X,
  Loader2,
  Users,
  Zap,
} from "lucide-react";

export default function SessionPage() {
  const [acceptedExchanges, setAcceptedExchanges] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [dateTime, setDateTime] = useState("");
  const [sending, setSending] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUserId(user.id || user._id);
    }
  }, []);

  const fetchData = async () => {
    if (!currentUserId) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const [exchangeRes, sessionRes] = await Promise.all([
        axios.get("/exchange/my-requests", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/session/my", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setAcceptedExchanges(exchangeRes.data.filter((r) => r.status === "accepted"));
      setSessions(sessionRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [currentUserId]);

  const handleSetSession = (exchange) => {
    setSelectedExchange(exchange);
    setModalOpen(true);
  };

  const handleSubmitSession = async () => {
    if (!dateTime) return alert("Select date & time");
    try {
      setSending(true);
      const token = localStorage.getItem("token");
      await axios.post(
        "/session/create",
        { exchangeId: selectedExchange._id, dateTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalOpen(false);
      setDateTime("");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to create session");
    } finally {
      setSending(false);
    }
  };

  const handleAcceptSession = async (sessionId) => {
    try {
      setUpdatingId(sessionId);
      const token = localStorage.getItem("token");
      await axios.put(
        `/session/${sessionId}`,
        { status: "confirmed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      console.error(err);
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
  const getAvatarColor = (name = "") =>
    avatarColors[name.charCodeAt(0) % avatarColors.length];

  const receivedSessions = sessions.filter(
    (s) => s.recipient._id === currentUserId
  );

  return (
    <Layout>
      <div
        className="min-h-screen px-4 sm:px-6 py-10 max-w-3xl mx-auto"
        style={{ background: "#F8FAFC" }}
      >
        {/* ── Header ── */}
        <div className="mb-10">
          <span
            className="inline-block text-xs font-bold uppercase tracking-[0.18em] mb-3 px-3 py-1 rounded-full"
            style={{ background: "#F5F3FF", color: "#7C3AED", border: "1px solid #DDD6FE" }}
          >
            Sessions
          </span>
          <h1 className="text-4xl font-black" style={{ color: "#0F172A" }}>
            Skill Sessions
          </h1>
          <p className="text-sm mt-1" style={{ color: "#64748B" }}>
            Schedule and manage your skill exchange sessions.
          </p>
        </div>

        {/* ── Section 1: Create Session ── */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <Calendar size={15} style={{ color: "#7C3AED" }} />
            <h2
              className="text-xs font-black uppercase tracking-widest"
              style={{ color: "#64748B" }}
            >
              Schedule a Session
            </h2>
            {!loading && acceptedExchanges.length > 0 && (
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: "#F5F3FF", border: "1px solid #DDD6FE", color: "#7C3AED" }}
              >
                {acceptedExchanges.length}
              </span>
            )}
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : acceptedExchanges.length === 0 ? (
            <EmptyState
              icon={<Calendar size={22} style={{ color: "#CBD5E1" }} />}
              title="No accepted exchanges"
              desc="Accept skill exchange requests to schedule sessions."
            />
          ) : (
            <ul className="flex flex-col gap-3">
              {acceptedExchanges.map((exchange) => {
                const session = sessions.find(
                  (s) => s.request._id === exchange._id
                );
                const av = getAvatarColor(exchange.recipient?.name || "");

                let state = "idle"; // idle | requested | confirmed | rejected
                let zoomLink = null;

                if (session) {
                  if (session.status === "pending") state = "requested";
                  else if (session.status === "confirmed") {
                    state = "confirmed";
                    zoomLink = session.zoomLink;
                  } else if (session.status === "rejected") state = "rejected";
                }

                return (
                  <li
                    key={exchange._id}
                    className="rounded-2xl p-5 flex items-center justify-between gap-4 transition-shadow hover:shadow-md"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                        style={{ background: av.bg, color: av.text }}
                      >
                        {exchange.recipient?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate" style={{ color: "#0F172A" }}>
                          {exchange.recipient?.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <SkillTag icon={<Zap size={10} />} label={exchange.skillOffered} color="#059669" bg="#ECFDF5" border="#A7F3D0" />
                          <span style={{ color: "#CBD5E1", fontSize: 10 }}>↔</span>
                          <SkillTag icon={<Zap size={10} />} label={exchange.skillWanted} color="#7C3AED" bg="#F5F3FF" border="#DDD6FE" />
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {state === "idle" && (
                        <button
                          onClick={() => handleSetSession(exchange)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                          style={{
                            background: "#7C3AED",
                            boxShadow: "0 2px 8px rgba(124,58,237,0.25)",
                          }}
                        >
                          <Plus size={14} />
                          Schedule
                        </button>
                      )}
                      {state === "requested" && (
                        <StatusBadge
                          icon={<Clock size={12} />}
                          label={session.proposer._id === currentUserId ? "Requested" : "Pending"}
                          bg="#FFFBEB" color="#B45309" border="#FDE68A"
                        />
                      )}
                      {state === "confirmed" && zoomLink && (
                        <a
                          href={zoomLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                          style={{
                            background: "#7C3AED",
                            boxShadow: "0 2px 8px rgba(124,58,237,0.25)",
                          }}
                        >
                          <Video size={14} />
                          Join Zoom
                        </a>
                      )}
                      {state === "rejected" && (
                        <StatusBadge
                          icon={<XCircle size={12} />}
                          label="Rejected"
                          bg="#FFF1F2" color="#BE123C" border="#FECDD3"
                        />
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* ── Section 2: Received Requests ── */}
        <section className="mb-20">
          <div className="flex items-center gap-2 mb-5">
            <Users size={15} style={{ color: "#2563EB" }} />
            <h2
              className="text-xs font-black uppercase tracking-widest"
              style={{ color: "#64748B" }}
            >
              Received Requests
            </h2>
            {!loading && receivedSessions.length > 0 && (
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", color: "#2563EB" }}
              >
                {receivedSessions.length}
              </span>
            )}
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : receivedSessions.length === 0 ? (
            <EmptyState
              icon={<Users size={22} style={{ color: "#CBD5E1" }} />}
              title="No incoming requests"
              desc="When someone proposes a session with you, it will appear here."
            />
          ) : (
            <ul className="flex flex-col gap-3">
              {receivedSessions.map((session) => {
                const sessionTime = new Date(session.dateTime);
                const now = new Date();
                const canJoin =
                  session.status === "confirmed" &&
                  session.zoomLink &&
                  now >= sessionTime;
                const av = getAvatarColor(session.proposer?.name || "");

                return (
                  <li
                    key={session._id}
                    className="rounded-2xl p-5 flex items-center justify-between gap-4 transition-shadow hover:shadow-md"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                        style={{ background: av.bg, color: av.text }}
                      >
                        {session.proposer?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate" style={{ color: "#0F172A" }}>
                          {session.proposer?.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Clock size={11} style={{ color: "#94A3B8" }} />
                          <p className="text-xs" style={{ color: "#64748B" }}>
                            {sessionTime.toLocaleString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="mt-1">
                          {session.status === "pending" && (
                            <StatusBadge icon={<Clock size={10} />} label="Awaiting confirmation" bg="#FFFBEB" color="#B45309" border="#FDE68A" />
                          )}
                          {session.status === "confirmed" && (
                            <StatusBadge icon={<CheckCircle size={10} />} label="Confirmed" bg="#ECFDF5" color="#047857" border="#A7F3D0" />
                          )}
                          {session.status === "rejected" && (
                            <StatusBadge icon={<XCircle size={10} />} label="Rejected" bg="#FFF1F2" color="#BE123C" border="#FECDD3" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      {session.status === "pending" && (
                        <button
                          onClick={() => handleAcceptSession(session._id)}
                          disabled={updatingId === session._id}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
                          style={{
                            background: "#059669",
                            boxShadow: "0 2px 8px rgba(5,150,105,0.2)",
                          }}
                        >
                          {updatingId === session._id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <CheckCircle size={14} />
                          )}
                          {updatingId === session._id ? "Confirming…" : "Accept"}
                        </button>
                      )}
                      {canJoin && (
                        <a
                          href={session.zoomLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                          style={{
                            background: "#7C3AED",
                            boxShadow: "0 2px 8px rgba(124,58,237,0.25)",
                          }}
                        >
                          <Video size={14} />
                          Join Zoom
                        </a>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* ── Modal ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(15,23,42,0.4)", backdropFilter: "blur(4px)" }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-black text-lg" style={{ color: "#0F172A" }}>
                  Schedule Session
                </h2>
                {selectedExchange && (
                  <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
                    with {selectedExchange.recipient?.name}
                  </p>
                )}
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-slate-100"
              >
                <X size={16} style={{ color: "#64748B" }} />
              </button>
            </div>

            {/* Date input */}
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-widest" style={{ color: "#94A3B8" }}>
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-5"
              style={{
                background: "#F8FAFC",
                border: "1.5px solid #E2E8F0",
                color: "#0F172A",
              }}
            />

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{ background: "#F1F5F9", color: "#64748B", border: "1px solid #E2E8F0" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitSession}
                disabled={sending}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
                style={{
                  background: "#7C3AED",
                  boxShadow: "0 2px 8px rgba(124,58,237,0.25)",
                }}
              >
                {sending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Calendar size={14} />
                )}
                {sending ? "Sending…" : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

/* ── Helpers ── */

function SkillTag({ icon, label, color, bg, border }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold"
      style={{ background: bg, color, border: `1px solid ${border}` }}
    >
      {icon}
      {label}
    </span>
  );
}

function StatusBadge({ icon, label, bg, color, border }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold"
      style={{ background: bg, color, border: `1px solid ${border}` }}
    >
      {icon}
      {label}
    </span>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array(2).fill(0).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl p-5 animate-pulse"
          style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100" />
            <div className="space-y-2">
              <div className="w-28 h-3 bg-slate-100 rounded-full" />
              <div className="w-40 h-2.5 bg-slate-100 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ icon, title, desc }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-14 text-center rounded-2xl"
      style={{ background: "#FFFFFF", border: "1.5px dashed #E2E8F0" }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
      >
        {icon}
      </div>
      <h3 className="font-bold text-sm" style={{ color: "#0F172A" }}>{title}</h3>
      <p className="text-xs mt-1 max-w-xs" style={{ color: "#94A3B8" }}>{desc}</p>
    </div>
  );
}