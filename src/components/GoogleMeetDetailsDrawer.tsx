import { useState } from 'react';
import { X, Copy, Check, Link, Phone, FileText, Info } from 'lucide-react';

interface GoogleMeetDetailsDrawerProps {
  meetCode: string;
  topic: string;
  onClose: () => void;
}

export default function GoogleMeetDetailsDrawer({
  meetCode,
  topic,
  onClose,
}: GoogleMeetDetailsDrawerProps) {
  const [copied, setCopied] = useState(false);

  const fullLink = `https://meet.google.com/${meetCode}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(fullLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside 
      id="google-meet-details-drawer"
      className="w-80 h-full bg-[#202124] border-l border-[#3c4043] flex flex-col text-[#e8eaed] select-none z-30 shrink-0 animate-slide-in-right"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#3c4043] flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">Meeting details</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-[#3c4043] text-[#bdc1c6] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Joining info */}
        <div>
          <h3 className="text-xs font-semibold text-[#9aa0a6] uppercase tracking-wider mb-2">
            Joining info
          </h3>
          <p className="text-sm font-medium text-white mb-2">{topic}</p>
          <p className="text-xs text-[#8ab4f8] font-mono mb-3 select-all">{fullLink}</p>
          
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-[#303134] hover:bg-[#3c4043] text-[#8ab4f8] hover:text-white rounded-lg text-xs font-semibold border border-[#5f6368] transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Joining info copied' : 'Copy joining info'}</span>
          </button>
        </div>

        <div className="h-px bg-[#3c4043]" />

        {/* Dial-in info */}
        <div>
          <h3 className="text-xs font-semibold text-[#9aa0a6] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" />
            <span>Dial-in Numbers</span>
          </h3>
          <p className="text-xs text-[#bdc1c6] leading-relaxed">
            (US) +1 415-555-0199<br />
            PIN: 983 294 102#
          </p>
        </div>

        <div className="h-px bg-[#3c4043]" />

        {/* Attachments & Agenda */}
        <div>
          <h3 className="text-xs font-semibold text-[#9aa0a6] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>Calendar Attachments (1)</span>
          </h3>
          <div className="p-3 rounded-lg bg-[#303134] border border-[#5f6368]/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-xs">
              DOC
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-medium text-white block truncate">
                Q3_Global_Strategy_Doc.pdf
              </span>
              <span className="text-[10px] text-[#9aa0a6]">2.4 MB • Google Drive</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
