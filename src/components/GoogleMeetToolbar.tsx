import { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Smile, 
  Hand, 
  PhoneOff, 
  MoreVertical, 
  Info, 
  Users, 
  MessageSquare, 
  Shapes, 
  ShieldAlert, 
  Subtitles, 
  ScreenShare, 
  Sparkles,
  Camera,
  Layers,
  Image,
  Sliders
} from 'lucide-react';
import { VideoType } from '../types';

interface GoogleMeetToolbarProps {
  meetCode: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isHandRaised: boolean;
  isCaptionsOn: boolean;
  isChatOpen: boolean;
  isPeopleOpen: boolean;
  isActivitiesOpen: boolean;
  isDetailsOpen: boolean;
  isHostControlsOpen: boolean;
  isScreenSharing: boolean;
  participantCount: number;
  unreadChatCount: number;
  userVideoType: VideoType;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleHandRaise: () => void;
  onToggleCaptions: () => void;
  onToggleChat: () => void;
  onTogglePeople: () => void;
  onToggleActivities: () => void;
  onToggleDetails: () => void;
  onToggleHostControls: () => void;
  onToggleScreenShare: () => void;
  onSendReaction: (emoji: string) => void;
  onOpenVirtualBgModal: () => void;
  onOpenEscapeModal: () => void;
  onEndMeeting: () => void;
  onSetUserVideoType: (type: VideoType) => void;
}

const MEET_REACTIONS = ['💖', '👍', '🎉', '👏', '😂', '😮', '😢', '🤔', '👎'];

