import { useState, useEffect } from 'react';
import { Participant } from '../types';
import ParticipantTile from './ParticipantTile';
import { ChevronLeft, ChevronRight, LayoutGrid, Volume2, Users } from 'lucide-react';

interface GalleryViewProps {
  participants: Participant[];
  currentUserId: string;
  pinnedId: string | null;
  spotlightId: string | null;
  onTogglePin: (id: string) => void;
  onToggleMute: (id: string) => void;
  onToggleVideo: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onMakeHost: (id: string) => void;
  onMakeSpeak: (id: string) => void;
  onAskQuestion?: (id: string) => void;
  onRemove: (id: string) => void;
  userVirtualBg?: string;
  isUserFrozen?: boolean;
}

export default function GalleryView({
  participants,
  currentUserId,
  pinnedId,
  spotlightId,
  onTogglePin,
  onToggleMute,
  onToggleVideo,
  onRename,
  onMakeHost,
  onMakeSpeak,
  onAskQuestion,
  onRemove,
  userVirtualBg,
  isUserFrozen = false,
}: GalleryViewProps) {
  const [pageSize, setPageSize] = useState<number>(25); // 25 is default Zoom grid size for large meetings
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalParticipants = participants.length;
  const isPaginated = totalParticipants > pageSize;
  const totalPages = isPaginated ? Math.ceil(totalParticipants / pageSize) : 1;

  // Ensure current page is valid when participant count changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [totalPages, currentPage]);

  // Keyboard navigation for page flip (Left/Right arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowLeft') {
        setCurrentPage((p) => Math.max(1, p - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentPage((p) => Math.min(totalPages, p + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalPages]);

  // Compute visible participants on current page
  const startIndex = isPaginated ? (currentPage - 1) * pageSize : 0;
  const endIndex = isPaginated ? Math.min(startIndex + pageSize, totalParticipants) : totalParticipants;
  const visibleParticipants = participants.slice(startIndex, endIndex);

  // Check if active speaker is on another page
  const activeSpeaker = participants.find((p) => p.isSpeaking && p.id !== currentUserId);
  const activeSpeakerIndex = activeSpeaker ? participants.findIndex((p) => p.id === activeSpeaker.id) : -1;
  const activeSpeakerPage = activeSpeakerIndex >= 0 ? Math.floor(activeSpeakerIndex / pageSize) + 1 : null;
  const isSpeakerOnDifferentPage = activeSpeakerPage && activeSpeakerPage !== currentPage;

  // Compute CSS Grid classes based on visible items count on current page
  const count = visibleParticipants.length;
  let gridClass = 'grid-cols-1';
  if (count === 2) gridClass = 'grid-cols-1 sm:grid-cols-2';
  else if (count >= 3 && count <= 4) gridClass = 'grid-cols-2';
  else if (count >= 5 && count <= 6) gridClass = 'grid-cols-2 sm:grid-cols-3';
  else if (count >= 7 && count <= 9) gridClass = 'grid-cols-3';
  else if (count >= 10 && count <= 16) gridClass = 'grid-cols-3 sm:grid-cols-4';
  else if (count >= 17 && count <= 25) gridClass = 'grid-cols-4 sm:grid-cols-5';
  else if (count > 25) gridClass = 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-7';

  return (
    <div id="zoom-gallery-view-container" className="relative w-full h-full flex flex-col overflow-hidden select-none bg-[#141416]">
      {/* Top Gallery Information Bar (if 25+ or multi-page) */}
      {totalParticipants > 12 && (
        <div className="h-8 shrink-0 px-3 bg-zinc-950/70 border-b border-zinc-800/80 flex items-center justify-between text-xs text-zinc-300 z-20">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-medium text-[11px] text-zinc-400">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>
                Total Attendees: <strong className="text-white font-mono">{totalParticipants}</strong>
              </span>
            </span>

            {isPaginated && (
              <span className="text-[11px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded font-mono">
                Showing {startIndex + 1}–{endIndex} of {totalParticipants} (Page {currentPage}/{totalPages})
              </span>
            )}
          </div>

          {/* Active Speaker Jump Notice */}
          {isSpeakerOnDifferentPage && activeSpeaker && (
            <button
              onClick={() => setCurrentPage(activeSpeakerPage)}
              className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-2.5 py-0.5 rounded-full text-[11px] font-medium hover:bg-emerald-900 transition-colors animate-pulse"
            >
              <Volume2 className="w-3 h-3 text-emerald-400" />
              <span>{activeSpeaker.name} is speaking on Page {activeSpeakerPage}</span>
              <span className="underline ml-0.5">Jump</span>
            </button>
          )}

          {/* Grid Layout Selector */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-zinc-500 hidden sm:inline">Tiles/Page:</span>
            {[16, 25, 49].map((size) => (
              <button
                key={size}
                onClick={() => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  pageSize === size
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Video Tiles Grid Stage */}
      <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center p-2 sm:p-3">
        <div
          id="zoom-gallery-grid"
          className={`w-full h-full grid ${gridClass} gap-1.5 sm:gap-2 auto-rows-fr items-center justify-center overflow-hidden`}
        >
          {visibleParticipants.map((p) => {
            const isMe = p.id === currentUserId;
            return (
              <div
                key={p.id}
                className="w-full h-full min-h-[100px] max-h-[100%] flex items-center justify-center"
              >
                <ParticipantTile
                  participant={p}
                  isCurrentUser={isMe}
                  isPinned={pinnedId === p.id}
                  isSpotlighted={spotlightId === p.id}
                  onTogglePin={onTogglePin}
                  onToggleMute={onToggleMute}
                  onToggleVideo={onToggleVideo}
                  onRename={onRename}
                  onMakeHost={onMakeHost}
                  onMakeSpeak={onMakeSpeak}
                  onAskQuestion={onAskQuestion}
                  onRemove={onRemove}
                  virtualBgUrl={isMe ? userVirtualBg : p.virtualBg}
                  isFrozen={isMe ? isUserFrozen : p.connectionQuality === 'frozen'}
                />
              </div>
            );
          })}
        </div>

        {/* Zoom Authentic Left Chevron Page Arrow */}
        {isPaginated && currentPage > 1 && (
          <button
            id="zoom-gallery-prev-page-btn"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-16 rounded-r-xl bg-black/60 hover:bg-black/90 text-white/70 hover:text-white flex items-center justify-center backdrop-blur-md border-y border-r border-zinc-700/80 shadow-2xl transition-all z-30 group"
            title="Previous Page (Left Arrow Key)"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* Zoom Authentic Right Chevron Page Arrow */}
        {isPaginated && currentPage < totalPages && (
          <button
            id="zoom-gallery-next-page-btn"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-16 rounded-l-xl bg-black/60 hover:bg-black/90 text-white/70 hover:text-white flex items-center justify-center backdrop-blur-md border-y border-l border-zinc-700/80 shadow-2xl transition-all z-30 group"
            title="Next Page (Right Arrow Key)"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Bottom Floating Page Indicator Bar (when multi-page) */}
      {isPaginated && (
        <div className="h-7 shrink-0 bg-zinc-950/90 border-t border-zinc-800/80 flex items-center justify-center gap-1.5 px-4 z-20">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`min-w-[22px] h-5 px-1.5 rounded text-[11px] font-mono font-medium transition-colors ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white font-bold shadow'
                    : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
