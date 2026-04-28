"use client";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function MeetingPage() {
  const { roomId } = useParams();
  const router = useRouter();

  const meetingUrl = `https://meet.element.io/${roomId}#config.prejoinPageEnabled=false&config.startWithAudioMuted=false&config.startWithVideoMuted=false`;

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col">
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
          <span className="text-sm text-slate-300 font-medium truncate max-w-xs">{roomId}</span>
        </div>
      </div>

      <iframe
        src={meetingUrl}
        allow="camera; microphone; display-capture; autoplay; clipboard-write"
        className="flex-1 w-full border-0"
        style={{ minHeight: 0 }}
      />
    </div>
  );
}