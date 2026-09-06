import { useState } from 'react';
import { X, ShieldAlert, Lock, Check } from 'lucide-react';

interface GoogleMeetHostDrawerProps {
  onClose: () => void;
}

export default function GoogleMeetHostDrawer({ onClose }: GoogleMeetHostDrawerProps) {
  const [hostManagement, setHostManagement] = useState(true);
  const [shareScreen, setShareScreen] = useState(true);
  const [sendChat, setSendChat] = useState(true);
  const [sendReactions, setSendReactions] = useState(true);
  const [turnOnMic, setTurnOnMic] = useState(true);
  const [turnOnVideo, setTurnOnVideo] = useState(true);

  return (
    <aside 
      id="google-meet-host-drawer"
      className="w-80 h-full bg-[#202124] border-l border-[#3c4043] flex flex-col text-[#e8eaed] select-none z-30 shrink-0 animate-slide-in-right"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#3c4043] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-blue-400" />
          <h2 className="text-base font-semibold text-white">Host controls</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-[#3c4043] text-[#bdc1c6] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
        {/* Host management toggle */}
        <div className="p-4 bg-[#303134] rounded-xl border border-[#5f6368]/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white text-sm">Host management</span>
            <input
              type="checkbox"
              checked={hostManagement}
              onChange={(e) => setHostManagement(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 bg-zinc-900 border-zinc-700 focus:ring-0 cursor-pointer"
            />
          </div>
          <p className="text-[11px] text-[#9aa0a6] leading-relaxed">
            Lets you restrict what participants can do in the meeting, lock chat, and control attendee video & screen sharing.
          </p>
        </div>

        {/* Meeting permissions */}
        <div className="space-y-3">
          <h3 className="font-semibold text-[#9aa0a6] uppercase tracking-wider text-[11px]">
            Let everyone:
          </h3>

          <label className="flex items-center justify-between p-3 bg-[#303134]/70 hover:bg-[#303134] rounded-lg border border-[#5f6368]/40 cursor-pointer">
            <span className="text-white">Share their screen</span>
            <input
              type="checkbox"
              checked={shareScreen}
              onChange={(e) => setShareScreen(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 bg-zinc-900 border-zinc-700 focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-[#303134]/70 hover:bg-[#303134] rounded-lg border border-[#5f6368]/40 cursor-pointer">
            <span className="text-white">Send chat messages</span>
            <input
              type="checkbox"
              checked={sendChat}
              onChange={(e) => setSendChat(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 bg-zinc-900 border-zinc-700 focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-[#303134]/70 hover:bg-[#303134] rounded-lg border border-[#5f6368]/40 cursor-pointer">
            <span className="text-white">Send reactions</span>
            <input
              type="checkbox"
              checked={sendReactions}
              onChange={(e) => setSendReactions(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 bg-zinc-900 border-zinc-700 focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-[#303134]/70 hover:bg-[#303134] rounded-lg border border-[#5f6368]/40 cursor-pointer">
            <span className="text-white">Turn on their microphone</span>
            <input
              type="checkbox"
              checked={turnOnMic}
              onChange={(e) => setTurnOnMic(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 bg-zinc-900 border-zinc-700 focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-[#303134]/70 hover:bg-[#303134] rounded-lg border border-[#5f6368]/40 cursor-pointer">
            <span className="text-white">Turn on their video</span>
            <input
              type="checkbox"
              checked={turnOnVideo}
              onChange={(e) => setTurnOnVideo(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 bg-zinc-900 border-zinc-700 focus:ring-0 cursor-pointer"
            />
          </label>
        </div>
      </div>
    </aside>
  );
}
