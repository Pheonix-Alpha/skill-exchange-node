"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import axios from "@/lib/axios";

export default function SessionPage() {
  const [acceptedExchanges, setAcceptedExchanges] = useState([]);
  const [sessions, setSessions] = useState([]); // renamed to include all sessions
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [dateTime, setDateTime] = useState("");
  const [sending, setSending] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Get current user ID
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUserId(user.id || user._id);
    }
  }, []);

  // Fetch accepted exchanges and all sessions
  const fetchData = async () => {
    if (!currentUserId) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const [exchangeRes, sessionRes] = await Promise.all([
        axios.get("/exchange/my-requests", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/session/my", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const accepted = exchangeRes.data.filter(r => r.status === "accepted");
      setAcceptedExchanges(accepted);

      setSessions(sessionRes.data); // store all sessions
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

  // Open modal to propose session
  const handleSetSession = (exchange) => {
    setSelectedExchange(exchange);
    setModalOpen(true);
  };

  // Submit new session
  const handleSubmitSession = async () => {
    if (!dateTime) return alert("Select date & time");
    try {
      setSending(true);
      const token = localStorage.getItem("token");
      await axios.post("/session/create", { exchangeId: selectedExchange._id, dateTime }, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  // Accept session (for received sessions)
  const handleAcceptSession = async (sessionId) => {
    try {
      setUpdatingId(sessionId);
      const token = localStorage.getItem("token");
      await axios.put(`/session/${sessionId}`, { status: "confirmed" }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-6">Sessions</h1>

        {/* Section 1: Create Session from accepted exchanges */}
        <h2 className="text-xl font-semibold mb-4">Create Session</h2>
        {loading ? <p>Loading...</p> : acceptedExchanges.length === 0 ? (
          <p className="text-gray-500">No accepted exchanges to propose sessions.</p>
        ) : (
          <ul className="space-y-4 mb-8">
            {acceptedExchanges.map(exchange => {
              const session = sessions.find(s => s.request._id === exchange._id);

              let buttonText = "Set Session";
              let disabled = false;
              let zoomLink = null;

              if (session) {
                if (session.status === "pending") {
                  buttonText = session.proposer._id === currentUserId ? "Requested" : "Pending";
                  disabled = true;
                } else if (session.status === "confirmed") {
                  buttonText = "Join Zoom";
                  disabled = false;
                  zoomLink = session.zoomLink;
                } else if (session.status === "rejected") {
                  buttonText = "Rejected";
                  disabled = true;
                }
              }

              return (
                <li key={exchange._id} className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{exchange.recipient.name}</p>
                    <p className="text-sm text-gray-500">
                      Wants: {exchange.skillWanted} | Offered: {exchange.skillOffered}
                    </p>
                  </div>
                  {zoomLink ? (
                    <a href={zoomLink} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700">
                      Join Zoom
                    </a>
                  ) : (
                    <button
                      onClick={() => handleSetSession(exchange)}
                      disabled={disabled}
                      className={`px-3 py-1 rounded ${disabled ? "bg-gray-400 text-white cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                    >
                      {buttonText}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* Section 2: Received session requests */}
        <h2 className="text-xl font-semibold mb-4">Received Session Requests</h2>
        {loading ? <p>Loading...</p> : sessions.filter(s => s.recipient._id === currentUserId).length === 0 ? (
          <p className="text-gray-500">No session requests.</p>
        ) : (
          <ul className="space-y-4">
            {sessions.filter(s => s.recipient._id === currentUserId).map(session => {
              const sessionTime = new Date(session.dateTime);
              const now = new Date();
              const canJoin = session.status === "confirmed" && session.zoomLink && now >= sessionTime;

              return (
                <li key={session._id} className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{session.proposer.name}</p>
                    <p className="text-sm text-gray-500">
                      Scheduled for: {sessionTime.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">Status: {session.status}</p>
                  </div>
                  <div className="flex gap-2">
                    {session.status === "pending" && (
                      <button
                        onClick={() => handleAcceptSession(session._id)}
                        disabled={updatingId === session._id}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        {updatingId === session._id ? "Confirming..." : "Accept"}
                      </button>
                    )}
                    {canJoin && (
                      <a href={session.zoomLink} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700">
                        Join Zoom
                      </a>
                    )}
                    {session.status === "rejected" && (
                      <span className="px-3 py-1 bg-red-600 text-white rounded">Rejected</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-80">
              <h2 className="text-lg font-semibold mb-4">Set Session</h2>
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="border p-2 rounded w-full mb-4"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setModalOpen(false)} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                <button onClick={handleSubmitSession} disabled={sending} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
