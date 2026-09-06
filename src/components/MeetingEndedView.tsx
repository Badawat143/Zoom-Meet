import { Video, RotateCcw, Layers, Star, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { MeetingPlatform } from '../types';

interface MeetingEndedViewProps {
  topic: string;
  durationSeconds: number;
  platform?: MeetingPlatform;
  onRejoin: (platform?: MeetingPlatform) => void;
  onOpenScenarios: () => void;
}

export default function MeetingEndedView({
  topic,
  durationSeconds,
  platform = 'zoom',
  onRejoin,
  onOpenScenarios,
}: MeetingEndedViewProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<MeetingPlatform>(platform);

  const isMeet = selectedPlatform === 'meet';

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  return (
    <div className="fixed inset-0 bg-[#0f0f10] flex items-center justify-center p-4 z-50 select-none animate-fade-in">
      <div className={`w-full max-w-md ${isMeet ? 'bg-[#202124] border-[#3c4043]' : 'bg-zinc-900 border-zinc-800'} border rounded-2xl p-6 shadow-2xl text-center text-zinc-100 flex flex-col items-center transition-colors`}>
        <div className={`w-12 h-12 rounded-full ${isMeet ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-blue-600/20 border-blue-500/30 text-blue-400'} border flex items-center justify-center mb-4`}>
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <h2 className="text-xl font-bold text-white mb-1">You Left the Call</h2>
        <p className="text-xs text-zinc-400 mb-1 font-medium">{topic}</p>
        <span className="text-[11px] text-zinc-500 mb-4 font-mono">Duration: {formatTime(durationSeconds)}</span>

        {/* Platform Selection */}
        <div className="flex items-center gap-2 mb-5 p-1 bg-black/40 rounded-full border border-zinc-700">
          <button
            onClick={() => setSelectedPlatform('zoom')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              selectedPlatform === 'zoom' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>🟦 Zoom</span>
          </button>
          <button
            onClick={() => setSelectedPlatform('meet')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              selectedPlatform === 'meet' ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>📹 Google Meet</span>
          </button>
        </div>

        {/* Meeting Rating */}
        <div className={`w-full ${isMeet ? 'bg-[#171717] border-[#3c4043]' : 'bg-zinc-950/60 border-zinc-800/80'} p-3 rounded-xl border mb-6`}>
          <span className="text-xs text-zinc-400 block mb-2 font-medium">How was the simulated call quality?</span>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-1 text-lg transition-transform hover:scale-125 ${
                  rating && star <= rating ? 'text-amber-400' : 'text-zinc-600 hover:text-amber-400'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2.5">
          <button
            onClick={() => onRejoin(selectedPlatform)}
            className={`w-full py-2.5 ${isMeet ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'} text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-colors`}
          >
            <RotateCcw className="w-4 h-4" /> Rejoin Call ({isMeet ? 'Google Meet' : 'Zoom'})
          </button>
          <button
            onClick={onOpenScenarios}
            className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-zinc-700/80 transition-colors"
          >
            <Layers className="w-4 h-4 text-blue-400" /> Switch Scenario Presets
          </button>
        </div>
      </div>
    </div>
  );
}

