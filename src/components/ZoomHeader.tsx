import { useState, useRef, useEffect, FormEvent } from 'react';
import { ViewMode } from '../types';
import { 
  ShieldCheck, 
  Grid, 
  User, 
  Maximize2, 
  Minimize2, 
  Columns, 
  Copy, 
  Check, 
  Layers, 
  Pause, 
  Play, 
  Square,
  Lock,
  Edit2,
  Users,
  Zap,
  Link2
} from 'lucide-react';

interface ZoomHeaderProps {
  topic: string;
  meetingId: string;
  passcode: string;
  hostName: string;
  durationSeconds: number;
  isRecording: boolean;
  isRecordingPaused: boolean;
  viewMode: ViewMode;
  participantCount: number;
  currentPlatform?: 'zoom' | 'meet';
  onSwitchPlatform?: (platform: 'zoom' | 'meet') => void;
  onViewModeChange: (mode: ViewMode) => void;
  onTopicChange: (newTopic: string) => void;
  onToggleRecordingPause: () => void;
  onStopRecording: () => void;
  onOpenScenarios: () => void;
  onOpenMassJoinModal?: () => void;
  onOpenDirectJoinModal?: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

export default function ZoomHeader({
  topic,
  meetingId,
  passcode,
  hostName,
  durationSeconds,
  isRecording,
  isRecordingPaused,
  viewMode,
  participantCount,
  currentPlatform = 'zoom',
  onSwitchPlatform,
  onViewModeChange,
  onTopicChange,
  onToggleRecordingPause,
  onStopRecording,
  onOpenScenarios,
  onOpenMassJoinModal,
  onOpenDirectJoinModal,
  onToggleFullscreen,
  isFullscreen,
}: ZoomHeaderProps) {
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [topicInput, setTopicInput] = useState(topic);
  const [copied, setCopied] = useState(false);
  const securityMenuRef = useRef<HTMLDivElement>(null);

  // Format seconds to HH:MM:SS
  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Close security popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (securityMenuRef.current && !securityMenuRef.current.contains(e.target as Node)) {
        setShowSecurityInfo(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyMeetingInfo = () => {
    const text = `Topic: ${topic}\nMeeting ID: ${meetingId}\nPasscode: ${passcode}\nDirect Link: ${window.location.href}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTopicSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (topicInput.trim()) {
      onTopicChange(topicInput.trim());
    }
    setIsEditingTopic(false);
  };

  return (
    <header id="zoom-header" className="h-12 bg-zinc-950 px-4 flex items-center justify-between border-b border-zinc-900 select-none text-zinc-300 z-30">
      {/* Left: Security Shield & Meeting Info & Recording */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Security Shield Badge */}
        <div className="relative" ref={securityMenuRef}>
          <button
            id="meeting-info-btn"
            onClick={() => setShowSecurityInfo(!showSecurityInfo)}
            className="flex items-center gap-1.5 p-1 px-2 rounded hover:bg-zinc-800 text-emerald-400 transition-colors text-xs font-semibold"
            title="Meeting Information & End-to-End Encryption"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline text-zinc-300 text-[11px]">Enhanced 256-bit E2EE</span>
          </button>

          {/* Security Info Popover */}
          {showSecurityInfo && (
            <div className="absolute left-0 top-full mt-1.5 w-72 bg-zinc-900 border border-zinc-700 rounded-xl p-4 shadow-2xl z-50 text-xs text-zinc-200">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-800">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">Meeting Information</span>
              </div>
              <div className="space-y-2 text-[11px]">
                <div>
                  <span className="text-zinc-500 block">Topic:</span>
                  <span className="text-zinc-200 font-medium">{topic}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Meeting ID:</span>
                  <span className="text-zinc-200 font-mono font-medium">{meetingId}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Passcode:</span>
                  <span className="text-zinc-200 font-mono font-medium">{passcode}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Host:</span>
                  <span className="text-zinc-200 font-medium">{hostName}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Active Attendees:</span>
                  <span className="text-blue-400 font-bold font-mono">{participantCount} Online</span>
                </div>
              </div>
              <button
                onClick={handleCopyMeetingInfo}
                className="w-full mt-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 border border-zinc-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Invitation'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Recording Banner */}
        {isRecording && (
          <div className="flex items-center gap-1.5 bg-rose-950/60 border border-rose-800/80 px-2 py-0.5 rounded text-rose-300 text-[11px] font-medium">
            <span className={`w-2 h-2 rounded-full bg-rose-500 ${isRecordingPaused ? '' : 'animate-ping'}`} />
            <span>{isRecordingPaused ? 'Recording Paused' : 'Recording'}</span>
            <div className="flex items-center gap-1 ml-1 pl-1 border-l border-rose-800/80">
              <button
                onClick={onToggleRecordingPause}
                className="p-0.5 hover:text-white"
                title={isRecordingPaused ? 'Resume' : 'Pause'}
              >
                {isRecordingPaused ? <Play className="w-2.5 h-2.5" /> : <Pause className="w-2.5 h-2.5" />}
              </button>
              <button
                onClick={onStopRecording}
                className="p-0.5 hover:text-white"
                title="Stop Recording"
              >
                <Square className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        )}

        {/* Timer */}
        <span className="text-xs text-zinc-400 font-mono hidden md:inline">
          {formatTime(durationSeconds)}
        </span>
      </div>

      {/* Center: Editable Meeting Topic */}
      <div className="flex items-center gap-1.5 max-w-[35%] truncate">
        {isEditingTopic ? (
          <form onSubmit={handleTopicSubmit} className="flex items-center gap-1">
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              autoFocus
              onBlur={handleTopicSubmit}
              className="bg-zinc-900 border border-blue-500 rounded px-2 py-0.5 text-xs text-white focus:outline-none"
            />
          </form>
        ) : (
          <div
            onClick={() => setIsEditingTopic(true)}
            className="flex items-center gap-1.5 cursor-pointer hover:bg-zinc-900 px-2 py-1 rounded transition-colors group"
            title="Click to rename meeting topic"
          >
            <span className="font-semibold text-xs sm:text-sm text-zinc-100 truncate">
              {topic}
            </span>
            <Edit2 className="w-3 h-3 text-zinc-500 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </div>

      {/* Right: Platform Switcher, Mass Joiner, Scenarios, View Switcher & Fullscreen */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* PLATFORM SWITCHER PILL */}
        {onSwitchPlatform && (
          <div className="flex items-center p-0.5 rounded-full bg-zinc-900 border border-zinc-700/80 shadow-inner">
            <button
              id="switch-to-zoom-header-btn"
              onClick={() => onSwitchPlatform('zoom')}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all ${
                currentPlatform === 'zoom'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span>Zoom</span>
            </button>
            <button
              id="switch-to-meet-header-btn"
              onClick={() => onSwitchPlatform('meet')}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all ${
                currentPlatform === 'meet'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Meet</span>
            </button>
          </div>
        )}

        {/* Direct Join Link / Custom Meeting ID Button */}
        {onOpenDirectJoinModal && (
          <button
            id="direct-join-header-btn"
            onClick={onOpenDirectJoinModal}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 rounded-md text-xs font-semibold transition-all shadow-xs"
            title="Paste any Zoom or Google Meet Link / ID & customize attendees"
          >
            <Link2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Join Any Link</span>
          </button>
        )}

        {/* Mass Attendee (100+ Users) Quick Controller Button */}
        {onOpenMassJoinModal && (
          <button
            id="mass-join-header-btn"
            onClick={onOpenMassJoinModal}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 hover:from-blue-600/50 hover:to-indigo-600/50 text-blue-300 border border-blue-500/40 rounded-md text-xs font-semibold transition-all shadow-xs"
            title="Click to adjust attendee count, mass join 100-1000+ users"
          >
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-bold text-white font-mono">{participantCount}</span>
            <span className="hidden sm:inline text-blue-300 text-[11px]">Online</span>
            <Zap className="w-3 h-3 text-amber-400 ml-0.5" />
          </button>
        )}

        <button
          id="scenario-picker-btn"
          onClick={onOpenScenarios}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 rounded-md text-xs font-medium border border-zinc-700/80 transition-colors shadow-xs"
        >
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Scenarios</span>
        </button>

        {/* View Switcher Button */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-md p-0.5">
          <button
            onClick={() => onViewModeChange('gallery')}
            title="Gallery View"
            className={`p-1 rounded ${viewMode === 'gallery' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange('speaker')}
            title="Speaker View"
            className={`p-1 rounded ${viewMode === 'speaker' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            <User className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange('side_by_side')}
            title="Side-by-Side View"
            className={`p-1 rounded ${viewMode === 'side_by_side' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            <Columns className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={onToggleFullscreen}
          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
