"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import api from "@/lib/axios";
import { useChat } from "@/hooks/useChat";
import { ArrowLeft } from "lucide-react";

export default function MessagePage() {
  const [friends, setFriends] = useState([]);
  const [activeFriend, setActiveFriend] = useState(null);
  const [msg, setMsg] = useState("");
  const [username, setUsername] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true); // Mobile sidebar toggle

  // Set logged-in username
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      setUsername(userObj._id);
    }
  }, []);

  // Fetch accepted friends and remove duplicates
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

  const { messages, sendMessage, messagesEndRef } = useChat(
    username,
    activeFriend
  );

  // Mobile back button
  const handleBack = () => {
    setActiveFriend(null);
    setSidebarOpen(true);
  };

  return (
    <Layout>
      <div className="flex h-screen font-sans">

        {/* Sidebar: Friends List */}
        {(sidebarOpen || !activeFriend || window.innerWidth >= 640) && (
          <div
            className={`
              fixed top-15 left-0 z-40 h-full bg-white border-r flex flex-col p-2.5
              transition-transform w-full sm:w-64
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
            `}
          >
            <div className="p-4 font-bold text-center border-b">Messaging</div>
            <input
              type="text"
              className="border p-2 w-full mb-4 rounded bg-gray-100"
              placeholder="Search"
            />
            <ul className="flex-1 overflow-y-auto divide-y divide-gray-200">
              {friends.map((f) => (
                <li
                  key={f._id}
                  onClick={() => {
                    setActiveFriend(f);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 p-2 cursor-pointer rounded hover:bg-blue-100 ${
                    activeFriend?._id === f._id ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                    {f.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{f.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Chat Area */}
        {activeFriend && (
          <div className="flex flex-col flex-1 bg-gray-100 w-full sm:ml-64 transition-all">

            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50 font-bold flex items-center gap-3 sticky top-0 z-10">
              {/* Mobile back button */}
              <button
                className="sm:hidden flex items-center gap-1"
                onClick={handleBack}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Friend info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                  {activeFriend.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium">{activeFriend.name}</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-xs px-4 py-2 rounded-xl ${
                    m.sender === username
                      ? "bg-green-200 self-end"
                      : "bg-white self-start border border-gray-200"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex items-center p-3 border-t border-gray-200 bg-white sticky bottom-0">
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Type a message..."
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(msg)}
              />
              <button
                onClick={() => {
                  sendMessage(msg);
                  setMsg("");
                }}
                className="ml-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Send
              </button>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}
