import { useState } from 'react';
import { 
  Copy, 
  Check, 
  Maximize2, 
  Minimize2, 
  Zap, 
  Video, 
  Camera,
  Layers,
  Sparkles,
  Link2
} from 'lucide-react';
import { MeetingPlatform } from '../types';

interface GoogleMeetHeaderProps {
  topic: string;
  meetCode: string;
  durationSeconds: number;
  participantCount: number;
  currentPlatform: MeetingPlatform;
  onSwitchPlatform: (platform: MeetingPlatform) => void;
  onOpenMassJoinModal: () => void;
  onOpenDirectJoinModal?: () => void;
  onOpenScenarios: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

export default function GoogleMeetHeader({
  topic,
  meetCode,
  durationSeconds,
  participantCount,
  currentPlatform,
  onSwitchPlatform,
  onOpenMassJoinModal,
  onOpenDirectJoinModal,
  onOpenScenarios,
  onToggleFullscreen,
  isFullscreen,
}: GoogleMeetHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(`https://meet.google.com/${meetCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <header 
      id="google-meet-header" 
      className="h-14 px-4 bg-[#202124] border-b border-[#3c4043] flex items-center justify-between text-[#e8eaed] select-none shrink-0 z-30"
    >
      {/* Left: Google Meet Logo, Topic & Meeting Code */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          {/* Authentic Google Meet 4-color Camera Icon */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 via-yellow-400 to-red-500 p-0.5 flex items-center justify-center shrink-0 shadow-sm">
            <div className="w-full h-full bg-[#202124] rounded-[6px] flex items-center justify-center">
              <Video className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-white tracking-tight truncate max-w-[200px] sm:max-w-xs">
                {topic}
              </span>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#3c4043] text-emerald-400 font-mono font-medium">
                {meetCode}
              </span>
            </div>
            <span className="text-[11px] text-[#9aa0a6] hidden sm:block">
              Google Meet Call • {formatTime(durationSeconds)}
            </span>
          </div>
        </div>

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          title="Copy Google Meet joining link"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#303134] hover:bg-[#3c4043] text-xs text-[#bdc1c6] hover:text-white transition-colors border border-[#5f6368]/40"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="hidden md:inline text-[11px]">{copied ? 'Link Copied!' : 'meet.google.com/' + meetCode}</span>
        </button>
      </div>

      {/* Right: Mode Switcher (Google Meet <-> Zoom), Mass Join, Presets & Fullscreen */}
      <div className="flex items-center gap-2">
        {/* PLATFORM SWITCHER PILL */}
        <div className="flex items-center p-0.5 rounded-full bg-[#171717] border border-[#5f6368]/60 shadow-inner">
          <button
            id="switch-to-zoom-btn"
            onClick={() => onSwitchPlatform('zoom')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentPlatform === 'zoom'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-[#9aa0a6] hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>Zoom</span>
          </button>
          <button
            id="switch-to-meet-btn"
            onClick={() => onSwitchPlatform('meet')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentPlatform === 'meet'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-[#9aa0a6] hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Google Meet</span>
          </button>
        </div>

        {/* Direct Join Link Button */}
        {onOpenDirectJoinModal && (
          <button
            id="meet-direct-join-btn"
            onClick={onOpenDirectJoinModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#303134] hover:bg-[#3c4043] text-emerald-400 hover:text-emerald-300 rounded-full text-xs font-semibold transition-all border border-[#5f6368]/40 shadow-sm"
            title="Join any other Google Meet or Zoom link"
          >
            <Link2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Join Any Link</span>
          </button>
        )}

        {/* Mass Join Quick Pill */}
        <button
          onClick={onOpenMassJoinModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full text-xs font-bold transition-all shadow-sm border border-emerald-400/40"
          title="Change total attendee count (100 to 1,000+)"
        >
          <Zap className="w-3.5 h-3.5 text-yellow-300" />
          <span>👥 {participantCount} Users</span>
        </button>

        {/* Scenarios Preset Button */}
        <button
          onClick={onOpenScenarios}
          className="p-2 rounded-full hover:bg-[#3c4043] text-[#bdc1c6] hover:text-white transition-colors"
          title="Meeting Scenarios / Pre-sets"
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={onToggleFullscreen}
          className="p-2 rounded-full hover:bg-[#3c4043] text-[#bdc1c6] hover:text-white transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
