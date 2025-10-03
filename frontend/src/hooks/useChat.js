"use client";
import { useEffect, useState,} from "react";
import { io } from "socket.io-client";

// Dynamic backend URL
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
const socket = io(SOCKET_URL, { withCredentials: true });

export const useChat = (username, activeFriend) => {
  const [messages, setMessages] = useState([]);
 



  // Join room and listen for messages
  useEffect(() => {
    if (!username || !activeFriend) return;

    const room = [username, activeFriend._id].sort().join("_");

    // Join the room
    socket.emit("joinRoom", { room });

    // Clear messages when switching friends
    setMessages([]);

    // Listen for previous messages
    const handlePreviousMessages = (msgs) => setMessages(msgs);

    // Listen for new messages and prevent duplicates
    const handleChatMessage = (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.timestamp === msg.timestamp && m.sender === msg.sender)) {
          return prev; // skip duplicate
        }
        return [...prev, msg];
      });
    };

    socket.on("previousMessages", handlePreviousMessages);
    socket.on("chatMessage", handleChatMessage);

    // Cleanup: leave room and remove listeners
    return () => {
      socket.emit("leaveRoom", { room });
      socket.off("previousMessages", handlePreviousMessages);
      socket.off("chatMessage", handleChatMessage);
    };
  }, [username, activeFriend]);

  // Send message function
  const sendMessage = (text) => {
    if (!text.trim() || !activeFriend) return;

    const room = [username, activeFriend._id].sort().join("_");
    const message = {
      sender: username,
      recipientId: activeFriend._id,
      text,
      timestamp: new Date().toISOString(),
    };

    // Send to server (server will broadcast back)
    socket.emit("chatMessage", { room, message });
  };

  return { messages, sendMessage };
};
