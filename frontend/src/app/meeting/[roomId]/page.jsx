"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, MessageSquare } from "lucide-react";

export default function MeetingPage() {
  const { roomId } = useParams();
  const router = useRouter();
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name || "User");
    }
  }, []);

  useEffect(() => {
    if (!roomId || !iframeRef.current) return;

    const domain = "meet.jit.si";
    const options = {
      roomName: roomId,
      width: "100%",
      height: "100%",
      parentNode: iframeRef.current,
      configOverwrite: {
        prejoinPageEnabled: false,
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        disableDeepLinking: true,
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        DEFAULT_BACKGROUND: "#0F172A",
        TOOLBAR_BUTTONS: [
          "microphone", "camera", "desktop", "chat", "raisehand",
          "tileview", "fullscreen", "hangup"
        ],
        SETTINGS_SECTIONS: ["devices", "language"],
        HIDE_INVITE_MORE_HEADER: true,
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
      },
      userInfo: {
        displayName: userName,
      },
    };

    const script = document.createElement("script");
    script.src = `https://${domain}/external_api.js`;
    script.async = true;
    script.onload = () => {
      if (window.JitsiMeetExternalAPI) {
        const api = new window.JitsiMeetExternalAPI(domain, options);
        
        api.addEventListener("videoConferenceJoined", () => {
          setIsLoading(false);
        });

        api.addEventListener("readyToClose", () => {
          router.push("/session");
        });

        // Store api reference for controls
        window.jitsiApi = api;
      }
    };
    document.body.appendChild(script);

    return () => {
      if (window.jitsiApi) {
        window.jitsiApi.dispose();
        window.jitsiApi = null;
      }
      const existingScript = document.querySelector(`script[src="https://${domain}/external_api.js"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [roomId, userName, router]);

  const handleToggleMute = () => {
    if (window.jitsiApi) {
      window.jitsiApi.executeCommand("toggleAudio");
      setIsMuted(!isMuted);
    }
  };

  const handleToggleVideo = () => {
    if (window.jitsiApi) {
      window.jitsiApi.executeCommand("toggleVideo");
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleToggleScreenShare = () => {
    if (window.jitsiApi) {
      window.jitsiApi.executeCommand("toggleShareScreen");
      setIsScreenSharing(!isScreenSharing);
    }
  };

  const handleToggleChat = () => {
    if (window.jitsiApi) {
      window.jitsiApi.executeCommand("toggleChat");
      setShowChat(!showChat);
    }
  };

  const handleHangup = () => {
    if (window.jitsiApi) {
      window.jitsiApi.executeCommand("hangup");
    }
    router.push("/session");
  };

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <button
          onClick={() => router.push("/session")}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Sessions</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-slate-300 font-medium">{roomId}</span>
        </div>
      </div>

      {/* Video Container */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
            <div className="text-center">
              <div className="w-12 h-12 border-3 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-300 text-sm font-medium">Joining meeting...</p>
            </div>
          </div>
        )}
        <div ref={iframeRef} className="w-full h-full" />
      </div>

      {/* Custom Controls Overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-800/90 backdrop-blur-sm px-6 py-3 rounded-2xl border border-slate-700 shadow-2xl">
        <button
          onClick={handleToggleMute}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            isMuted 
              ? "bg-red-500/20 text-red-400 border border-red-500/30" 
              : "bg-slate-700 text-white hover:bg-slate-600"
          }`}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <button
          onClick={handleToggleVideo}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            isVideoOff 
              ? "bg-red-500/20 text-red-400 border border-red-500/30" 
              : "bg-slate-700 text-white hover:bg-slate-600"
          }`}
        >
          {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
        </button>

        <button
          onClick={handleToggleScreenShare}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            isScreenSharing 
              ? "bg-violet-500/20 text-violet-400 border border-violet-500/30" 
              : "bg-slate-700 text-white hover:bg-slate-600"
          }`}
        >
          <Monitor size={20} />
        </button>

        <button
          onClick={handleToggleChat}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            showChat 
              ? "bg-violet-500/20 text-violet-400 border border-violet-500/30" 
              : "bg-slate-700 text-white hover:bg-slate-600"
          }`}
        >
          <MessageSquare size={20} />
        </button>

        <div className="w-px h-8 bg-slate-600 mx-1" />

        <button
          onClick={handleHangup}
          className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-500 text-white hover:bg-red-600 transition-all"
        >
          <PhoneOff size={20} />
        </button>
      </div>
    </div>
  );
}

