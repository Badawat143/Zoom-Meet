import { useState } from 'react';
import { Participant } from '../types';
import { 
  X, 
  Search, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  UserPlus, 
  VolumeX, 
  Users, 
  Zap,
  Check
} from 'lucide-react';

interface ParticipantsDrawerProps {
  participants: Participant[];
  currentUserId: string;
  onClose: () => void;
  onToggleMute: (id: string) => void;
  onToggleVideo: (id: string) => void;
  onMuteAll: () => void;
  onOpenAddUserModal: () => void;
  onOpenMassJoinModal?: () => void;
  onAskQuestion?: (id: string) => void;
  onAdmitUser?: (id: string) => void;
}

export default function ParticipantsDrawer({
  participants,
  currentUserId,
  onClose,
  onToggleMute,
  onToggleVideo,
  onMuteAll,
  onOpenAddUserModal,
  onOpenMassJoinModal,
  onAskQuestion,
}: ParticipantsDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const filtered = participants.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.role && p.role.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCopyInvite = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div id="zoom-participants-drawer" className="w-80 sm:w-96 h-full bg-zinc-900 border-l border-zinc-800 flex flex-col z-30 shadow-2xl animate-slide-in">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between text-zinc-200">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm text-white">Participants</h3>
          <span className="text-xs bg-blue-600/20 text-blue-400 font-bold px-2.5 py-0.5 rounded-full border border-blue-500/30 font-mono">
            {participants.length} Online
          </span>
        </div>
        <button
          id="close-participants-btn"
          onClick={onClose}
          className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search & Actions Bar */}
      <div className="p-3 border-b border-zinc-800/80 space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder={`Search ${participants.length} participants...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700/80 rounded-md pl-8 pr-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Mass Join 100+ Attendees & Mute All Buttons */}
        <div className="flex items-center gap-2">
          {onOpenMassJoinModal && (
            <button
              id="mass-join-drawer-btn"
              onClick={onOpenMassJoinModal}
              className="flex-1 py-1.5 px-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
              title="Mass Join 100, 250, 500+ attendees"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" /> Mass Join (100+)
            </button>
          )}

          <button
            id="add-fake-user-btn"
            onClick={onOpenAddUserModal}
            className="py-1.5 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md text-xs font-semibold flex items-center justify-center gap-1 border border-zinc-700 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5 text-blue-400" /> +1 User
          </button>

          <button
            id="mute-all-btn"
            onClick={onMuteAll}
            className="py-1.5 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md text-xs font-medium flex items-center gap-1 border border-zinc-700 transition-colors"
            title="Mute everyone in meeting"
          >
            <VolumeX className="w-3.5 h-3.5 text-rose-400" /> Mute All
          </button>
        </div>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 select-none text-xs">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
            In This Meeting ({filtered.length})
          </span>
          {participants.length >= 100 && (
            <span className="text-[10px] text-emerald-400 font-mono">
              ⚡ 100+ Live Simulated
            </span>
          )}
        </div>

        {filtered.map((p) => {
          const isMe = p.id === currentUserId;
          return (
            <div
              key={p.id}
              className="group flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800/80 transition-colors"
            >
              {/* Avatar + Info */}
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-zinc-700 bg-zinc-800">
                  <img
                    src={p.avatarUrl}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {p.isSpeaking && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-900 animate-pulse" />
                  )}
                  {p.isHandRaised && (
                    <span className="absolute -top-1 -right-1 text-xs">✋</span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-zinc-200 truncate block">
                      {p.name}
                    </span>
                    {isMe && (
                      <span className="text-[10px] text-blue-400 font-medium">
                        (Me)
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">
                    {p.isHost ? 'Host' : p.isCoHost ? 'Co-host' : p.role || 'Attendee'}
                  </div>
                </div>
              </div>

              {/* Status & Quick Action Icons */}
              <div className="flex items-center gap-1 shrink-0">
                {!isMe && onAskQuestion && (
                  <button
                    onClick={() => onAskQuestion(p.id)}
                    className="px-1.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 text-[10px] font-medium flex items-center gap-0.5 transition-colors border border-emerald-500/30"
                    title={`Ask ${p.name} a question with voice`}
                  >
                    <Mic className="w-2.5 h-2.5" />
                    <span>Ask</span>
                  </button>
                )}

                <button
                  onClick={() => onToggleMute(p.id)}
                  className={`p-1.5 rounded hover:bg-zinc-700 transition-colors ${
                    p.isMuted ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                  title={p.isMuted ? 'Unmute' : 'Mute'}
                >
                  {p.isMuted ? (
                    <MicOff className="w-3.5 h-3.5" />
                  ) : (
                    <Mic className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  onClick={() => onToggleVideo(p.id)}
                  className={`p-1.5 rounded hover:bg-zinc-700 transition-colors ${
                    p.isVideoOn ? 'text-zinc-300' : 'text-rose-400'
                  }`}
                  title={p.isVideoOn ? 'Stop Video' : 'Start Video'}
                >
                  {p.isVideoOn ? (
                    <Video className="w-3.5 h-3.5" />
                  ) : (
                    <VideoOff className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer / Invite Link */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-950 flex flex-col gap-2 text-xs">
        <button
          onClick={handleCopyInvite}
          className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md font-medium flex items-center justify-center gap-2 border border-zinc-700/80 transition-colors"
        >
          {copiedLink ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Invite Link (with {participants.length} Users) Copied!</span>
            </>
          ) : (
            <>
              <Users className="w-4 h-4 text-zinc-400" />
              <span>Copy Invite Link (Loads {participants.length} Users)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
