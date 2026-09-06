import { Participant } from '../types';
import ParticipantTile from './ParticipantTile';

interface SpeakerViewProps {
  participants: Participant[];
  currentUserId: string;
  activeSpeakerId: string | null;
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

export default function SpeakerView({
  participants,
  currentUserId,
  activeSpeakerId,
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
}: SpeakerViewProps) {
  // Determine who is displayed on main stage (Spotlighted > Pinned > Active Speaker > First participant)
  const mainSpeaker =
    participants.find((p) => p.id === (spotlightId || pinnedId || activeSpeakerId)) ||
    participants.find((p) => p.isSpeaking) ||
    participants[0];

  const stripParticipants = participants.filter((p) => p.id !== mainSpeaker?.id);

  if (!mainSpeaker) return null;

  const isMainMe = mainSpeaker.id === currentUserId;

  return (
    <div id="zoom-speaker-view" className="w-full h-full p-2 sm:p-3 flex flex-col gap-2 overflow-hidden">
      {/* Top Filmstrip Carousel */}
      {stripParticipants.length > 0 && (
        <div className="h-28 sm:h-32 shrink-0 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {stripParticipants.map((p) => {
            const isMe = p.id === currentUserId;
            return (
              <div key={p.id} className="h-full aspect-video shrink-0">
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
      )}

      {/* Main Dominant Stage */}
      <div className="flex-1 w-full h-full min-h-0 flex items-center justify-center">
        <ParticipantTile
          participant={mainSpeaker}
          isCurrentUser={isMainMe}
          isPinned={pinnedId === mainSpeaker.id}
          isSpotlighted={spotlightId === mainSpeaker.id}
          onTogglePin={onTogglePin}
          onToggleMute={onToggleMute}
          onToggleVideo={onToggleVideo}
          onRename={onRename}
          onMakeHost={onMakeHost}
          onMakeSpeak={onMakeSpeak}
          onAskQuestion={onAskQuestion}
          onRemove={onRemove}
          virtualBgUrl={isMainMe ? userVirtualBg : mainSpeaker.virtualBg}
          isFrozen={isMainMe ? isUserFrozen : mainSpeaker.connectionQuality === 'frozen'}
        />
      </div>
    </div>
  );
}
