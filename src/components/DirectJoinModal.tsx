import { useState, FormEvent } from 'react';
import { 
  X, 
  Link2, 
  Video, 
  Users, 
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { MeetingPlatform } from '../types';
import { zoomSounds } from '../utils/soundEffects';

interface DirectJoinModalProps {
  currentPlatform: MeetingPlatform;
  currentTopic: string;
  currentParticipantCount: number;
  onDirectJoin: (params: {
    platform: MeetingPlatform;
    meetingIdOrCode: string;
    topic: string;
    passcode?: string;
    targetAttendeeCount: number;
  }) => void;
  onClose: () => void;
}

export default function DirectJoinModal({
  currentPlatform,
  currentTopic,
  currentParticipantCount,
  onDirectJoin,
  onClose,
}: DirectJoinModalProps) {
  const [meetingUrlOrId, setMeetingUrlOrId] = useState('');
  const [topic, setTopic] = useState(currentTopic || 'Executive Strategy & Global Sync');
  const [passcode, setPasscode] = useState('');
  const [platform, setPlatform] = useState<MeetingPlatform>(currentPlatform);
  const [memberCount, setMemberCount] = useState<number>(
    currentParticipantCount >= 100 ? currentParticipantCount : 100
  );
  const [detectedType, setDetectedType] = useState<'meet' | 'zoom' | null>(null);

  // Auto-detect platform and meeting ID/code when user pastes a URL
  const handleUrlChange = (value: string) => {
    setMeetingUrlOrId(value);
    const trimmed = value.trim().toLowerCase();

    // Google Meet format: meet.google.com/xxx-yyyy-zzz or xxx-yyyy-zzz
    if (trimmed.includes('meet.google.com') || /^[a-z]{3}-[a-z]{4}-[a-z]{3}$/i.test(value.trim())) {
      setPlatform('meet');
      setDetectedType('meet');
    } 
    // Zoom format: zoom.us/j/1234567890 or us04web.zoom.us/j/... or digits
    else if (trimmed.includes('zoom.us') || trimmed.includes('/j/') || /^\d{9,11}$/.test(trimmed.replace(/\s+/g, ''))) {
      setPlatform('zoom');
      setDetectedType('zoom');
      const pwdMatch = value.match(/pwd=([^&]+)/);
      if (pwdMatch && pwdMatch[1]) {
        setPasscode(pwdMatch[1]);
      }
    } else if (value.length > 0) {
      setDetectedType(platform);
    } else {
      setDetectedType(null);
    }
  };

  const handleQuickPresetUrl = (presetPlatform: MeetingPlatform, sampleUrl: string, sampleTopic: string) => {
    setPlatform(presetPlatform);
    setDetectedType(presetPlatform);
    setMeetingUrlOrId(sampleUrl);
    setTopic(sampleTopic);
  };

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();

    let cleanId = meetingUrlOrId.trim();
    if (cleanId.includes('meet.google.com/')) {
      cleanId = cleanId.split('meet.google.com/')[1].split('?')[0].split('/')[0];
    } else if (cleanId.includes('/j/')) {
      const match = cleanId.match(/\/j\/(\d+)/);
      if (match) cleanId = match[1];
    }

    if (!cleanId) {
      cleanId = platform === 'meet' ? 'abc-defg-hij' : '984 2901 4482';
    }

    if (platform === 'meet') {
      zoomSounds.playMeetJoinChime();
    } else {
      zoomSounds.playJoinChime();
    }

    onDirectJoin({
      platform,
      meetingIdOrCode: cleanId,
      topic: topic.trim() || 'Global Meeting',
      passcode: passcode.trim(),
      targetAttendeeCount: memberCount || 100,
    });
    onClose();
  };

  return (
    <div id="direct-join-modal" className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in select-none">
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col text-zinc-100">
        {/* Header */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Link2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white flex items-center gap-2">
                Join Any Google Meet or Zoom Meeting
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                  Unlimited Attendees
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400">
                Paste any meeting link or ID to immediately enter the live room.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[80vh] text-xs">
          {/* Platform Switcher */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Select Target Platform
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setPlatform('zoom');
                  setDetectedType('zoom');
                }}
                className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 font-semibold transition-all ${
                  platform === 'zoom'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-1 ring-blue-400'
                    : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="w-4 h-4 rounded bg-white text-blue-600 flex items-center justify-center font-bold text-[10px]">
                  Z
                </div>
                <span>Zoom Meeting</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPlatform('meet');
                  setDetectedType('meet');
                }}
                className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 font-semibold transition-all ${
                  platform === 'meet'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-1 ring-emerald-400'
                    : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Video className="w-4 h-4 text-white" />
                <span>Google Meet</span>
              </button>
            </div>
          </div>

          {/* Meeting Link or ID input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Paste Meeting Link or ID:</span>
              </label>
              {detectedType && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" />
                  {detectedType === 'meet' ? 'Google Meet Link' : 'Zoom Link'}
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder={
                  platform === 'meet'
                    ? 'e.g. https://meet.google.com/abc-defg-hij or prj-team-sync'
                    : 'e.g. https://zoom.us/j/98429014482 or 984 2901 4482'
                }
                value={meetingUrlOrId}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Meeting Topic */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Meeting Title / Agenda (Topic)
            </label>
            <input
              type="text"
              placeholder="e.g. Global Tech Townhall, Q3 Business Review, Class Lecture..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Passcode (Optional for Zoom) */}
          {platform === 'zoom' && (
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Passcode / Encryption Key (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 849201"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          )}

          {/* Attendee Multiplier Selection */}
          <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                Select Attendee Volume for this Meeting
              </label>
              <span className="text-xs font-bold text-blue-400 font-mono">
                {memberCount} Attendees
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[50, 100, 250, 500].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setMemberCount(count)}
                  className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                    memberCount === count
                      ? 'bg-blue-600/30 border-blue-500 text-white font-bold shadow-xs'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <span className="block text-xs">{count} Users</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Preset Scenarios */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
              Quick Sample Meeting Links
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  handleQuickPresetUrl(
                    'zoom',
                    'https://zoom.us/j/94820194481?pwd=apex2026',
                    'Global All-Hands & Executive Strategy'
                  )
                }
                className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-0.5">
                  <span>🟦 Zoom Global All-Hands</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono truncate block">
                  zoom.us/j/94820194481
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickPresetUrl(
                    'meet',
                    'https://meet.google.com/prj-core-sync',
                    'Project Architecture & Cloud Engineering'
                  )
                }
                className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-0.5">
                  <span>📹 Google Meet Engineering Sync</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono truncate block">
                  meet.google.com/prj-core-sync
                </span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                platform === 'meet'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
              }`}
            >
              <span>Join Meeting Now ({memberCount} Users)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
