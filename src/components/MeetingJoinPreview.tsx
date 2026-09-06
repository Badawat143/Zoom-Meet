import { useState, FormEvent } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Settings, 
  Sparkles, 
  Shield, 
  User, 
  Zap, 
  Link2, 
  Users, 
  ArrowRight,
  Sliders
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
  meetCode = 'abc-defg-hij',
  initialName,
  initialPlatform = 'zoom',
  initialUserCount = 100,
  onJoinMeeting,
}: MeetingJoinPreviewProps) {
  const [activeTab, setActiveTab] = useState<'quick' | 'direct_link'>('quick');
  const [name, setName] = useState(initialName);
  const [platform, setPlatform] = useState<MeetingPlatform>(initialPlatform);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [videoType, setVideoType] = useState<'webcam' | 'avatar'>('avatar');
  
  // Direct Join by Link fields
  const [meetingUrlOrId, setMeetingUrlOrId] = useState('');
  const [customTopic, setCustomTopic] = useState(initialTopic);
  const [memberCount, setMemberCount] = useState<number>(initialUserCount >= 100 ? initialUserCount : 100);

  // Auto-detect platform and extract meeting code / ID when URL is entered
  const handleUrlChange = (val: string) => {
    setMeetingUrlOrId(val);
    const trimmed = val.trim();
    if (trimmed.includes('meet.google.com')) {
      setPlatform('meet');
    } else if (trimmed.includes('zoom.us') || trimmed.includes('/j/')) {
      setPlatform('zoom');
    }
  };

  const handleJoin = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (platform === 'meet') {
      zoomSounds.playMeetJoinChime();
    } else {
      zoomSounds.playJoinChime();
    }

    let cleanId = meetingUrlOrId.trim();
    if (cleanId.includes('meet.google.com/')) {
      cleanId = cleanId.split('meet.google.com/')[1].split('?')[0];
    } else if (cleanId.includes('/j/')) {
      const match = cleanId.match(/\/j\/(\d+)/);
      if (match) cleanId = match[1];
    }

    onJoinMeeting(
      name.trim(), 
      isMuted, 
      isVideoOn, 
      videoType, 
      platform,
      {
        meetingIdOrCode: cleanId || (platform === 'meet' ? meetCode : initialMeetingId),
        topic: customTopic.trim() || initialTopic,
        initialAttendeeCount: memberCount || 100,
      }
    );
  };

  const isMeet = platform === 'meet';

  return (
    <div className="fixed inset-0 bg-[#0f0f11] flex items-center justify-center p-4 z-50 select-none">
      <div className={`w-full max-w-xl ${isMeet ? 'bg-[#202124] border-[#3c4043]' : 'bg-zinc-900 border-zinc-800'} border rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-colors max-h-[95vh] overflow-y-auto`}>
        
        {/* Header with Mode Switcher */}
        <div className={`p-4 ${isMeet ? 'bg-[#1f1f1f] border-[#3c4043]' : 'bg-zinc-950 border-zinc-800'} border-b flex items-center justify-between`}>
          <div className="flex items-center gap-2.5">
            {isMeet ? (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 via-yellow-400 to-red-500 p-0.5 flex items-center justify-center shadow-xs">
                <div className="w-full h-full bg-[#202124] rounded-[5px] flex items-center justify-center">
                  <Video className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                Z
              </div>
            )}
            <div>
              <span className="text-xs font-bold text-white block">
                {isMeet ? 'Google Meet Live Simulator' : 'Zoom Workplace Live Simulator'}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                {isMeet ? `meet.google.com/${meetCode}` : `Meeting ID: ${initialMeetingId}`}
              </span>
            </div>
          </div>

          {/* Platform Toggle Pills */}
          <div className="flex items-center p-0.5 rounded-full bg-black/60 border border-zinc-700 shadow-inner">
            <button
              type="button"
              onClick={() => setPlatform('zoom')}
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
              onClick={() => setPlatform('meet')}
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

        {/* Tab Navigation: Quick Join vs Direct Link Join */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/60 px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('quick')}
            className={`pb-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'quick'
                ? (isMeet ? 'border-emerald-500 text-emerald-400' : 'border-blue-500 text-blue-400')
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Instant Meeting Preview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('direct_link')}
            className={`pb-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'direct_link'
                ? (isMeet ? 'border-emerald-500 text-emerald-400' : 'border-blue-500 text-blue-400')
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Join Any Link / ID (Custom Members)</span>
          </button>
        </div>

        {/* Main Body Content */}
        <div className="p-5 flex flex-col items-center">
          {/* Video Preview Frame */}
          <div className={`relative w-full aspect-video ${isMeet ? 'bg-[#171717] border-[#3c4043] rounded-2xl' : 'bg-zinc-950 border-zinc-800 rounded-xl'} overflow-hidden border shadow-inner flex items-center justify-center mb-4`}>
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
                  {videoType === 'webcam' ? 'Live Webcam Feed' : 'Simulated Video Feed'}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <User className="w-7 h-7 text-zinc-500" />
                </div>
                <span className="text-xs text-zinc-400">Camera is turned off</span>
              </div>
            )}

            {/* Bottom Preview Overlay */}
            <div className="absolute bottom-2 inset-x-2 flex items-center justify-between px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-xl text-xs">
              <span className="text-[11px] text-zinc-200 font-medium truncate">
                {name || 'Alex Rivera (You)'}
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

          {/* Form */}
          <form onSubmit={handleJoin} className="w-full space-y-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Your Display Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className={`w-full ${isMeet ? 'bg-[#171717] border-[#3c4043] focus:border-emerald-500' : 'bg-zinc-950 border-zinc-700 focus:border-blue-500'} border rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none`}
              />
            </div>

            {/* Direct Link Fields (Shown if direct_link tab active) */}
            {activeTab === 'direct_link' && (
              <div className="space-y-3 pt-1 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center justify-between">
                    <span>Meeting Link or Meeting ID / Code</span>
                    <span className="text-[10px] text-zinc-400 font-normal">Auto-detects platform</span>
                  </label>
                  <input
                    type="text"
                    placeholder={
                      platform === 'meet'
                        ? 'e.g. https://meet.google.com/abc-defg-hij or prj-team-sync'
                        : 'e.g. https://zoom.us/j/98429014482 or 984 2901 4482'
                    }
                    value={meetingUrlOrId}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className={`w-full ${isMeet ? 'bg-[#171717] border-[#3c4043] focus:border-emerald-500' : 'bg-zinc-950 border-zinc-700 focus:border-blue-500'} border rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none font-mono`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Meeting Topic / Agenda Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Q3 Executive Business Strategy, Investor Townhall..."
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    className={`w-full ${isMeet ? 'bg-[#171717] border-[#3c4043] focus:border-emerald-500' : 'bg-zinc-950 border-zinc-700 focus:border-blue-500'} border rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none`}
                  />
                </div>
              </div>
            )}

            {/* Attendee Volume Multiplier */}
            <div className={`p-3 ${isMeet ? 'bg-[#171717]/80 border-[#3c4043]' : 'bg-zinc-950/70 border-zinc-800'} rounded-xl border space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  Total Meeting Attendees (बढ़ाएं जितने चाहें):
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

            {/* Camera Source Selector */}
            <div className={`flex items-center justify-between p-2.5 ${isMeet ? 'bg-[#171717]/80 border-[#3c4043]' : 'bg-zinc-950/60 border-zinc-800'} rounded-lg border text-xs`}>
              <span className="text-zinc-400">Camera Source:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setVideoType('avatar')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    videoType === 'avatar' 
                      ? (isMeet ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white')
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  Simulated Video
                </button>
                <button
                  type="button"
                  onClick={() => setVideoType('webcam')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    videoType === 'webcam' 
                      ? (isMeet ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white')
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  Live Webcam
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-2.5 ${
                isMeet 
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20' 
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
              } text-white rounded-xl font-bold text-xs shadow-lg transition-all active:scale-[0.99] mt-2 flex items-center justify-center gap-2`}
            >
              <span>Join {isMeet ? 'Google Meet' : 'Zoom Meeting'} ({memberCount} Attendees)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
