import { MEETING_SCENARIOS } from '../utils/presets';
import { MeetingScenario } from '../types';
import { X, Check, Sparkles, Users, Layers } from 'lucide-react';

interface MeetingScenarioPickerModalProps {
  currentScenarioId: string;
  onSelectScenario: (scenario: MeetingScenario) => void;
  onClose: () => void;
}

export default function MeetingScenarioPickerModal({
  currentScenarioId,
  onSelectScenario,
  onClose,
}: MeetingScenarioPickerModalProps) {
  return (
    <div id="scenario-picker-modal" className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl text-zinc-100">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-800/80 border-b border-zinc-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-base font-bold text-white">Select Fake Zoom Scenario Preset</h2>
              <p className="text-xs text-zinc-400">Load authentic participants, topics, chat dialogues, and screen shares</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenarios Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[60vh] overflow-y-auto">
          {MEETING_SCENARIOS.map((scenario) => {
            const isSelected = currentScenarioId === scenario.id;
            return (
              <div
                key={scenario.id}
                onClick={() => {
                  onSelectScenario(scenario);
                  onClose();
                }}
                className={`group relative p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20'
                    : 'bg-zinc-800/60 hover:bg-zinc-800 border-zinc-700/80 hover:border-zinc-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-700 text-zinc-300">
                      {scenario.badge}
                    </span>
                    {isSelected && (
                      <span className="text-xs font-semibold text-blue-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Active
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors mb-1">
                    {scenario.name}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mb-3">
                    {scenario.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-700/60 flex items-center justify-between text-[11px] text-zinc-400">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{scenario.participants.length} attendees</span>
                  </div>
                  <span className="text-zinc-500 font-mono">ID: {scenario.meetingId}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-zinc-950 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
