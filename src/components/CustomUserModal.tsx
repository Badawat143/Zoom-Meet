import { useState, FormEvent } from 'react';
import { Participant, ParticipantBehavior } from '../types';
import { X, UserPlus, Sparkles, Zap, Camera, Mic, Upload } from 'lucide-react';

interface CustomUserModalProps {
  onAddParticipant: (p: Participant) => void;
  onClose: () => void;
  onOpenMassJoin?: () => void;
}

const AVATAR_PRESETS = [
  { label: 'Executive Man', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { label: 'Tech Woman', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
  { label: 'Engineer Guy', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
  { label: 'Creative Designer', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { label: 'Cat Lawyer', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop&q=80' },
  { label: 'Senior Lead', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80' },
];

export default function CustomUserModal({
  onAddParticipant,
  onClose,
  onOpenMassJoin,
}: CustomUserModalProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_PRESETS[1].url);
  const [behavior, setBehavior] = useState<ParticipantBehavior>('nodder');
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newParticipant: Participant = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      gender: gender,
      voicePitch: gender === 'female' ? 1.15 : 0.9,
      voiceRate: 1.0,
      expertise: role.trim() || 'General Attendee',
      role: role.trim() || 'Attendee',
      avatarUrl: avatarUrl,
      videoType: 'preset_video',
      isVideoOn: isVideoOn,
      isMuted: isMuted,
      isSpeaking: false,
      isHandRaised: false,
      isHost: false,
      connectionQuality: 'excellent',
      audioLevel: 0,
      behavior: behavior,
      speechScript: [
        `Thanks for having me, completely agree on the roadmap goals.`,
        `Let’s make sure we follow up in Slack afterwards.`,
        `Alex, would love to hear your perspective on this.`
      ]
    };

    onAddParticipant(newParticipant);
    onClose();
  };

  return (
    <div id="custom-user-modal" className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-zinc-100">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-800/80 border-b border-zinc-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">Add Custom Fake Zoom Attendee</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mass Join Banner */}
        {onOpenMassJoin && (
          <div className="mx-6 mt-4 p-3 bg-gradient-to-r from-blue-950/70 to-indigo-950/70 border border-blue-600/40 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-300 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-white block">Need 100+ Attendees Instantly?</span>
                <span className="text-zinc-400 text-[11px]">Use Mass Join to load 100, 250, 500+ users in 1 click.</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenMassJoin();
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shrink-0 transition-colors shadow-xs"
            >
              Open Mass Join
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Attendee Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Elon Musk, Satya Nadella, Sarah Connor..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Job Title / Company
            </label>
            <input
              type="text"
              placeholder="e.g. VP of Artificial Intelligence, Google"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Gender & Voice Profile */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Voice & Gender Profile (for AI Voice Q&A)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  gender === 'female'
                    ? 'bg-rose-600/20 border-rose-500 text-rose-300 font-bold'
                    : 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:text-white'
                }`}
              >
                <span>👩 Female Voice Profile</span>
              </button>
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  gender === 'male'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                    : 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:text-white'
                }`}
              >
                <span>👨 Male Voice Profile</span>
              </button>
            </div>
          </div>

          {/* Avatar Preset Selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Select Avatar Portrait
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatarUrl(preset.url)}
                  className={`relative aspect-square rounded-full overflow-hidden border-2 transition-all ${
                    avatarUrl === preset.url
                      ? 'border-blue-500 scale-105 ring-2 ring-blue-500/40'
                      : 'border-zinc-700 hover:border-zinc-500 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Behavior Preset */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Simulated Behavior / Animation
            </label>
            <select
              value={behavior}
              onChange={(e) => setBehavior(e.target.value as ParticipantBehavior)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="nodder">Nodding & Attentive (Classic Agreeable Attendee)</option>
              <option value="talkative">Talkative Leader (Frequent Interrupter)</option>
              <option value="distracted">Distracted / Looking at Second Monitor</option>
              <option value="eater">Secretly Eating Snacks / Chips</option>
              <option value="cat_filter">Cat Filter Glitch ("I am not a cat!")</option>
              <option value="sleeping">Sleeping with Head Slumped</option>
              <option value="quiet">Quiet Observer</option>
            </select>
          </div>

          {/* Initial States */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <label className="flex items-center gap-2 p-2.5 bg-zinc-800/60 rounded-lg border border-zinc-700/60 cursor-pointer hover:bg-zinc-800">
              <input
                type="checkbox"
                checked={!isMuted}
                onChange={(e) => setIsMuted(!e.target.checked)}
                className="rounded bg-zinc-900 border-zinc-700 text-blue-600 focus:ring-0"
              />
              <span className="text-xs text-zinc-200">Microphone Unmuted</span>
            </label>
            <label className="flex items-center gap-2 p-2.5 bg-zinc-800/60 rounded-lg border border-zinc-700/60 cursor-pointer hover:bg-zinc-800">
              <input
                type="checkbox"
                checked={isVideoOn}
                onChange={(e) => setIsVideoOn(e.target.checked)}
                className="rounded bg-zinc-900 border-zinc-700 text-blue-600 focus:ring-0"
              />
              <span className="text-xs text-zinc-200">Camera Enabled</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex justify-end gap-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm"
            >
              Add to Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
