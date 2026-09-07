import { useState, FormEvent, useEffect } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  User, 
  Zap, 
  Link2, 
  Users, 
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { MeetingPlatform } from '../types';
import { zoomSounds } from '../utils/soundEffects';

interface MeetingJoinPreviewProps {
  topic: string;
  meetingId: string;
  meetCode?: string;
  initialName: string;
  initialPlatform?: MeetingPlatform;
  initialUserCount?: number;
  onJoinMeeting: (
    name: string, 
    isMuted: boolean, 
    isVideoOn: boolean, 
    videoType: 'webcam' | 'avatar', 
    platform: MeetingPlatform,
    customDetails?: {
      meetingIdOrCode?: string;
      topic?: string;
      initialAttendeeCount?: number;
    }
  ) => void;
}

export default function MeetingJoinPreview({
  topic: initialTopic,
  meetingId: initialMeetingId,
  meetCode: initialMeetCode = 'abc-defg-hij',
  initialName,
  initialPlatform = 'zoom',
  initialUserCount = 100,
  onJoinMeeting,
}: MeetingJoinPreviewProps) {
  const [name, setName] = useState(initialName || 'Alex Rivera');
  const [platform, setPlatform] = useState<MeetingPlatform>(initialPlatform);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [videoType, setVideoType] = useState<'webcam' | 'avatar'>('avatar');
  
  // Direct Link / Code input
  const [meetingInput, setMeetingInput] = useState('');
  const [customTopic, setCustomTopic] = useState(initialTopic || 'Executive Strategy & Global Sync');
  const [memberCount, setMemberCount] = useState<number>(initialUserCount >= 100 ? initialUserCount : 100);
  const [detectedType, setDetectedType] = useState<'meet' | 'zoom' | null>(null);

  // Analyze link or ID when user types or pastes
  const handleInputChange = (raw: string) => {
    setMeetingInput(raw);
    const val = raw.trim().toLowerCase();

    if (val.includes('meet.google.com') || /^[a-z]{3}-[a-z]{4}-[a-z]{3}$/i.test(raw.trim())) {
      setPlatform('meet');
      setDetectedType('meet');
    } else if (val.includes('zoom.us') || val.includes('/j/') || /^\d{9,11}$/.test(val.replace(/\s+/g, ''))) {
      setPlatform('zoom');
      setDetectedType('zoom');
    } else if (val.length > 0) {
      setDetectedType(platform);
    } else {
      setDetectedType(null);
    }
  };

  const handleQuickPreset = (targetPlatform: MeetingPlatform, sampleLink: string, sampleTopic: string) => {
    setPlatform(targetPlatform);
    setDetectedType(targetPlatform);
    setMeetingInput(sampleLink);
    setCustomTopic(sampleTopic);
  };

  const handleJoin = (e?: FormEvent) => {
    if (e) e.preventDefault();
    
    const chosenName = name.trim() || 'Alex Rivera';

    // Parse clean ID or code from user input
    let cleanCodeOrId = meetingInput.trim();
    if (cleanCodeOrId.includes('meet.google.com/')) {
      cleanCodeOrId = cleanCodeOrId.split('meet.google.com/')[1].split('?')[0].split('/')[0];
    } else if (cleanCodeOrId.includes('/j/')) {
      const match = cleanCodeOrId.match(/\/j\/(\d+)/);
      if (match) cleanCodeOrId = match[1];
    }

    if (!cleanCodeOrId) {
      cleanCodeOrId = platform === 'meet' ? initialMeetCode : initialMeetingId;
    }

    if (platform === 'meet') {
      zoomSounds.playMeetJoinChime();
    } else {
      zoomSounds.playJoinChime();
    }

    onJoinMeeting(
      chosenName, 
      isMuted, 
      isVideoOn, 
      videoType, 
      platform,
      {
        meetingIdOrCode: cleanCodeOrId,
        topic: customTopic.trim() || initialTopic,
        initialAttendeeCount: memberCount || 100,
      }
    );
  };

  const isMeet = platform === 'meet';

  return (
    <div className="fixed inset-0 bg-[#0f0f11] flex items-center justify-center p-3 sm:p-4 z-50 select-none overflow-y-auto">
      <div className={`w-full max-w-xl ${isMeet ? 'bg-[#202124] border-[#3c4043]' : 'bg-zinc-900 border-zinc-800'} border rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all my-auto`}>
        
        {/* Top Bar with Platform Selector */}
        <div className={`p-3.5 sm:p-4 ${isMeet ? 'bg-[#1f1f1f] border-[#3c4043]' : 'bg-zinc-950 border-zinc-800'} border-b flex items-center justify-between`}>
          <div className="flex items-center gap-2.5">
            {isMeet ? (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 via-yellow-400 to-red-500 p-0.5 flex items-center justify-center shadow-md">
                <div className="w-full h-full bg-[#202124] rounded-[5px] flex items-center justify-center">
                  <Video className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                Z
              </div>
            )}
            <div>
              <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                {isMeet ? 'Google Meet Live Call' : 'Zoom Workplace Meeting'}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                {meetingInput 
                  ? `Target: ${meetingInput.slice(0, 35)}${meetingInput.length > 35 ? '...' : ''}`
                  : (isMeet ? `meet.google.com/${initialMeetCode}` : `ID: ${initialMeetingId}`)}
              </span>
            </div>
          </div>

          {/* Quick Platform Switcher Tabs */}
          <div className="flex items-center p-0.5 rounded-full bg-black/60 border border-zinc-700 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setPlatform('zoom');
                setDetectedType('zoom');
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                platform === 'zoom'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>🟦 Zoom</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setPlatform('meet');
                setDetectedType('meet');
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                platform === 'meet'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>📹 Meet</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-4 sm:p-5 space-y-3.5">
          
          {/* 1. DIRECT LINK / MEETING ID INPUT BOX */}
          <div className={`p-3 rounded-xl border transition-all ${
            isMeet ? 'bg-[#171717]/90 border-[#3c4043]' : 'bg-zinc-950/80 border-zinc-800'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Paste Google Meet Link or Zoom Link / ID:</span>
              </label>
              {detectedType && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" />
                  {detectedType === 'meet' ? 'Google Meet Detected' : 'Zoom Detected'}
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                value={meetingInput}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={
                  isMeet 
                    ? "Paste Google Meet Link (e.g. meet.google.com/abc-defg-hij)..." 
                    : "Paste Zoom Link or Meeting ID (e.g. zoom.us/j/98429014482)..."
                }
                className={`w-full ${isMeet ? 'bg-[#202124] border-[#3c4043] focus:border-emerald-500' : 'bg-zinc-900 border-zinc-700 focus:border-blue-500'} border rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none font-mono`}
              />
            </div>

            {/* Quick 1-Click Samples */}
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-800/60 text-[11px]">
              <span className="text-zinc-500 font-medium">Quick Links:</span>
              <button
                type="button"
                onClick={() => handleQuickPreset('meet', 'https://meet.google.com/prj-team-sync', 'Project Architecture & Google Cloud Sync')}
                className="text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/30 transition-colors"
              >
                📹 Google Meet Link
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('zoom', 'https://zoom.us/j/98429014482?pwd=apex', 'Global Executive All-Hands Meeting')}
                className="text-blue-400 hover:text-blue-300 bg-blue-950/40 hover:bg-blue-900/60 px-2 py-0.5 rounded border border-blue-500/30 transition-colors"
              >
                🟦 Zoom Link
              </button>
            </div>
          </div>

          {/* 2. Video Preview Screen */}
          <div className={`relative w-full aspect-video sm:aspect-21/9 ${isMeet ? 'bg-[#171717] border-[#3c4043] rounded-2xl' : 'bg-zinc-950 border-zinc-800 rounded-xl'} overflow-hidden border shadow-inner flex items-center justify-center`}>
            {isVideoOn ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
                  alt="You"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-zinc-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {videoType === 'webcam' ? 'Live Webcam Connected' : 'Simulated Studio Feed'}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <User className="w-6 h-6 text-zinc-500" />
                </div>
                <span className="text-[11px] text-zinc-400">Camera is turned off</span>
              </div>
            )}

            {/* Bottom Preview Audio/Video Controls */}
            <div className="absolute bottom-2 inset-x-2 flex items-center justify-between px-3 py-1 bg-black/70 backdrop-blur-md rounded-xl text-xs">
              <span className="text-[11px] text-zinc-200 font-medium truncate max-w-[150px]">
                {name || 'Alex Rivera'} (You)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-1.5 rounded-full transition-colors ${
                    isMuted ? 'bg-[#ea4335] text-white' : 'bg-zinc-800 text-zinc-300 hover:text-white'
                  }`}
                  title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`p-1.5 rounded-full transition-colors ${
                    !isVideoOn ? 'bg-[#ea4335] text-white' : 'bg-zinc-800 text-zinc-300 hover:text-white'
                  }`}
                  title={isVideoOn ? 'Stop video' : 'Start video'}
                >
                  {isVideoOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* 3. Name & Topic Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                Your Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                className={`w-full ${isMeet ? 'bg-[#171717] border-[#3c4043] focus:border-emerald-500' : 'bg-zinc-950 border-zinc-700 focus:border-blue-500'} border rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                Meeting Topic / Agenda Title
              </label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Executive Strategy & Global Sync"
                className={`w-full ${isMeet ? 'bg-[#171717] border-[#3c4043] focus:border-emerald-500' : 'bg-zinc-950 border-zinc-700 focus:border-blue-500'} border rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none`}
              />
            </div>
          </div>

          {/* 4. Attendee Multiplier Selection */}
          <div className={`p-3 ${isMeet ? 'bg-[#171717]/80 border-[#3c4043]' : 'bg-zinc-950/70 border-zinc-800'} rounded-xl border space-y-2`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                Select Total Meeting Attendees (जितने चाहे मेंबर्स):
              </span>
              <span className="text-xs font-bold text-blue-400 font-mono">
                {memberCount} Members
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[50, 100, 250, 500].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setMemberCount(num)}
                  className={`py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                    memberCount === num
                      ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {num} Users
                </button>
              ))}
            </div>
          </div>

          {/* 5. Big Instant Join Button */}
          <button
            type="button"
            onClick={() => handleJoin()}
            className={`w-full py-3 ${
              isMeet 
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30' 
                : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
            } text-white rounded-xl font-bold text-sm shadow-xl transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer`}
          >
            <span>Join {isMeet ? 'Google Meet' : 'Zoom Workplace'} ({memberCount} Attendees)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
