import { LiveCaption } from '../types';

interface GoogleMeetCaptionsProps {
  caption: LiveCaption | null;
}

export default function GoogleMeetCaptions({ caption }: GoogleMeetCaptionsProps) {
  if (!caption) return null;

  return (
    <div 
      id="google-meet-live-captions"
      className="absolute bottom-24 left-1/2 -translate-x-1/2 max-w-2xl w-[90%] bg-[#202124]/90 backdrop-blur-md border border-[#3c4043] rounded-xl px-5 py-3 text-center shadow-2xl z-40 animate-fade-in pointer-events-none"
    >
      <div className="flex items-center justify-center gap-2 mb-1">
        {caption.speakerAvatar && (
          <img 
            src={caption.speakerAvatar} 
            alt={caption.speakerName}
            referrerPolicy="no-referrer"
            className="w-4 h-4 rounded-full object-cover" 
          />
        )}
        <span className="text-xs font-semibold text-[#8ab4f8]">
          {caption.speakerName}
        </span>
      </div>
      <p className="text-sm text-white font-medium tracking-wide">
        "{caption.text}"
      </p>
    </div>
  );
}
