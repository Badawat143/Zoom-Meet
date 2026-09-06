import { useState } from 'react';
import { X, Shapes, PenTool, HelpCircle, BarChart2, Users, ArrowRight, Check } from 'lucide-react';

interface GoogleMeetActivitiesDrawerProps {
  onClose: () => void;
}

export default function GoogleMeetActivitiesDrawer({ onClose }: GoogleMeetActivitiesDrawerProps) {
  const [activeTab, setActiveTab] = useState<'menu' | 'polls' | 'qa' | 'whiteboard'>('menu');
  const [pollVoted, setPollVoted] = useState<number | null>(null);

  return (
    <aside 
      id="google-meet-activities-drawer"
      className="w-80 h-full bg-[#202124] border-l border-[#3c4043] flex flex-col text-[#e8eaed] select-none z-30 shrink-0 animate-slide-in-right"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#3c4043] flex items-center justify-between">
        <div className="flex items-center gap-2">
          {activeTab !== 'menu' && (
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs text-[#8ab4f8] hover:underline mr-1"
            >
              ← Back
            </button>
          )}
          <h2 className="text-base font-semibold text-white">
            {activeTab === 'menu' ? 'Activities' : activeTab === 'polls' ? 'Polls' : activeTab === 'qa' ? 'Q&A' : 'Whiteboarding'}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-[#3c4043] text-[#bdc1c6] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Menu */}
      {activeTab === 'menu' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Whiteboarding */}
          <button
            onClick={() => setActiveTab('whiteboard')}
            className="w-full p-4 rounded-xl bg-[#303134] hover:bg-[#3c4043] border border-[#5f6368]/40 flex items-center gap-3 text-left transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <PenTool className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-white block">Whiteboarding</span>
              <span className="text-xs text-[#9aa0a6]">Collaborate on a digital whiteboard</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#9aa0a6]" />
          </button>

          {/* Polls */}
          <button
            onClick={() => setActiveTab('polls')}
            className="w-full p-4 rounded-xl bg-[#303134] hover:bg-[#3c4043] border border-[#5f6368]/40 flex items-center gap-3 text-left transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-white block">Polls</span>
              <span className="text-xs text-[#9aa0a6]">Give participants a voice with live voting</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#9aa0a6]" />
          </button>

          {/* Q&A */}
          <button
            onClick={() => setActiveTab('qa')}
            className="w-full p-4 rounded-xl bg-[#303134] hover:bg-[#3c4043] border border-[#5f6368]/40 flex items-center gap-3 text-left transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-white block">Q&A</span>
              <span className="text-xs text-[#9aa0a6]">Ask and upvote questions during the call</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#9aa0a6]" />
          </button>

          {/* Breakout rooms */}
          <div className="w-full p-4 rounded-xl bg-[#303134]/50 border border-[#5f6368]/20 flex items-center gap-3 text-left opacity-70">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-white block">Breakout Rooms</span>
              <span className="text-xs text-[#9aa0a6]">Split 100+ attendees into smaller discussion groups</span>
            </div>
          </div>
        </div>
      )}

      {/* Polls Tab */}
      {activeTab === 'polls' && (
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="p-4 rounded-xl bg-[#303134] border border-[#5f6368]">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              Active Live Poll • 84 votes
            </span>
            <h4 className="text-sm font-bold text-white mb-3">
              Should we adopt the 4-day sprint cycle for next quarter?
            </h4>

            <div className="space-y-2">
              {[
                { id: 1, label: 'Yes, absolutely agree', pct: 68 },
                { id: 2, label: 'Need more review', pct: 24 },
                { id: 3, label: 'Prefer current schedule', pct: 8 }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setPollVoted(opt.id)}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                    pollVoted === opt.id
                      ? 'bg-blue-600/30 border-blue-500 text-white font-bold'
                      : 'bg-[#202124] border-[#5f6368]/60 hover:border-[#8ab4f8] text-[#bdc1c6]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {pollVoted === opt.id && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    <span>{opt.label}</span>
                  </div>
                  <span className="text-[#9aa0a6] text-[11px] font-mono">{opt.pct}%</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Q&A Tab */}
      {activeTab === 'qa' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="p-3 bg-[#303134] rounded-xl border border-[#5f6368]/50 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[#9aa0a6]">
              <span className="font-semibold text-white">David Chen</span>
              <span>2 min ago</span>
            </div>
            <p className="text-xs text-[#e8eaed]">
              "Will the new API version have backward compatibility with our current mobile client?"
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-[#3c4043] text-[11px]">
              <span className="text-emerald-400 font-semibold">▲ 14 upvotes</span>
              <span className="text-[#8ab4f8]">Answered live</span>
            </div>
          </div>
        </div>
      )}

      {/* Whiteboard Tab */}
      {activeTab === 'whiteboard' && (
        <div className="flex-1 overflow-y-auto p-5 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <PenTool className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Start a new whiteboard</h4>
            <p className="text-xs text-[#9aa0a6] max-w-xs mx-auto">
              Open a collaborative Jamboard session with all 100+ participants.
            </p>
          </div>
          <button
            onClick={() => alert('Simulated Google Jamboard opened in whiteboard mode!')}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-semibold"
          >
            Start a new whiteboard
          </button>
        </div>
      )}
    </aside>
  );
}
