"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import api from "@/lib/axios";
import { useChat } from "@/hooks/useChat";
import { ArrowLeft, Search, Send, MessageSquare } from "lucide-react";

export default function MessagePage() {
  const [friends, setFriends] = useState([]);
  const [activeFriend, setActiveFriend] = useState(null);
  const [msg, setMsg] = useState("");
  const [username, setUsername] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      setUsername(userObj._id);
    }
  }, []);

  useEffect(() => {
    if (!username) return;
    const fetchAccepted = async () => {
      try {
        const res = await api.get("/exchange/my-accepted-requests");
        const uniqueFriends = Array.from(
          new Map(res.data.map((f) => [f._id, f])).values()
        );
        setFriends(uniqueFriends);
        if (uniqueFriends.length > 0) setActiveFriend(uniqueFriends[0]);
      } catch (err) {
        console.error("Failed to fetch accepted users:", err);
      }
    };
    fetchAccepted();
  }, [username]);

  const { messages, sendMessage, messagesEndRef } = useChat(username, activeFriend);

  const handleBack = () => {
    setActiveFriend(null);
    setSidebarOpen(true);
  };

  const handleSend = () => {
    if (!msg.trim()) return;
    sendMessage(msg);
    setMsg("");
  };

  const filteredFriends = friends.filter((f) =>
    f.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Avatar color palette based on first letter
  const avatarColors = [
    { bg: "#EFF6FF", text: "#2563EB" },
    { bg: "#ECFDF5", text: "#059669" },
    { bg: "#F5F3FF", text: "#7C3AED" },
    { bg: "#FFFBEB", text: "#D97706" },
    { bg: "#FFF1F2", text: "#E11D48" },
  ];
  const getAvatarColor = (name = "") => {
    const idx = name.charCodeAt(0) % avatarColors.length;
    return avatarColors[idx];
  };

  return (
    <Layout>
      <div
        className="flex h-screen overflow-hidden"
        style={{ background: "#F8FAFC", fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* ── Sidebar ── */}
        <div
          className={`
            flex-shrink-0 flex flex-col h-full border-r
            transition-all duration-300
            ${activeFriend ? "hidden sm:flex" : "flex"}
            w-full sm:w-72
          `}
          style={{ background: "#FFFFFF", borderColor: "#E2E8F0" }}
        >
          {/* Sidebar Header */}
          <div
            className="px-5 py-5 border-b"
            style={{ borderColor: "#E2E8F0" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={18} style={{ color: "#2563EB" }} />
              <h1 className="font-black text-lg" style={{ color: "#0F172A" }}>
                Messages
              </h1>
            </div>
            {/* Search */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0" }}
            >
              <Search size={13} style={{ color: "#CBD5E1", flexShrink: 0 }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: "#0F172A" }}
              />
            </div>
          </div>

          {/* Friends List */}
          <ul className="flex-1 overflow-y-auto py-2">
            {filteredFriends.length === 0 && (
              <li className="px-5 py-10 text-center">
                <p className="text-sm" style={{ color: "#94A3B8" }}>
                  No conversations yet
                </p>
              </li>
            )}
            {filteredFriends.map((f) => {
              const av = getAvatarColor(f.name);
              const isActive = activeFriend?._id === f._id;
              return (
                <li key={f._id}>
                  <button
                    onClick={() => {
                      setActiveFriend(f);
                      setSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                    style={{
                      background: isActive ? "#EFF6FF" : "transparent",
                      borderLeft: isActive
                        ? "3px solid #2563EB"
                        : "3px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        e.currentTarget.style.background = "#F8FAFC";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                      style={{ background: av.bg, color: av.text }}
                    >
                      {f.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p
                        className="text-sm font-semibold truncate"
                        style={{ color: isActive ? "#1D4ED8" : "#0F172A" }}
                      >
                        {f.name}
                      </p>
                      <p
                        className="text-xs truncate"
                        style={{ color: "#94A3B8" }}
                      >
                        Tap to chat
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Chat Area ── */}
        {activeFriend ? (
          <div className="flex flex-col flex-1 min-w-0 h-full">
            {/* Chat Header */}
            <div
              className="flex items-center gap-3 px-5 py-4 border-b flex-shrink-0"
              style={{
                background: "#FFFFFF",
                borderColor: "#E2E8F0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              {/* Mobile back */}
              <button
                className="sm:hidden p-1.5 rounded-lg transition-colors hover:bg-slate-100"
                onClick={handleBack}
              >
                <ArrowLeft size={18} style={{ color: "#64748B" }} />
              </button>

              {/* Friend info */}
              {(() => {
                const av = getAvatarColor(activeFriend.name);
                return (
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                    style={{ background: av.bg, color: av.text }}
                  >
                    {activeFriend.name?.charAt(0).toUpperCase()}
                  </div>
                );
              })()}
              <div>
                <p className="font-bold text-sm" style={{ color: "#0F172A" }}>
                  {activeFriend.name}
                </p>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#10B981" }}
                  />
                  <p className="text-xs" style={{ color: "#10B981" }}>
                    Online
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-3"
              style={{ background: "#F8FAFC" }}
            >
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center pb-10">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                    style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}
                  >
                    <MessageSquare size={22} style={{ color: "#2563EB" }} />
                  </div>
                  <p className="font-bold text-sm" style={{ color: "#0F172A" }}>
                    Start the conversation
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>
                    Say hello to {activeFriend.name}!
                  </p>
                </div>
              )}

              {messages.map((m, i) => {
                const isMine = m.sender === username;
                const av = getAvatarColor(activeFriend.name);

                // Group messages — show avatar only on last in a sequence
                const prevSame = i > 0 && messages[i - 1].sender === m.sender;
                const nextSame =
                  i < messages.length - 1 &&
                  messages[i + 1].sender === m.sender;

                return (
                  <div
                    key={i}
                    className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}
                    style={{ marginBottom: nextSame ? "2px" : "8px" }}
                  >
                    {/* Avatar */}
                    {!isMine && (
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
                        style={{
                          background: nextSame ? "transparent" : av.bg,
                          color: av.text,
                          visibility: nextSame ? "hidden" : "visible",
                        }}
                      >
                        {activeFriend.name?.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Bubble */}
                    <div
                      className="px-4 py-2.5 text-sm max-w-sm"
                      style={{
                        background: isMine ? "#2563EB" : "#FFFFFF",
                        color: isMine ? "#FFFFFF" : "#0F172A",
                        borderRadius: isMine
                          ? prevSame
                            ? "18px 6px 6px 18px"
                            : "18px 6px 18px 18px"
                          : prevSame
                          ? "6px 18px 18px 6px"
                          : "6px 18px 18px 18px",
                        boxShadow: isMine
                          ? "0 2px 8px rgba(37,99,235,0.25)"
                          : "0 1px 3px rgba(0,0,0,0.06)",
                        border: isMine ? "none" : "1px solid #E2E8F0",
                        lineHeight: "1.5",
                      }}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div
              className="px-4 py-3 border-t flex items-center gap-3 flex-shrink-0"
              style={{ background: "#FFFFFF", borderColor: "#E2E8F0" }}
            >
              <div
                className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all"
                style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0" }}
              >
                <input
                  type="text"
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: "#0F172A" }}
                  placeholder="Write a message..."
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!msg.trim()}
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background: msg.trim() ? "#2563EB" : "#E2E8F0",
                  boxShadow: msg.trim()
                    ? "0 2px 8px rgba(37,99,235,0.25)"
                    : "none",
                }}
              >
                <Send
                  size={16}
                  style={{ color: msg.trim() ? "#FFFFFF" : "#94A3B8" }}
                />
              </button>
            </div>
          </div>
        ) : (
          /* No chat selected (desktop empty state) */
          <div
            className="hidden sm:flex flex-1 items-center justify-center flex-col gap-3"
            style={{ background: "#F8FAFC" }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}
            >
              <MessageSquare size={26} style={{ color: "#2563EB" }} />
            </div>
            <p className="font-bold text-base" style={{ color: "#0F172A" }}>
              Select a conversation
            </p>
            <p className="text-sm" style={{ color: "#94A3B8" }}>
              Choose a friend from the left to start chatting
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}