import React from 'react';
import { 
  Users, 
  Zap, 
  Pause, 
  Play, 
  FastForward, 
  CheckCircle2, 
  X,
  Volume2
} from 'lucide-react';

interface LiveStreamHUDProps {
  currentCount: number;
  targetCount: number;
  isStreaming: boolean;
  isPaused: boolean;
  speed: 'normal' | 'fast' | 'slow';
  lastJoinedName?: string;
  onInstantComplete: () => void;
  onTogglePause: () => void;
  onChangeSpeed: (speed: 'normal' | 'fast' | 'slow') => void;
  onStop: () => void;
}

export default function LiveStreamHUD({
  currentCount,
  targetCount,
  isStreaming,
  isPaused,
  speed,
  lastJoinedName,
  onInstantComplete,
  onTogglePause,
  onChangeSpeed,
  onStop,
}: LiveStreamHUDProps) {
  if (!isStreaming) return null;

  const percent = Math.min(100, Math.round((currentCount / Math.max(1, targetCount)) * 100));

  return (
    <div 
      id="live-stream-hud"
      className="absolute top-14 sm:top-16 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-xl animate-bounce-short select-none"
    >
      <div className="bg-zinc-950/90 backdrop-blur-md border border-emerald-500/60 rounded-2xl p-2.5 sm:p-3 shadow-2xl text-white flex flex-col gap-2">
        {/* Top Line: Status + Progress + Close */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-emerald-300">
                  {isPaused ? 'Joining Paused' : 'Live Members Joining One-by-One...'}
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded font-mono font-bold">
                  {currentCount} / {targetCount} Attendees ({percent}%)
                </span>
              </div>
              {lastJoinedName && (
                <p className="text-[11px] text-zinc-300 truncate font-medium">
                  👋 <span className="text-white font-semibold">{lastJoinedName}</span> joined the call
                </p>
              )}
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Speed Toggle */}
            <button
              onClick={() => onChangeSpeed(speed === 'fast' ? 'normal' : speed === 'normal' ? 'slow' : 'fast')}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold border flex items-center gap-1 transition-all ${
                speed === 'fast'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-white'
              }`}
              title="Change joining cadence"
            >
              <FastForward className="w-3 h-3" />
              <span>{speed === 'fast' ? '3x Fast' : speed === 'normal' ? '1x Normal' : 'Slow'}</span>
            </button>

            {/* Pause / Resume */}
            <button
              onClick={onTogglePause}
              className={`p-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isPaused
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-white'
              }`}
              title={isPaused ? 'Resume joining' : 'Pause joining'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            {/* Instant Complete All */}
            <button
              onClick={onInstantComplete}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold shadow-md flex items-center gap-1 transition-transform active:scale-95"
              title="Instantly admit all remaining attendees"
            >
              <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
              <span className="hidden sm:inline">Instant All</span>
            </button>

            {/* Stop Stream */}
            <button
              onClick={onStop}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Dismiss HUD"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dynamic Animated Progress Line */}
        <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