export default function GoogleMeetToolbar({
  meetCode,
  isMuted,
  isVideoOn,
  isHandRaised,
  isCaptionsOn,
  isChatOpen,
  isPeopleOpen,
  isActivitiesOpen,
  isDetailsOpen,
  isHostControlsOpen,
  isScreenSharing,
  participantCount,
  unreadChatCount,
  userVideoType,
  onToggleMute,
  onToggleVideo,
  onToggleHandRaise,
  onToggleCaptions,
  onToggleChat,
  onTogglePeople,
  onToggleActivities,
  onToggleDetails,
  onToggleHostControls,
  onToggleScreenShare,
  onSendReaction,
  onOpenVirtualBgModal,
  onOpenEscapeModal,
  onEndMeeting,
  onSetUserVideoType,
}: GoogleMeetToolbarProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  const emojiRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      id="google-meet-toolbar" 
      className="h-20 px-6 bg-[#202124] border-t border-[#3c4043] flex items-center justify-between text-[#e8eaed] select-none shrink-0 relative z-30"
    >
      {/* 1. Left Side: Meeting Time & Code */}
      <div className="flex items-center gap-3 w-1/4 min-w-0">
        <div className="flex items-center gap-2 text-sm font-medium text-[#e8eaed] truncate">
          <span>{currentTime}</span>
          <span className="text-[#5f6368]">|</span>
          <span className="font-mono text-xs text-[#9aa0a6] tracking-wider truncate">{meetCode}</span>
        </div>
      </div>

      {/* 2. Center: Signature Google Meet Circular Action Buttons */}
      <div className="flex items-center gap-3 justify-center relative">
        {/* Microphone Button */}
        <button
          id="meet-mic-toggle-btn"
          onClick={onToggleMute}
          title={isMuted ? 'Turn on microphone (Ctrl + D)' : 'Turn off microphone (Ctrl + D)'}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
            isMuted 
              ? 'bg-[#ea4335] text-white hover:bg-[#d93025] shadow-md' 
              : 'bg-[#3c4043] text-white hover:bg-[#4a4e51]'
          }`}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Video Camera Button */}
        <button
          id="meet-video-toggle-btn"
          onClick={onToggleVideo}
          title={isVideoOn ? 'Turn off camera (Ctrl + E)' : 'Turn on camera (Ctrl + E)'}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
            !isVideoOn 
              ? 'bg-[#ea4335] text-white hover:bg-[#d93025] shadow-md' 
              : 'bg-[#3c4043] text-white hover:bg-[#4a4e51]'
          }`}
        >
          {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        {/* Live Captions (CC) Button */}
        <button
          id="meet-captions-btn"
          onClick={onToggleCaptions}
          title={isCaptionsOn ? 'Turn off captions (c)' : 'Turn on captions (c)'}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
            isCaptionsOn 
              ? 'bg-[#8ab4f8] text-[#202124] hover:bg-[#a8c7fa] font-bold shadow-md' 
              : 'bg-[#3c4043] text-white hover:bg-[#4a4e51]'
          }`}
        >
          <Subtitles className="w-5 h-5" />
        </button>

        {/* Emoji Reactions Trigger Button */}
        <div className="relative" ref={emojiRef}>
          <button
            id="meet-reactions-btn"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Send a reaction"
            className="w-11 h-11 rounded-full bg-[#3c4043] hover:bg-[#4a4e51] text-white flex items-center justify-center transition-all"
          >
            <Smile className="w-5 h-5 text-amber-300" />
          </button>

          {/* Floating Emoji Picker Popover */}
          {showEmojiPicker && (
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-[#303134] border border-[#5f6368] rounded-full px-3 py-2 flex items-center gap-2 shadow-2xl z-50 animate-fade-in">
              {MEET_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onSendReaction(emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="text-xl hover:scale-130 transition-transform p-1 rounded-full hover:bg-[#3c4043]"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Present Now / Screen Share Button */}
        <button
          id="meet-present-btn"
          onClick={onToggleScreenShare}
          title={isScreenSharing ? 'Stop presenting' : 'Present now'}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
            isScreenSharing 
              ? 'bg-[#8ab4f8] text-[#202124] hover:bg-[#a8c7fa] shadow-md' 
              : 'bg-[#3c4043] text-white hover:bg-[#4a4e51]'
          }`}
        >
          <ScreenShare className="w-5 h-5" />
        </button>

        {/* Raise Hand Button */}
        <button
          id="meet-hand-raise-btn"
          onClick={onToggleHandRaise}
          title={isHandRaised ? 'Lower hand' : 'Raise hand'}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
            isHandRaised 
              ? 'bg-[#fdd663] text-[#202124] hover:bg-[#fee285] shadow-md' 
              : 'bg-[#3c4043] text-white hover:bg-[#4a4e51]'
          }`}
        >
          <Hand className="w-5 h-5" />
        </button>

        {/* More Options (⋮) Dropdown */}
        <div className="relative" ref={moreMenuRef}>
          <button
            id="meet-more-options-btn"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            title="More options"
            className="w-11 h-11 rounded-full bg-[#3c4043] hover:bg-[#4a4e51] text-white flex items-center justify-center transition-all"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* More Options Menu */}
          {showMoreMenu && (
            <div className="absolute bottom-14 right-0 w-64 bg-[#303134] border border-[#5f6368] rounded-xl shadow-2xl py-2 z-50 text-xs text-[#e8eaed] animate-fade-in">
              <button
                onClick={() => {
                  onOpenVirtualBgModal();
                  setShowMoreMenu(false);
                }}
                className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-[#3c4043] text-left"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Apply visual effects & backgrounds</span>
              </button>

              <button
                onClick={() => {
                  onOpenEscapeModal();
                  setShowMoreMenu(false);
                }}
                className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-[#3c4043] text-left text-amber-300"
              >
                <Sliders className="w-4 h-4" />
                <span>Fake Glitch / Excuse Generator</span>
              </button>

              <div className="h-px bg-[#3c4043] my-1" />

              <div className="px-4 py-1.5 text-[11px] font-semibold text-[#9aa0a6] uppercase tracking-wider">
                Video Feed Source
              </div>
              <button
                onClick={() => {
                  onSetUserVideoType('webcam');
                  setShowMoreMenu(false);
                }}
                className={`w-full px-4 py-2 flex items-center justify-between hover:bg-[#3c4043] ${
                  userVideoType === 'webcam' ? 'text-emerald-400 font-semibold' : ''
                }`}
              >
                <span>Real Live Webcam Feed</span>
                {userVideoType === 'webcam' && <span className="text-emerald-400">✓</span>}
              </button>
              <button
                onClick={() => {
                  onSetUserVideoType('preset_video');
                  setShowMoreMenu(false);
                }}
                className={`w-full px-4 py-2 flex items-center justify-between hover:bg-[#3c4043] ${
                  userVideoType === 'preset_video' ? 'text-emerald-400 font-semibold' : ''
                }`}
              >
                <span>Looping Video Model (Attentive)</span>
                {userVideoType === 'preset_video' && <span className="text-emerald-400">✓</span>}
              </button>
              <button
                onClick={() => {
                  onSetUserVideoType('avatar');
                  setShowMoreMenu(false);
                }}
                className={`w-full px-4 py-2 flex items-center justify-between hover:bg-[#3c4043] ${
                  userVideoType === 'avatar' ? 'text-emerald-400 font-semibold' : ''
                }`}
              >
                <span>Static Avatar Portrait</span>
                {userVideoType === 'avatar' && <span className="text-emerald-400">✓</span>}
              </button>
            </div>
          )}
        </div>

        {/* Leave Call Button: Signature Google Meet Wide Red Oval Pill */}
        <button
          id="meet-leave-call-btn"
          onClick={onEndMeeting}
          title="Leave call"
          className="h-11 px-6 rounded-full bg-[#ea4335] hover:bg-[#d93025] text-white flex items-center justify-center transition-all shadow-md"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>

      {/* 3. Right Side: Info, People, Chat, Activities, Host Controls */}
      <div className="flex items-center gap-1 justify-end w-1/4">
        {/* Meeting Details Info Button */}
        <button
          id="meet-details-btn"
          onClick={onToggleDetails}
          title="Meeting details"
          className={`p-2.5 rounded-full transition-colors ${
            isDetailsOpen 
              ? 'bg-[#8ab4f8] text-[#202124]' 
              : 'text-[#bdc1c6] hover:text-white hover:bg-[#3c4043]'
          }`}
        >
          <Info className="w-5 h-5" />
        </button>

        {/* People / Participants List Button */}
        <button
          id="meet-people-btn"
          onClick={onTogglePeople}
          title="People"
          className={`p-2.5 rounded-full transition-colors relative ${
            isPeopleOpen 
              ? 'bg-[#8ab4f8] text-[#202124]' 
              : 'text-[#bdc1c6] hover:text-white hover:bg-[#3c4043]'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 bg-[#3c4043] border border-[#5f6368] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
            {participantCount}
          </span>
        </button>

        {/* In-Call Messages / Chat Button */}
        <button
          id="meet-chat-btn"
          onClick={onToggleChat}
          title="Chat with everyone"
          className={`p-2.5 rounded-full transition-colors relative ${
            isChatOpen 
              ? 'bg-[#8ab4f8] text-[#202124]' 
              : 'text-[#bdc1c6] hover:text-white hover:bg-[#3c4043]'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          {unreadChatCount > 0 && !isChatOpen && (
            <span className="absolute -top-0.5 -right-0.5 bg-[#8ab4f8] text-[#202124] text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-bounce">
              {unreadChatCount}
            </span>
          )}
        </button>

        {/* Activities Button (Shapes) */}
        <button
          id="meet-activities-btn"
          onClick={onToggleActivities}
          title="Activities (Polls, Q&A, Whiteboard)"
          className={`p-2.5 rounded-full transition-colors ${
            isActivitiesOpen 
              ? 'bg-[#8ab4f8] text-[#202124]' 
              : 'text-[#bdc1c6] hover:text-white hover:bg-[#3c4043]'
          }`}
        >
          <Shapes className="w-5 h-5" />
        </button>

        {/* Host Controls Button */}
        <button
          id="meet-host-controls-btn"
          onClick={onToggleHostControls}
          title="Host safety controls"
          className={`p-2.5 rounded-full transition-colors ${
            isHostControlsOpen 
              ? 'bg-[#8ab4f8] text-[#202124]' 
              : 'text-[#bdc1c6] hover:text-white hover:bg-[#3c4043]'
          }`}
        >
          <ShieldAlert className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
