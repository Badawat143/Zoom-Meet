import { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Shield, 
  Users, 
  MessageSquare, 
  Share2, 
  Disc, 
  Smile, 
  Hand, 
  PhoneOff, 
  ChevronUp, 
  Settings, 
  Sparkles, 
  SlidersHorizontal,
  Flame,
  Camera,
  Check
} from 'lucide-react';
import { zoomSounds } from '../utils/soundEffects';

interface ZoomToolbarProps {
  isMuted: boolean;
  isVideoOn: boolean;
  isHandRaised: boolean;
  isRecording: boolean;
  isChatOpen: boolean;
  isParticipantsOpen: boolean;
  isScreenSharing: boolean;
  participantCount: number;
  unreadChatCount: number;
  userVideoType: 'webcam' | 'preset_video' | 'avatar';
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleHandRaise: () => void;
  onToggleRecording: () => void;
  onToggleChat: () => void;
  onToggleParticipants: () => void;
  onToggleScreenShare: () => void;
  onSendReaction: (emoji: string) => void;
  onOpenVirtualBgModal: () => void;
  onOpenEscapeModal: () => void;
  onEndMeeting: () => void;
  onSetUserVideoType: (type: 'webcam' | 'preset_video' | 'avatar') => void;
}

export default function ZoomToolbar({
  isMuted,
  isVideoOn,
  isHandRaised,
  isRecording,
  isChatOpen,
  isParticipantsOpen,
  isScreenSharing,
  participantCount,
  unreadChatCount,
  userVideoType,
  onToggleMute,
  onToggleVideo,
  onToggleHandRaise,
  onToggleRecording,
  onToggleChat,
  onToggleParticipants,
  onToggleScreenShare,
  onSendReaction,
  onOpenVirtualBgModal,
  onOpenEscapeModal,
  onEndMeeting,
  onSetUserVideoType,
}: ZoomToolbarProps) {
  const [showMicMenu, setShowMicMenu] = useState(false);
  const [showVideoMenu, setShowVideoMenu] = useState(false);
  const [showSecurityMenu, setShowSecurityMenu] = useState(false);
  const [showReactionsMenu, setShowReactionsMenu] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  // Security settings state
  const [isMeetingLocked, setIsMeetingLocked] = useState(false);
  const [isWaitingRoomEnabled, setIsWaitingRoomEnabled] = useState(true);
  const [allowShareScreen, setAllowShareScreen] = useState(true);
  const [allowChat, setAllowChat] = useState(true);

  const micMenuRef = useRef<HTMLDivElement>(null);
  const videoMenuRef = useRef<HTMLDivElement>(null);
  const secMenuRef = useRef<HTMLDivElement>(null);
  const reactMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (micMenuRef.current && !micMenuRef.current.contains(e.target as Node)) {
        setShowMicMenu(false);
      }
      if (videoMenuRef.current && !videoMenuRef.current.contains(e.target as Node)) {
        setShowVideoMenu(false);
      }
      if (secMenuRef.current && !secMenuRef.current.contains(e.target as Node)) {
        setShowSecurityMenu(false);
      }
      if (reactMenuRef.current && !reactMenuRef.current.contains(e.target as Node)) {
        setShowReactionsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMuteClick = () => {
    zoomSounds.playMuteToggleSound(!isMuted);
    onToggleMute();
  };

  const handleHandRaiseClick = () => {
    if (!isHandRaised) {
      zoomSounds.playHandRaiseDing();
    }
    onToggleHandRaise();
  };

  return (
    <div id="zoom-bottom-toolbar" className="h-16 bg-zinc-950/95 border-t border-zinc-900 px-4 flex items-center justify-between select-none relative z-40">
      {/* Left: Audio & Video Controls */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* MUTE / UNMUTE BUTTON */}
        <div className="relative flex items-center" ref={micMenuRef}>
          <button
            id="toolbar-mic-btn"
            onClick={handleMuteClick}
            className={`group flex flex-col items-center justify-center p-1.5 px-2.5 rounded-lg hover:bg-zinc-800 transition-colors ${
              isMuted ? 'text-rose-500' : 'text-zinc-200'
            }`}
          >
            <div className="relative">
              {isMuted ? <MicOff className="w-5 h-5 text-rose-500" /> : <Mic className="w-5 h-5 text-zinc-100" />}
              {!isMuted && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </div>
            <span className="text-[10px] font-medium mt-0.5 text-zinc-300">
              {isMuted ? 'Unmute' : 'Mute'}
            </span>
          </button>
          <button
            onClick={() => setShowMicMenu(!showMicMenu)}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>

          {/* Mic Options Menu */}
          {showMicMenu && (
            <div className="absolute bottom-full left-0 mb-2 w-64 bg-zinc-900 border border-zinc-700 rounded-xl p-2 shadow-2xl z-50 text-xs text-zinc-200 backdrop-blur-md">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-2 py-1 block">
                Select a Microphone
              </span>
              <button className="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-800 flex items-center justify-between text-zinc-200">
                <span>Default - Internal Microphone</span>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              </button>
              <button className="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-800 text-zinc-400">
                AirPods Pro / Bluetooth Mic
              </button>
              <div className="my-1 border-t border-zinc-800" />
              <button
                onClick={() => {
                  zoomSounds.playJoinChime();
                  setShowMicMenu(false);
                }}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-800 text-blue-400 font-medium"
              >
                Test Speaker & Microphone
              </button>
            </div>
          )}
        </div>

        {/* START / STOP VIDEO BUTTON */}
        <div className="relative flex items-center" ref={videoMenuRef}>
          <button
            id="toolbar-video-btn"
            onClick={onToggleVideo}
            className={`group flex flex-col items-center justify-center p-1.5 px-2.5 rounded-lg hover:bg-zinc-800 transition-colors ${
              isVideoOn ? 'text-zinc-200' : 'text-rose-500'
            }`}
          >
            {isVideoOn ? <Video className="w-5 h-5 text-zinc-100" /> : <VideoOff className="w-5 h-5 text-rose-500" />}
            <span className="text-[10px] font-medium mt-0.5 text-zinc-300">
              {isVideoOn ? 'Stop Video' : 'Start Video'}
            </span>
          </button>
          <button
            onClick={() => setShowVideoMenu(!showVideoMenu)}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>

          {/* Video Options Menu */}
          {showVideoMenu && (
            <div className="absolute bottom-full left-0 mb-2 w-64 bg-zinc-900 border border-zinc-700 rounded-xl p-2 shadow-2xl z-50 text-xs text-zinc-200 backdrop-blur-md">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-2 py-1 block">
                Camera Source
              </span>
              <button
                onClick={() => {
                  onSetUserVideoType('webcam');
                  setShowVideoMenu(false);
                }}
                className={`w-full text-left px-2 py-1.5 rounded hover:bg-zinc-800 flex items-center justify-between ${
                  userVideoType === 'webcam' ? 'text-blue-400 font-semibold' : 'text-zinc-200'
                }`}
              >
                <span>Live Real Webcam Feed</span>
                {userVideoType === 'webcam' && <Check className="w-3.5 h-3.5 text-blue-400" />}
              </button>
              <button
                onClick={() => {
                  onSetUserVideoType('avatar');
                  setShowVideoMenu(false);
                }}
                className={`w-full text-left px-2 py-1.5 rounded hover:bg-zinc-800 flex items-center justify-between ${
                  userVideoType === 'avatar' ? 'text-blue-400 font-semibold' : 'text-zinc-200'
                }`}
              >
                <span>Simulated High-Res Avatar Loop</span>
                {userVideoType === 'avatar' && <Check className="w-3.5 h-3.5 text-blue-400" />}
              </button>
              <div className="my-1 border-t border-zinc-800" />
              <button
                onClick={() => {
                  onOpenVirtualBgModal();
                  setShowVideoMenu(false);
                }}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-800 text-blue-400 font-medium flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Choose Virtual Background...
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Center: Main Meeting Action Icons */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Security Button */}
        <div className="relative" ref={secMenuRef}>
          <button
            id="toolbar-security-btn"
            onClick={() => setShowSecurityMenu(!showSecurityMenu)}
            className="flex flex-col items-center justify-center p-1.5 px-2.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
          >
            <Shield className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-0.5">Security</span>
          </button>

          {showSecurityMenu && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-zinc-900 border border-zinc-700 rounded-xl p-3 shadow-2xl z-50 text-xs text-zinc-200">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                Allow Participants To:
              </span>
              <label className="flex items-center justify-between py-1 px-1 rounded hover:bg-zinc-800 cursor-pointer">
                <span>Share Screen</span>
                <input
                  type="checkbox"
                  checked={allowShareScreen}
                  onChange={(e) => setAllowShareScreen(e.target.checked)}
                  className="rounded bg-zinc-800 text-blue-600"
                />
              </label>
              <label className="flex items-center justify-between py-1 px-1 rounded hover:bg-zinc-800 cursor-pointer">
                <span>Chat</span>
                <input
                  type="checkbox"
                  checked={allowChat}
                  onChange={(e) => setAllowChat(e.target.checked)}
                  className="rounded bg-zinc-800 text-blue-600"
                />
              </label>
              <label className="flex items-center justify-between py-1 px-1 rounded hover:bg-zinc-800 cursor-pointer">
                <span>Enable Waiting Room</span>
                <input
                  type="checkbox"
                  checked={isWaitingRoomEnabled}
                  onChange={(e) => setIsWaitingRoomEnabled(e.target.checked)}
                  className="rounded bg-zinc-800 text-blue-600"
                />
              </label>
            </div>
          )}
        </div>

        {/* Participants Button */}
        <button
          id="toolbar-participants-btn"
          onClick={onToggleParticipants}
          className={`relative flex flex-col items-center justify-center p-1.5 px-2.5 rounded-lg hover:bg-zinc-800 transition-colors ${
            isParticipantsOpen ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:text-white'
          }`}
        >
          <div className="relative">
            <Users className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-2.5 bg-zinc-700 text-white text-[9px] font-bold px-1 rounded-full border border-zinc-800">
              {participantCount}
            </span>
          </div>
          <span className="text-[10px] font-medium mt-0.5">Participants</span>
        </button>

        {/* Chat Button */}
        <button
          id="toolbar-chat-btn"
          onClick={onToggleChat}
          className={`relative flex flex-col items-center justify-center p-1.5 px-2.5 rounded-lg hover:bg-zinc-800 transition-colors ${
            isChatOpen ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:text-white'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            {unreadChatCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[9px] font-bold px-1 rounded-full animate-bounce">
                {unreadChatCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium mt-0.5">Chat</span>
        </button>

        {/* Share Screen (Green Button) */}
        <button
          id="toolbar-share-screen-btn"
          onClick={onToggleScreenShare}
          className={`flex flex-col items-center justify-center p-1.5 px-3 rounded-lg hover:brightness-110 transition-all ${
            isScreenSharing
              ? 'bg-rose-600/90 text-white shadow-lg'
              : 'text-emerald-400 hover:bg-emerald-950/40'
          }`}
        >
          <Share2 className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">
            {isScreenSharing ? 'Stop Share' : 'Share Screen'}
          </span>
        </button>

        {/* Record Button */}
        <button
          id="toolbar-record-btn"
          onClick={onToggleRecording}
          className={`flex flex-col items-center justify-center p-1.5 px-2.5 rounded-lg hover:bg-zinc-800 transition-colors ${
            isRecording ? 'text-rose-400' : 'text-zinc-300 hover:text-white'
          }`}
        >
          <Disc className={`w-5 h-5 ${isRecording ? 'animate-spin text-rose-500' : ''}`} />
          <span className="text-[10px] font-medium mt-0.5">
            {isRecording ? 'Recording' : 'Record'}
          </span>
        </button>

        {/* Reactions Button */}
        <div className="relative" ref={reactMenuRef}>
          <button
            id="toolbar-reactions-btn"
            onClick={() => setShowReactionsMenu(!showReactionsMenu)}
            className="flex flex-col items-center justify-center p-1.5 px-2.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
          >
            <Smile className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-0.5">Reactions</span>
          </button>

          {showReactionsMenu && (
            <div className="absolute bottom-full right-0 mb-2 bg-zinc-900 border border-zinc-700 rounded-2xl p-3 shadow-2xl z-50 flex flex-col gap-2 min-w-56 backdrop-blur-md">
              {/* Emojis Grid */}
              <div className="flex items-center justify-between gap-2 text-2xl px-1">
                {['👍', '👏', '❤️', '😂', '😮', '🎉'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onSendReaction(emoji);
                      setShowReactionsMenu(false);
                    }}
                    className="hover:scale-125 transform transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <div className="border-t border-zinc-800 pt-2">
                <button
                  onClick={() => {
                    handleHandRaiseClick();
                    setShowReactionsMenu(false);
                  }}
                  className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                    isHandRaised
                      ? 'bg-amber-500 text-zinc-950 font-bold'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100'
                  }`}
                >
                  <Hand className="w-4 h-4" />
                  <span>{isHandRaised ? 'Lower Hand' : 'Raise Hand'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Escape / Excuse Toolkit Button */}
        <button
          id="toolbar-escape-toolkit-btn"
          onClick={onOpenEscapeModal}
          className="flex flex-col items-center justify-center p-1.5 px-2.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 transition-colors"
          title="Tactical sound effects, doorbell, phone ring, freeze feed"
        >
          <Flame className="w-5 h-5 text-rose-400 animate-pulse" />
          <span className="text-[10px] font-bold mt-0.5">Excuse Toolkit</span>
        </button>
      </div>

      {/* Right: Red End Meeting Button */}
      <div className="relative">
        <button
          id="toolbar-end-btn"
          onClick={() => setShowEndConfirm(true)}
          className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-md text-xs font-bold transition-colors shadow-sm"
        >
          End
        </button>

        {/* End Meeting Confirm Popover */}
        {showEndConfirm && (
          <div className="absolute bottom-full right-0 mb-2 w-56 bg-zinc-900 border border-zinc-700 rounded-xl p-2 shadow-2xl z-50 text-xs font-semibold text-zinc-100">
            <button
              onClick={() => {
                setShowEndConfirm(false);
                zoomSounds.playLeaveChime();
                onEndMeeting();
              }}
              className="w-full text-left px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white mb-1 transition-colors"
            >
              End Meeting for All
            </button>
            <button
              onClick={() => {
                setShowEndConfirm(false);
                zoomSounds.playLeaveChime();
                onEndMeeting();
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-300 transition-colors"
            >
              Leave Meeting
            </button>
            <button
              onClick={() => setShowEndConfirm(false)}
              className="w-full text-center py-1 text-[11px] text-zinc-500 hover:text-zinc-300"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
