import React, { useState, useEffect, useRef } from 'react';
import { Participant } from '../types';
import { 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  Volume2, 
  Bot, 
  User, 
  ChevronDown, 
  ChevronUp, 
  Search,
  Radio,
  HelpCircle,
  X
} from 'lucide-react';
import { createSpeechRecognizer } from '../utils/voiceSynthesis';

interface MemberVoiceQAControllerProps {
  participants: Participant[];
  currentUserId: string;
  isSpeaking: boolean;
  activeSpeakerName?: string;
  onAskMember: (memberId: string, question: string) => void;
  onVoiceCallDetected: (transcript: string) => void;
}

export default function MemberVoiceQAController({
  participants,
  currentUserId,
  isSpeaking,
  activeSpeakerName,
  onAskMember,
  onVoiceCallDetected,
}: MemberVoiceQAControllerProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [questionInput, setQuestionInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [searchMember, setSearchMember] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [speechLang, setSpeechLang] = useState<'en-US' | 'hi-IN'>('en-US');
  const recognizerRef = useRef<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const availableMembers = participants.filter((p) => p.id !== currentUserId);

  // Set default selected member to first key speaker or leader
  useEffect(() => {
    if (!selectedMemberId && availableMembers.length > 0) {
      setSelectedMemberId(availableMembers[0].id);
    }
  }, [availableMembers, selectedMemberId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedMember = participants.find((p) => p.id === selectedMemberId) || availableMembers[0];

  const handleStartListening = () => {
    if (isListening) {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setVoiceTranscript(transcript);
        onVoiceCallDetected(transcript);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      },
      (error) => {
        console.warn('Speech recognition notice:', error);
        setIsListening(false);
      },
      speechLang
    );

    if (recognizer) {
      recognizerRef.current = recognizer;
      try {
        recognizer.start();
        setIsListening(true);
        setVoiceTranscript('Listening... Speak now (e.g. "Jessica, what is our goal?" or "मार्कस, क्या स्थिति है?")');
      } catch (err) {
        console.warn('Failed to start recognizer:', err);
        setIsListening(false);
      }
    } else {
      alert('Speech Recognition is not supported in this browser. You can type your question in the box below!');
    }
  };

  const handleAskSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!questionInput.trim() || !selectedMemberId) return;

    onAskMember(selectedMemberId, questionInput.trim());
    setQuestionInput('');
  };

  const QUICK_PROMPTS = [
    { label: '📊 Status Update', text: 'Can you give us a quick status update on your team\'s progress?' },
    { label: '💰 Budget & Timeline', text: 'What is the projected budget and timeline for this phase?' },
    { label: '🚀 Deployment Health', text: 'How is the latest deployment performing in production?' },
    { label: '🇮🇳 क्या स्थिति है?', text: 'प्रोजेक्ट का काम कहां तक पहुंचा है और क्या स्थिति है?' },
    { label: '🇮🇳 बजट क्या है?', text: 'इस प्रोजेक्ट का अनुमानित बजट और समयसीमा क्या है?' },
  ];

  const filteredMembers = availableMembers.filter(
    (p) =>
      p.name.toLowerCase().includes(searchMember.toLowerCase()) ||
      (p.role && p.role.toLowerCase().includes(searchMember.toLowerCase()))
  );

  return (
    <div
      id="member-voice-qa-controller"
      className="fixed top-14 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-2xl bg-zinc-900/95 border border-zinc-700/80 rounded-xl shadow-2xl backdrop-blur-xl transition-all duration-300 text-zinc-200"
    >
      {/* Top Banner Strip */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-zinc-800/80 bg-zinc-950/50 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <span className="text-xs font-semibold text-white tracking-wide">
            Interactive AI Member Q&A (100+ Members)
          </span>
          <span className="hidden sm:inline-flex text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30 font-medium">
            Distinct Female & Male Voices
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Currently Talking Indicator */}
          {isSpeaking && activeSpeakerName && (
            <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-600/60 px-2 py-0.5 rounded text-[11px] text-emerald-300 font-medium animate-pulse mr-1">
              <Volume2 className="w-3 h-3 text-emerald-400" />
              <span>{activeSpeakerName} is speaking...</span>
            </div>
          )}

          {/* Toggle Expand/Collapse */}
          <button
            id="toggle-qa-controller-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title={isExpanded ? 'Minimize Q&A Bar' : 'Expand Q&A Bar'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-3 space-y-2.5">
          {/* Control Bar: Live Mic Talk Button + Member Selector */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            {/* Live Mic Voice Button */}
            <button
              id="voice-talk-to-member-btn"
              onClick={handleStartListening}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 shadow-sm ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-rose-600/30 shadow-lg'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
              }`}
              title="Speak to any member by name via microphone"
            >
              {isListening ? <Mic className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4" />}
              <span>{isListening ? 'Listening... Speak Now' : '🎙️ Talk / Call Member by Voice'}</span>
            </button>

            {/* Language Selector for STT */}
            <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-lg p-0.5 text-[10px] shrink-0">
              <button
                type="button"
                onClick={() => setSpeechLang('en-US')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  speechLang === 'en-US' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setSpeechLang('hi-IN')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  speechLang === 'hi-IN' ? 'bg-orange-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Member Selector Dropdown */}
            <div className="relative flex-1 min-w-[200px]" ref={dropdownRef}>
              <button
                id="select-member-dropdown-btn"
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 rounded-lg px-2.5 py-1.5 flex items-center justify-between text-xs text-zinc-100 transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  {selectedMember && (
                    <img
                      src={selectedMember.avatarUrl}
                      alt={selectedMember.name}
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded-full object-cover shrink-0"
                    />
                  )}
                  <span className="font-medium truncate">
                    Ask: {selectedMember ? selectedMember.name : 'Choose Member'}
                  </span>
                  {selectedMember && (
                    <span className="text-[10px] text-zinc-400 shrink-0">
                      ({selectedMember.gender === 'female' ? '👩 Female Voice' : '👨 Male Voice'})
                    </span>
                  )}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 ml-1.5 shrink-0" />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full mt-1 left-0 right-0 max-h-60 bg-zinc-850 border border-zinc-700 rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col">
                  {/* Search box */}
                  <div className="p-2 border-b border-zinc-700/80 bg-zinc-900 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Search member or role..."
                      value={searchMember}
                      onChange={(e) => setSearchMember(e.target.value)}
                      className="w-full bg-transparent text-xs text-white focus:outline-none placeholder-zinc-500"
                      autoFocus
                    />
                  </div>

                  {/* List of members */}
                  <div className="overflow-y-auto max-h-48 divide-y divide-zinc-800">
                    {filteredMembers.map((member) => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => {
                          setSelectedMemberId(member.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-zinc-750 transition-colors ${
                          selectedMemberId === member.id ? 'bg-blue-600/20 text-blue-300' : 'text-zinc-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            referrerPolicy="no-referrer"
                            className="w-5 h-5 rounded-full object-cover shrink-0"
                          />
                          <div className="truncate">
                            <span className="font-semibold">{member.name}</span>
                            {member.role && (
                              <span className="text-[10px] text-zinc-400 block truncate">{member.role}</span>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 shrink-0 ml-2">
                          {member.gender === 'female' ? '👩 Female' : '👨 Male'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Voice Recognition Live Feedback */}
          {voiceTranscript && (
            <div className="bg-zinc-950/80 border border-emerald-500/40 rounded-lg p-2 text-xs text-emerald-300 flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{voiceTranscript}</span>
              </div>
              <button
                onClick={() => setVoiceTranscript('')}
                className="text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Direct Question Form */}
          <form onSubmit={handleAskSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              placeholder={`Ask ${selectedMember?.name || 'this member'} anything (e.g., "What is the update?", "बजट क्या है?")...`}
              className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              id="send-question-to-member-btn"
              type="submit"
              disabled={!questionInput.trim()}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <span>Ask & Unmute</span>
              <Send className="w-3 h-3" />
            </button>
          </form>

          {/* Quick Clickable Suggestions */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
            <span className="text-[10px] text-zinc-500 shrink-0 font-medium">Quick ask:</span>
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (selectedMemberId) {
                    onAskMember(selectedMemberId, prompt.text);
                  }
                }}
                className="whitespace-nowrap px-2 py-1 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-[10px] border border-zinc-700/60 transition-colors shrink-0"
              >
                {prompt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
