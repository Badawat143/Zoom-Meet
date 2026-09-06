import { useState, FormEvent } from 'react';
import { Video, VideoOff, Mic, MicOff, Settings, Sparkles, Shield, User, Zap } from 'lucide-react';
import { MeetingPlatform } from '../types';
import { zoomSounds } from '../utils/soundEffects';

interface MeetingJoinPreviewProps {
  topic: string;
  meetingId: string;
  meetCode?: string;
  initialName: string;
  initialPlatform?: MeetingPlatform;
  onJoinMeeting: (name: string, isMuted: boolean, isVideoOn: boolean, videoType: 'webcam' | 'avatar', platform: MeetingPlatform) => void;
}

export default function MeetingJoinPreview({
  topic,
  meetingId,
  meetCode = 'abc-defg-hij',
  initialName,
  initialPlatform = 'zoom',
  onJoinMeeting,
}: MeetingJoinPreviewProps) {
  const [name, setName] = useState(initialName);
  const [platform, setPlatform] = useState<MeetingPlatform>(initialPlatform);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [videoType, setVideoType] = useState<'webcam' | 'avatar'>('avatar');

  const handleJoin = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (platform === 'meet') {
      zoomSounds.playMeetJoinChime();
    } else {
      zoomSounds.playJoinChime();
    }
    onJoinMeeting(name.trim(), isMuted, isVideoOn, videoType, platform);
  };

  const isMeet = platform === 'meet';

  return (
    <div className="fixed inset-0 bg-[#111111] flex items-center justify-center p-4 z-50 select-none">
      <div className={`w-full max-w-lg ${isMeet ? 'bg-[#202124] border-[#3c4043]' : 'bg-zinc-900 border-zinc-800'} border rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-colors`}>
        {/* Header with Platform Selector */}
        <div className={`p-4 ${isMeet ? 'bg-[#1f1f1f] border-[#3c4043]' : 'bg-zinc-950/80 border-zinc-800'} border-b flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            {isMeet ? (
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 via-yellow-400 to-red-500 p-0.5 flex items-center justify-center shadow-xs">
                <div className="w-full h-full bg-[#202124] rounded-[5px] flex items-center justify-center">
                  <Video className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            ) : (
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                Z
              </div>
            )}
            <div>
              <span className="text-xs font-bold text-white block">
                {isMeet ? 'Google Meet Simulator' : 'Zoom Workplace Simulator'}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                {isMeet ? `meet.google.com/${meetCode}` : `ID: ${meetingId}`}
              </span>
            </div>
          </div>

          {/* Platform Toggle Tabs */}
          <div className="flex items-center p-0.5 rounded-full bg-black/50 border border-zinc-700 shadow-inner">
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

        {/* Video Preview Box */}
        <div className="p-6 flex flex-col items-center">
          <div className={`relative w-full aspect-video ${isMeet ? 'bg-[#171717] border-[#3c4043] rounded-2xl' : 'bg-zinc-950 border-zinc-800 rounded-xl'} overflow-hidden border shadow-inner flex items-center justify-center mb-4`}>
            {isVideoOn ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
                  alt="You"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-zinc-300">
                  {videoType === 'webcam' ? 'Webcam Preview' : 'Avatar Loop Preview'}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <User className="w-8 h-8 text-zinc-500" />
                </div>
                <span className="text-xs text-zinc-400">The camera is turned off</span>
              </div>
            )}

            {/* Bottom Preview Controls */}
            <div className="absolute bottom-2 inset-x-2 flex items-center justify-between px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-xl text-xs">
              <span className="text-[11px] text-zinc-200 font-medium truncate">
                {name || 'Attendee'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2 rounded-full transition-colors ${
                    isMuted ? 'bg-[#ea4335] text-white' : 'bg-zinc-800 text-zinc-300 hover:text-white'
                  }`}
                  title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`p-2 rounded-full transition-colors ${
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
                Your Display Name
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
                  Simulated Avatar
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

            <button
              type="submit"
              className={`w-full py-2.5 ${
                isMeet 
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20' 
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
              } text-white rounded-xl font-bold text-xs shadow-lg transition-all active:scale-[0.99] mt-2 flex items-center justify-center gap-2`}
            >
              <span>Join {isMeet ? 'Google Meet' : 'Zoom'} (100+ Users)</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

