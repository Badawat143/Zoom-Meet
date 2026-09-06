import { useState, useRef, useEffect, FormEvent } from 'react';
import { Participant } from '../types';
import AnimatedParticipantVideo from './AnimatedParticipantVideo';
import { 
  Mic, 
  MicOff, 
  Hand, 
  Pin, 
  MoreVertical, 
  UserCheck, 
  Volume2, 
  Video, 
  VideoOff, 
  Radio, 
  Sparkles,
  Wifi,
  WifiOff
} from 'lucide-react';

interface ParticipantTileProps {
  participant: Participant;
  isCurrentUser?: boolean;
  isPinned?: boolean;
  isSpotlighted?: boolean;
  onTogglePin?: (id: string) => void;
  onToggleMute?: (id: string) => void;
  onToggleVideo?: (id: string) => void;
  onRename?: (id: string, newName: string) => void;
  onMakeHost?: (id: string) => void;
  onMakeSpeak?: (id: string) => void;
  onAskQuestion?: (id: string) => void;
  onRemove?: (id: string) => void;
  virtualBgUrl?: string;
  isFrozen?: boolean;
}

export default function ParticipantTile({
  participant,
  isCurrentUser = false,
  isPinned = false,
  isSpotlighted = false,
  onTogglePin,
  onToggleMute,
  onToggleVideo,
  onRename,
  onMakeHost,
  onMakeSpeak,
  onAskQuestion,
  onRemove,
  virtualBgUrl,
  isFrozen = false,
}: ParticipantTileProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newNameInput, setNewNameInput] = useState(participant.name);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRenameSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newNameInput.trim() && onRename) {
      onRename(participant.id, newNameInput.trim());
    }
    setIsRenaming(false);
    setShowMenu(false);
  };

  const isActiveSpeaker = participant.isSpeaking && !participant.isMuted;

  return (
    <div
      id={`participant-tile-${participant.id}`}
      className={`group relative w-full h-full bg-zinc-900 rounded-lg overflow-hidden select-none transition-all duration-200 border-2 ${
        isActiveSpeaker
          ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
          : isSpotlighted
          ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.35)]'
          : isPinned
          ? 'border-blue-500'
          : 'border-transparent'
      }`}
    >
      {/* Video Content Canvas / Stream */}
      <AnimatedParticipantVideo
        participant={participant}
        isCurrentUser={isCurrentUser}
        virtualBgUrl={participant.virtualBg || virtualBgUrl}
        isFrozen={isFrozen || participant.connectionQuality === 'frozen'}
      />

      {/* Top Controls Overlay on Hover */}
      <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        {/* Direct Ask / Voice Talk Button */}
        {!isCurrentUser && onAskQuestion && (
          <button
            id={`talk-member-btn-${participant.id}`}
            onClick={() => onAskQuestion(participant.id)}
            title={`Ask ${participant.name} a question with voice`}
            className="px-2 py-1 rounded bg-emerald-600/90 hover:bg-emerald-500 text-white text-[10px] font-semibold flex items-center gap-1 backdrop-blur-sm shadow-md transition-colors"
          >
            <Mic className="w-3 h-3" />
            <span>Ask Member</span>
          </button>
        )}

        {/* Quick Pin Button */}
        {onTogglePin && (
          <button
            id={`pin-btn-${participant.id}`}
            onClick={() => onTogglePin(participant.id)}
            title={isPinned ? 'Unpin video' : 'Pin video'}
            className={`p-1.5 rounded bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-colors ${
              isPinned ? 'text-blue-400 bg-black/80' : ''
            }`}
          >
            <Pin className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Trigger Speech Button for Simulation */}
        {!isCurrentUser && onMakeSpeak && (
          <button
            id={`speak-btn-${participant.id}`}
            onClick={() => onMakeSpeak(participant.id)}
            title="Trigger voice answer"
            className={`p-1.5 rounded bg-black/60 hover:bg-emerald-600/80 text-white backdrop-blur-sm transition-colors ${
              participant.isSpeaking ? 'bg-emerald-600 text-white' : ''
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        )}

        {/* 3-Dots Menu */}
        <div className="relative" ref={menuRef}>
          <button
            id={`menu-btn-${participant.id}`}
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-colors"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-md shadow-2xl py-1 z-50 text-xs font-medium backdrop-blur-md">
              {onToggleMute && (
                <button
                  id={`opt-mute-${participant.id}`}
                  onClick={() => {
                    onToggleMute(participant.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-700 flex items-center gap-2"
                >
                  {participant.isMuted ? (
                    <>
                      <Mic className="w-3.5 h-3.5 text-emerald-400" /> Unmute
                    </>
                  ) : (
                    <>
                      <MicOff className="w-3.5 h-3.5 text-rose-400" /> Mute
                    </>
                  )}
                </button>
              )}

              {onToggleVideo && (
                <button
                  id={`opt-video-${participant.id}`}
                  onClick={() => {
                    onToggleVideo(participant.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-700 flex items-center gap-2"
                >
                  {participant.isVideoOn ? (
                    <>
                      <VideoOff className="w-3.5 h-3.5 text-rose-400" /> Stop Video
                    </>
                  ) : (
                    <>
                      <Video className="w-3.5 h-3.5 text-emerald-400" /> Start Video
                    </>
                  )}
                </button>
              )}

              <button
                id={`opt-rename-${participant.id}`}
                onClick={() => setIsRenaming(true)}
                className="w-full text-left px-3 py-1.5 hover:bg-zinc-700 flex items-center gap-2"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-400" /> Rename
              </button>

              {!isCurrentUser && onMakeHost && (
                <button
                  id={`opt-host-${participant.id}`}
                  onClick={() => {
                    onMakeHost(participant.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-700 flex items-center gap-2"
                >
                  <Radio className="w-3.5 h-3.5 text-amber-400" /> Make Host
                </button>
              )}

              <div className="my-1 border-t border-zinc-700" />

              {!isCurrentUser && onRemove && (
                <button
                  id={`opt-remove-${participant.id}`}
                  onClick={() => {
                    onRemove(participant.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-rose-600/30 text-rose-400 flex items-center gap-2"
                >
                  <WifiOff className="w-3.5 h-3.5" /> Remove from Call
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Rename Dialog Modal if active */}
      {isRenaming && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-40 flex items-center justify-center p-3">
          <form onSubmit={handleRenameSubmit} className="bg-zinc-800 p-3 rounded-md w-full max-w-xs border border-zinc-700">
            <span className="text-xs font-semibold text-zinc-300 block mb-1.5">Rename Participant</span>
            <input
              type="text"
              value={newNameInput}
              onChange={(e) => setNewNameInput(e.target.value)}
              autoFocus
              className="w-full bg-zinc-900 border border-zinc-600 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-blue-500 mb-2.5"
            />
            <div className="flex justify-end gap-1.5">
              <button
                type="button"
                onClick={() => setIsRenaming(false)}
                className="px-2 py-1 text-[11px] rounded bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-2.5 py-1 text-[11px] rounded bg-blue-600 text-white hover:bg-blue-500 font-medium"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Raised Hand Banner / Badge */}
      {participant.isHandRaised && (
        <div className="absolute top-2 left-2 bg-amber-500 text-zinc-950 font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-lg text-[11px] animate-bounce z-10">
          <Hand className="w-3 h-3 fill-zinc-950" />
          <span>Hand Raised</span>
        </div>
      )}

      {/* Live Reaction Emoji on Tile */}
      {participant.reaction && Date.now() - participant.reaction.timestamp < 4000 && (
        <div className="absolute bottom-10 right-3 text-3xl animate-bounce filter drop-shadow-lg z-20">
          {participant.reaction.emoji}
        </div>
      )}

      {/* Subtitles / Speech Transcript bubble when talking */}
      {participant.isSpeaking && participant.speechScript && participant.speechScript.length > 0 && (
        <div className="absolute top-8 inset-x-3 bg-black/80 text-zinc-100 text-[11px] leading-snug p-2 rounded border border-zinc-700/60 shadow-lg backdrop-blur-md z-10 animate-fade-in">
          <span className="text-emerald-400 font-semibold mr-1.5">{participant.name}:</span>
          &ldquo;{participant.speechScript[participant.currentSpeechIndex || 0]}&rdquo;
        </div>
      )}

      {/* Bottom Name & Status Strip (Classic Zoom Style) */}
      <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-white text-[11px] font-medium max-w-[85%] truncate">
          {/* Audio Status Icon */}
          {participant.isMuted ? (
            <div className="bg-rose-600/90 rounded p-0.5 text-white">
              <MicOff className="w-2.5 h-2.5" />
            </div>
          ) : (
            <div className="relative flex items-center gap-0.5">
              <Mic className={`w-3 h-3 ${isActiveSpeaker ? 'text-emerald-400' : 'text-zinc-300'}`} />
              {isActiveSpeaker && (
                <div className="flex items-end gap-0.5 h-3 ml-0.5">
                  <span className="w-0.5 h-2 bg-emerald-400 animate-pulse"></span>
                  <span className="w-0.5 h-3 bg-emerald-400 animate-bounce"></span>
                  <span className="w-0.5 h-1.5 bg-emerald-400 animate-pulse"></span>
                </div>
              )}
            </div>
          )}

          {/* Gender icon indicator */}
          {!isCurrentUser && (
            <span className="text-[10px] opacity-80" title={participant.gender === 'female' ? 'Female Voice' : 'Male Voice'}>
              {participant.gender === 'female' ? '👩' : '👨'}
            </span>
          )}

          {/* Name & Badges */}
          <span className="truncate">
            {participant.name}
            {isCurrentUser ? ' (You)' : ''}
            {participant.isHost ? ' (Host)' : participant.isCoHost ? ' (Co-host)' : ''}
          </span>
        </div>

        {/* Bad Connection / Pinned indicator */}
        <div className="flex items-center gap-1">
          {isPinned && (
            <div className="bg-blue-600/80 p-0.5 rounded text-white" title="Pinned">
              <Pin className="w-2.5 h-2.5" />
            </div>
          )}
          {participant.connectionQuality === 'poor' && (
            <div className="bg-amber-600/80 px-1 py-0.5 rounded text-white text-[9px] flex items-center gap-0.5" title="Unstable Connection">
              <Wifi className="w-2.5 h-2.5 text-amber-300" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
