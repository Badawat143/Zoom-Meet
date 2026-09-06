import { useState } from 'react';
import { 
  X, 
  Users, 
  UserPlus, 
  Sparkles, 
  Sliders, 
  Play, 
  Pause, 
  Check, 
  Copy, 
  Flame, 
  Zap,
  Volume2,
  Hand,
  Camera
} from 'lucide-react';
import { zoomSounds } from '../utils/soundEffects';

interface MassJoinModalProps {
  currentCount: number;
  onSetTotalCount: (count: number) => void;
  onAddUsers: (count: number) => void;
  onClose: () => void;
  isStreamJoining: boolean;
  onToggleStreamJoining: () => void;
  onMassHandRaise?: (count: number) => void;
}

export default function MassJoinModal({
  currentCount,
  onSetTotalCount,
  onAddUsers,
  onClose,
  isStreamJoining,
  onToggleStreamJoining,
  onMassHandRaise,
}: MassJoinModalProps) {
  const [targetCount, setTargetCount] = useState<number>(currentCount >= 100 ? currentCount : 100);
  const [copiedLink, setCopiedLink] = useState(false);

  const presetCounts = [
    { count: 100, label: '100 Users', badge: 'Recommended', desc: 'Full Enterprise All-Hands' },
    { count: 250, label: '250 Users', badge: 'Popular', desc: 'Global Townhall Meeting' },
    { count: 500, label: '500 Users', badge: 'Mega', desc: 'Annual Tech Keynote' },
    { count: 1000, label: '1,000 Users', badge: 'Maximum', desc: 'Virtual Stadium Webinar' },
  ];

  const handleApplyPreset = (count: number) => {
    setTargetCount(count);
    onSetTotalCount(count);
    zoomSounds.playJoinChime();
  };

  const handleApplyCustom = () => {
    if (targetCount > 0) {
      onSetTotalCount(targetCount);
      zoomSounds.playJoinChime();
    }
  };

  const handleAddBatch = (batch: number) => {
    onAddUsers(batch);
    zoomSounds.playJoinChime();
  };

  const handleCopy100UserLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('users', String(targetCount || 100));
    navigator.clipboard?.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 select-none animate-fade-in">
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col text-zinc-100 max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                Mass Attendee Joiner & Controller
                <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono">
                  Current: {currentCount}
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Instantly simulate 100 to 1,000+ realistic attendees with animated cameras, audio, and profiles.
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

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Quick 100+ One-Click Presets */}
          <div>
            <label className="block text-xs font-semibold text-zinc-200 mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              One-Click Target Attendee Presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {presetCounts.map((p) => {
                const isActive = currentCount === p.count;
                return (
                  <button
                    key={p.count}
                    onClick={() => handleApplyPreset(p.count)}
                    className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      isActive
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-md ring-1 ring-blue-500'
                        : 'bg-zinc-950/70 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-white">{p.label}</span>
                        <span className="text-[9px] bg-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded font-mono">
                          {p.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-tight">{p.desc}</p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-semibold text-blue-400">
                      <span>{isActive ? 'Active' : 'Set to ' + p.count}</span>
                      <Sparkles className="w-3 h-3" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Incremental Add */}
          <div>
            <label className="block text-xs font-semibold text-zinc-200 mb-2 flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5 text-blue-400" />
              Quick Add More Attendees
            </label>
            <div className="flex flex-wrap gap-2">
              {[+10, +25, +50, +100, +200].map((num) => (
                <button
                  key={num}
                  onClick={() => handleAddBatch(num)}
                  className="px-3 py-2 bg-zinc-800 hover:bg-blue-600 text-zinc-200 hover:text-white rounded-lg border border-zinc-700 font-semibold transition-colors flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5 text-blue-400" />
                  <span>+{num} Users</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Slider / Input */}
          <div className="p-3.5 bg-zinc-950/80 rounded-xl border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                Custom Attendee Count (1 – 1,000)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="2"
                  max="1000"
                  value={targetCount}
                  onChange={(e) => setTargetCount(Math.max(2, Math.min(1000, Number(e.target.value) || 2)))}
                  className="w-20 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white font-mono text-center focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleApplyCustom}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold shadow-sm transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={targetCount}
              onChange={(e) => setTargetCount(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>10 Users</span>
              <span>100 (Default)</span>
              <span>250</span>
              <span>500</span>
              <span>1,000 Users</span>
            </div>
          </div>

          {/* Continuous Auto-Joining Mode */}
          <div className="flex items-center justify-between p-3.5 bg-zinc-950/60 rounded-xl border border-zinc-800">
            <div className="pr-4">
              <span className="font-semibold text-zinc-200 block text-xs">
                Live Auto-Stream Join Mode
              </span>
              <span className="text-[11px] text-zinc-400">
                Simulates real-time attendee joins every 1.5 seconds with join sounds and visual alerts.
              </span>
            </div>
            <button
              onClick={onToggleStreamJoining}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                isStreamJoining
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
              }`}
            >
              {isStreamJoining ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Stop Stream
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400" /> Start Stream
                </>
              )}
            </button>
          </div>

          {/* Interactive Batch Effects */}
          {onMassHandRaise && (
            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-zinc-200 block text-xs">
                  Simulate Mass Audience Actions
                </span>
                <span className="text-[11px] text-zinc-400">
                  Make 20 attendees raise hands simultaneously for Q&A.
                </span>
              </div>
              <button
                onClick={() => onMassHandRaise(20)}
                className="px-3 py-1.5 bg-amber-600/30 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Hand className="w-3.5 h-3.5" /> 20 Hand Raises
              </button>
            </div>
          )}

          {/* Direct Shareable Link Generator */}
          <div className="p-3 bg-blue-950/30 rounded-xl border border-blue-800/40 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="font-semibold text-blue-300 block text-xs">
                Direct Link (Auto-loads {targetCount || 100} Users)
              </span>
              <span className="text-[10px] text-zinc-400 truncate block font-mono">
                {window.location.origin}/?users={targetCount || 100}
              </span>
            </div>
            <button
              onClick={handleCopy100UserLink}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Done & Return to Meeting
          </button>
        </div>
      </div>
    </div>
  );
}
