export type VideoType = 'webcam' | 'preset_video' | 'avatar' | 'screen_share';
export type ConnectionQuality = 'excellent' | 'good' | 'poor' | 'frozen';
export type MeetingPlatform = 'zoom' | 'meet';
export type ParticipantBehavior = 
  | 'talkative' 
  | 'nodder' 
  | 'distracted' 
  | 'quiet' 
  | 'eater' 
  | 'cat_filter' 
  | 'executive' 
  | 'sleeping';

export interface Participant {
  id: string;
  name: string;
  role?: string;
  company?: string;
  avatarUrl: string;
  gender: 'female' | 'male';
  voicePitch?: number;
  voiceRate?: number;
  expertise?: string;
  videoType: VideoType;
  isVideoOn: boolean;
  isMuted: boolean;
  isSpeaking: boolean;
  isHandRaised: boolean;
  isHost: boolean;
  isCoHost?: boolean;
  isPinned?: boolean;
  isSpotlighted?: boolean;
  reaction?: {
    emoji: string;
    timestamp: number;
  };
  connectionQuality: ConnectionQuality;
  virtualBg?: string;
  audioLevel: number; // 0 to 100
  behavior: ParticipantBehavior;
  customStatus?: string;
  inWaitingRoom?: boolean;
  speechScript?: string[];
  currentSpeechIndex?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientId?: string; // undefined means "Everyone"
  recipientName?: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export type ViewMode = 'gallery' | 'speaker' | 'side_by_side';

export interface LiveCaption {
  speakerName: string;
  speakerAvatar?: string;
  text: string;
  timestamp: number;
}

export interface MeetingScenario {
  id: string;
  name: string;
  badge: string;
  description: string;
  topic: string;
  meetingId: string;
  passcode: string;
  meetCode?: string;
  hostName: string;
  participants: Participant[];
  initialChat: ChatMessage[];
  defaultScreenSharePreset?: string;
}

export interface ReactionItem {
  id: string;
  emoji: string;
  x: number;
  y: number;
  senderName: string;
}
