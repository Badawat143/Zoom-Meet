/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Participant, 
  ChatMessage, 
  ViewMode, 
  MeetingScenario,
  ReactionItem,
  MeetingPlatform,
  LiveCaption
} from './types';
import { 
  MEETING_SCENARIOS, 
  INITIAL_USER 
} from './utils/presets';
import { generateMassParticipants } from './utils/participantGenerator';
import { zoomSounds } from './utils/soundEffects';

import ZoomHeader from './components/ZoomHeader';
import ZoomToolbar from './components/ZoomToolbar';
import GoogleMeetHeader from './components/GoogleMeetHeader';
import GoogleMeetToolbar from './components/GoogleMeetToolbar';
import GoogleMeetCaptions from './components/GoogleMeetCaptions';
import GoogleMeetDetailsDrawer from './components/GoogleMeetDetailsDrawer';
import GoogleMeetActivitiesDrawer from './components/GoogleMeetActivitiesDrawer';
import GoogleMeetHostDrawer from './components/GoogleMeetHostDrawer';
import MemberVoiceQAController from './components/MemberVoiceQAController';

import GalleryView from './components/GalleryView';
import SpeakerView from './components/SpeakerView';
import ScreenShareView from './components/ScreenShareView';
import ChatDrawer from './components/ChatDrawer';
import ParticipantsDrawer from './components/ParticipantsDrawer';
import FakeEscapeModal from './components/FakeEscapeModal';
import VirtualBackgroundModal from './components/VirtualBackgroundModal';
import CustomUserModal from './components/CustomUserModal';
import MassJoinModal from './components/MassJoinModal';
import MeetingScenarioPickerModal from './components/MeetingScenarioPickerModal';
import DirectJoinModal from './components/DirectJoinModal';
import MeetingJoinPreview from './components/MeetingJoinPreview';
import MeetingEndedView from './components/MeetingEndedView';
import LiveStreamHUD from './components/LiveStreamHUD';

import { voiceEngine } from './utils/voiceSynthesis';
import { getMemberAnswer, findMentionedParticipant } from './utils/memberAI';

import { WifiOff, Camera, Zap, Users, Link2, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';

export default function App() {
  // Check if link was shared with ?users=100 or ?count=100 or ?platform=meet
  const getInitialSetup = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const userParam = params.get('users') || params.get('count');
      const count = userParam ? Math.max(2, Math.min(1000, parseInt(userParam, 10) || 100)) : 100;
      const initialPlatform: MeetingPlatform = params.get('platform') === 'meet' ? 'meet' : 'zoom';
      return { initialCount: count, initialList: generateMassParticipants(count), initialPlatform };
    } catch {
      return { initialCount: 100, initialList: generateMassParticipants(100), initialPlatform: 'zoom' as MeetingPlatform };
    }
  };

  const initialSetup = getInitialSetup();
  const [platform, setPlatform] = useState<MeetingPlatform>(initialSetup.initialPlatform);
  const [currentScenario, setCurrentScenario] = useState<MeetingScenario>(MEETING_SCENARIOS[0]);
  const [meetingState, setMeetingState] = useState<'preview' | 'in_meeting' | 'ended'>('in_meeting');
  
  // Meeting Config
  const [topic, setTopic] = useState(currentScenario.topic);
  const [meetingId, setMeetingId] = useState(currentScenario.meetingId);
  const [meetCode, setMeetCode] = useState(currentScenario.meetCode || 'abc-defg-hij');
  const [passcode, setPasscode] = useState(currentScenario.passcode);
  const [hostName, setHostName] = useState(currentScenario.hostName);
  
  // Participants & User State (Defaults to 100+ realistic participants on any link click)
  const [participants, setParticipants] = useState<Participant[]>(initialSetup.initialList);
  const [userVideoType, setUserVideoType] = useState<'webcam' | 'preset_video' | 'avatar'>('avatar');
  const [userVirtualBg, setUserVirtualBg] = useState<string>('');
  const [isUserFrozen, setIsUserFrozen] = useState(false);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [spotlightId, setSpotlightId] = useState<string | null>(null);
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>('leader_1');
  
  // Screen Sharing
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenSharePresenter, setScreenSharePresenter] = useState<string>('Jessica Miller (CEO)');

  // Chat & Messages
  const [messages, setMessages] = useState<ChatMessage[]>(currentScenario.initialChat);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  // UI Modes & Drawers
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [isActivitiesDrawerOpen, setIsActivitiesDrawerOpen] = useState(false);
  const [isHostDrawerOpen, setIsHostDrawerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Google Meet Features
  const [isCaptionsOn, setIsCaptionsOn] = useState(false);
  const [activeCaptions, setActiveCaptions] = useState<LiveCaption[]>([]);

  // Modals
  const [isEscapeModalOpen, setIsEscapeModalOpen] = useState(false);
  const [isVirtualBgModalOpen, setIsVirtualBgModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isMassJoinModalOpen, setIsMassJoinModalOpen] = useState(false);
  const [isDirectJoinModalOpen, setIsDirectJoinModalOpen] = useState(false);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);

  // Live 1-by-1 Streaming Join Engine State
  const [isStreamJoining, setIsStreamJoining] = useState(false);
  const [streamTargetTotal, setStreamTargetTotal] = useState(100);
  const [streamSpeed, setStreamSpeed] = useState<'normal' | 'fast' | 'slow'>('normal');
  const [isStreamPaused, setIsStreamPaused] = useState(false);
  const [lastJoinedName, setLastJoinedName] = useState<string | undefined>(undefined);
  const streamQueueRef = useRef<Participant[]>([]);

  // Live Timer & Recording
  const [durationSeconds, setDurationSeconds] = useState(148);
  const [isRecording, setIsRecording] = useState(true);
  const [isRecordingPaused, setIsRecordingPaused] = useState(false);

  // Floating Reactions
  const [floatingReactions, setFloatingReactions] = useState<ReactionItem[]>([]);

  // Screenshot flash notification
  const [showScreenshotAlert, setShowScreenshotAlert] = useState(false);
  const [joinNotification, setJoinNotification] = useState<string | null>(null);

  // Interactive Voice Q&A state
  const [activeVoiceSpeaker, setActiveVoiceSpeaker] = useState<Participant | null>(null);
  const [isVoiceQASpeaking, setIsVoiceQASpeaking] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Platform Switcher Handler
  const handleSwitchPlatform = (newPlatform: MeetingPlatform) => {
    setPlatform(newPlatform);
    if (newPlatform === 'meet') {
      zoomSounds.playMeetJoinChime();
      setJoinNotification('Switched to Google Meet Mode 📹');
    } else {
      zoomSounds.playJoinChime();
      setJoinNotification('Switched to Zoom Workplace Mode 🟦');
    }
    setTimeout(() => setJoinNotification(null), 2500);
  };

  // Load Scenario Data on Switch
  const handleSelectScenario = (scenario: MeetingScenario) => {
    setCurrentScenario(scenario);
    setTopic(scenario.topic);
    setHostName(scenario.hostName);
    setMeetCode(scenario.meetCode || 'abc-defg-hij');
    setParticipants(scenario.participants);
    setMessages(scenario.initialChat);
    setUnreadChatCount(0);
    setIsScreenSharing(false);
    setIsStreamJoining(false);
    streamQueueRef.current = [];
    if (platform === 'meet') {
      zoomSounds.playMeetJoinChime();
    } else {
      zoomSounds.playJoinChime();
    }
  };

  // Start Sequential 1-by-1 Live Stream Join
  const startSequentialLiveJoin = (
    targetTotal: number, 
    speed: 'normal' | 'fast' | 'slow' = 'normal',
    initialMembers?: Participant[]
  ) => {
    const fullTargetList = generateMassParticipants(targetTotal);
    
    // User + Host form the initial base room
    const base = initialMembers || fullTargetList.slice(0, 2);
    const remaining = fullTargetList.slice(base.length);

    setParticipants(base);
    streamQueueRef.current = remaining;
    setStreamTargetTotal(targetTotal);
    setStreamSpeed(speed);
    setIsStreamPaused(false);
    setIsStreamJoining(true);
    setMeetingState('in_meeting');
    
    if (platform === 'meet') {
      zoomSounds.playMeetJoinChime();
    } else {
      zoomSounds.playJoinChime();
    }
    
    setJoinNotification(`🟢 Admitting attendees 1-by-1 (Target: ${targetTotal} members)`);
    setTimeout(() => setJoinNotification(null), 3000);
  };

  // Instant complete stream
  const handleInstantCompleteStream = () => {
    if (streamQueueRef.current.length > 0) {
      const remaining = [...streamQueueRef.current];
      streamQueueRef.current = [];
      setParticipants((prev) => [...prev, ...remaining]);
    }
    setIsStreamJoining(false);
    setJoinNotification(`All ${streamTargetTotal} attendees joined!`);
    setTimeout(() => setJoinNotification(null), 3000);
  };

  // Mass Attendee Operations
  const handleSetTotalCount = (count: number) => {
    const updated = generateMassParticipants(count);
    setParticipants(updated);
    setIsStreamJoining(false);
    streamQueueRef.current = [];
    setJoinNotification(`Meeting expanded to ${count} attendees!`);
    setTimeout(() => setJoinNotification(null), 3500);
  };

  const handleDirectJoinMeeting = (params: {
    platform: MeetingPlatform;
    meetingIdOrCode: string;
    topic: string;
    passcode?: string;
    targetAttendeeCount: number;
    streamJoin?: boolean;
    streamSpeed?: 'normal' | 'fast' | 'slow';
  }) => {
    setPlatform(params.platform);
    setTopic(params.topic);
    if (params.platform === 'meet') {
      setMeetCode(params.meetingIdOrCode);
    } else {
      setMeetingId(params.meetingIdOrCode);
      if (params.passcode) setPasscode(params.passcode);
    }

    const count = params.targetAttendeeCount || 100;
    if (params.streamJoin !== false) {
      startSequentialLiveJoin(count, params.streamSpeed || 'normal');
    } else {
      const updated = generateMassParticipants(count);
      setParticipants(updated);
      setMeetingState('in_meeting');
      if (params.platform === 'meet') {
        zoomSounds.playMeetJoinChime();
      } else {
        zoomSounds.playJoinChime();
      }
      setJoinNotification(`Joined ${params.platform === 'meet' ? 'Google Meet' : 'Zoom'} with ${count} attendees!`);
      setTimeout(() => setJoinNotification(null), 3500);
    }
  };

  const handleAddBatchUsers = (batchCount: number, stream: boolean = true) => {
    if (stream) {
      const targetTotal = participants.length + batchCount;
      const additionalList = generateMassParticipants(targetTotal).slice(participants.length);
      streamQueueRef.current = [...streamQueueRef.current, ...additionalList];
      setStreamTargetTotal(targetTotal);
      setIsStreamJoining(true);
      setIsStreamPaused(false);
      setJoinNotification(`Admitting +${batchCount} attendees one-by-one...`);
      setTimeout(() => setJoinNotification(null), 3000);
    } else {
      const nextTotal = participants.length + batchCount;
      const updated = generateMassParticipants(nextTotal);
      setParticipants(updated);
      setJoinNotification(`+${batchCount} attendees joined the meeting`);
      setTimeout(() => setJoinNotification(null), 3000);
    }
  };

  const handleMassHandRaise = (count: number) => {
    setParticipants((prev) => {
      let raised = 0;
      return prev.map((p) => {
        if (p.id !== 'me' && !p.isHandRaised && raised < count) {
          raised++;
          return { ...p, isHandRaised: true };
        }
        return p;
      });
    });
    zoomSounds.playHandRaiseDing();
    setJoinNotification(`${count} attendees raised hands for Q&A`);
    setTimeout(() => setJoinNotification(null), 3000);
  };

  // Live 1-by-1 Stream Joining Loop
  useEffect(() => {
    if (!isStreamJoining || meetingState !== 'in_meeting' || isStreamPaused) return;

    const getCadence = () => {
      switch (streamSpeed) {
        case 'fast': return 220;
        case 'slow': return 1100;
        case 'normal':
        default: return 550;
      }
    };

    const interval = setInterval(() => {
      if (streamQueueRef.current.length === 0) {
        setIsStreamJoining(false);
        setJoinNotification(`🎉 All ${streamTargetTotal} attendees have joined the meeting!`);
        setTimeout(() => setJoinNotification(null), 4000);
        return;
      }

      const nextPerson = streamQueueRef.current.shift();
      if (!nextPerson) return;

      setParticipants((prev) => [...prev, nextPerson]);
      setLastJoinedName(nextPerson.name);

      // Play authentic sound chime for each joiner
      if (platform === 'meet') {
        zoomSounds.playMeetJoinChime();
      } else {
        zoomSounds.playJoinChime();
      }

      setJoinNotification(`🔔 ${nextPerson.name} (${nextPerson.role || 'Attendee'}) joined`);
      setTimeout(() => setJoinNotification(null), 1400);

      // 1 out of 5 joiners drops a realistic greeting in chat
      if (Math.random() < 0.22) {
        const greetings = [
          'Hi everyone! 👋',
          'Good morning team!',
          'Glad to be here.',
          'Audio & video working crisp 👍',
          'Joining in from desktop!',
          'Hey all, present!',
          'Ready for the agenda!',
        ];
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        const autoMsg: ChatMessage = {
          id: 'msg-' + Math.random().toString(36).substring(2, 9),
          senderId: nextPerson.id,
          senderName: nextPerson.name,
          senderAvatar: nextPerson.avatarUrl,
          text: randomGreeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, autoMsg]);
      }
    }, getCadence());

    return () => clearInterval(interval);
  }, [isStreamJoining, isStreamPaused, streamSpeed, meetingState, platform, streamTargetTotal]);

  // Timer Interval
  useEffect(() => {
    if (meetingState !== 'in_meeting') return;
    const interval = setInterval(() => {
      setDurationSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [meetingState]);

  // Automated Participant Speech Cycle Simulation
  useEffect(() => {
    if (meetingState !== 'in_meeting') return;

    const speechTimer = setInterval(() => {
      const nonUserParticipants = participants.filter(
        (p) => p.id !== 'me' && p.behavior !== 'sleeping' && p.behavior !== 'cat_filter'
      );
      if (nonUserParticipants.length === 0) return;

      const randomSpeaker = nonUserParticipants[Math.floor(Math.random() * Math.min(25, nonUserParticipants.length))];

      setParticipants((prev) =>
        prev.map((p) => {
          if (p.id === randomSpeaker.id) {
            const currentIdx = p.currentSpeechIndex || 0;
            const maxLen = p.speechScript ? p.speechScript.length : 1;
            return {
              ...p,
              isSpeaking: true,
              isMuted: false,
              audioLevel: 75 + Math.floor(Math.random() * 20),
              currentSpeechIndex: (currentIdx + 1) % Math.max(1, maxLen),
            };
          }
          return {
            ...p,
            isSpeaking: false,
            audioLevel: 0,
          };
        })
      );

      setActiveSpeakerId(randomSpeaker.id);

      // Reset speaker after 5 seconds
      setTimeout(() => {
        setParticipants((prev) =>
          prev.map((p) => (p.id === randomSpeaker.id ? { ...p, isSpeaking: false, audioLevel: 0 } : p))
        );
      }, 5000);

      // Trigger Live Captions if enabled (Google Meet Feature)
      if (randomSpeaker.speechScript && randomSpeaker.speechScript.length > 0) {
        const speechLine = randomSpeaker.speechScript[Math.floor(Math.random() * randomSpeaker.speechScript.length)];
        const newCaption: LiveCaption = {
          speakerName: randomSpeaker.name,
          speakerAvatar: randomSpeaker.avatarUrl,
          text: speechLine,
          timestamp: Date.now()
        };
        setActiveCaptions([newCaption]);

        // Auto remove caption after 5.5s
        setTimeout(() => {
          setActiveCaptions((prev) => prev.filter((c) => c.timestamp !== newCaption.timestamp));
        }, 5500);
      }
    }, 11000);

    return () => clearInterval(speechTimer);
  }, [meetingState, participants.length, isCaptionsOn]);

  // Automated Random Chat generation among 100+ participants
  useEffect(() => {
    if (meetingState !== 'in_meeting') return;

    const chatTimer = setInterval(() => {
      const nonUser = participants.filter((p) => p.id !== 'me');
      if (nonUser.length === 0) return;

      const randomPerson = nonUser[Math.floor(Math.random() * nonUser.length)];
      const automatedReplies = [
        'Agreed with that roadmap timeline! 👍',
        'Can you send the link to the slides after the call?',
        'Super excited about these Q3 numbers 🚀',
        '+1 to what was presented.',
        'Audio is crystal clear on my end.',
        'Great progress this sprint team! 🎉',
        'Dropping the documentation link in the thread.',
      ];
      const randomText = automatedReplies[Math.floor(Math.random() * automatedReplies.length)];

      const newMsg: ChatMessage = {
        id: `auto_${Date.now()}`,
        senderId: randomPerson.id,
        senderName: randomPerson.name,
        senderAvatar: randomPerson.avatarUrl,
        text: randomText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, newMsg]);
      if (!isChatOpen) {
        setUnreadChatCount((c) => c + 1);
        zoomSounds.playChatPop();
      }
    }, 24000);

    return () => clearInterval(chatTimer);
  }, [meetingState, participants, isChatOpen]);

  // Handle User Microphone Toggle
  const handleToggleUserMute = () => {
    let nextMuted = false;
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === 'me') {
          nextMuted = !p.isMuted;
          return { ...p, isMuted: nextMuted, isSpeaking: false };
        }
        return p;
      })
    );
    zoomSounds.playMuteToggleSound(nextMuted);
  };

  // Handle User Video Toggle
  const handleToggleUserVideo = () => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === 'me'
          ? {
              ...p,
              isVideoOn: !p.isVideoOn,
              videoType: !p.isVideoOn ? 'webcam' : p.videoType,
            }
          : p
      )
    );
  };

  // Handle User Hand Raise Toggle
  const handleToggleUserHandRaise = () => {
    let nextRaised = false;
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === 'me') {
          nextRaised = !p.isHandRaised;
          return { ...p, isHandRaised: nextRaised };
        }
        return p;
      })
    );
    if (nextRaised) {
      if (platform === 'meet') {
        zoomSounds.playMeetHandRaise();
      } else {
        zoomSounds.playHandRaiseDing();
      }
    }
  };

  // Handle Pin / Spotlight
  const handleTogglePin = (id: string) => {
    setPinnedId((prev) => (prev === id ? null : id));
  };

  // Toggle Mute on any participant
  const handleToggleParticipantMute = (id: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isMuted: !p.isMuted } : p))
    );
  };

  // Toggle Video on any participant
  const handleToggleParticipantVideo = (id: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isVideoOn: !p.isVideoOn } : p))
    );
  };

  // Rename any participant
  const handleRenameParticipant = (id: string, newName: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: newName } : p))
    );
  };

  // Make participant host
  const handleMakeHost = (id: string) => {
    setParticipants((prev) =>
      prev.map((p) => ({
        ...p,
        isHost: p.id === id,
      }))
    );
    const hostUser = participants.find((p) => p.id === id);
    if (hostUser) setHostName(hostUser.name);
  };

  // Trigger participant speech manually
  const handleMakeSpeak = (id: string) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              isSpeaking: !p.isSpeaking,
              isMuted: false,
              audioLevel: 80,
              currentSpeechIndex: ((p.currentSpeechIndex || 0) + 1) % Math.max(1, p.speechScript?.length || 1),
            }
          : { ...p, isSpeaking: false }
      )
    );
    setActiveSpeakerId(id);
  };

  // Remove participant
  const handleRemoveParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
    zoomSounds.playLeaveChime();
  };

  // Mute All Participants
  const handleMuteAll = () => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === 'me' ? p : { ...p, isMuted: true, isSpeaking: false }))
    );
    zoomSounds.playMuteToggleSound(true);
  };

  // Interactive Voice Q&A Handler: Ask any member, unlock their mic, and speak with distinct voice
  const handleAskMember = async (targetId: string, questionText: string) => {
    const targetMember = participants.find((p) => p.id === targetId);
    if (!targetMember || targetMember.id === 'me') return;

    const me = participants.find((p) => p.id === 'me');
    const senderName = me?.name || 'Alex Rivera';

    // 1. Post user's question into chat
    const userMsg: ChatMessage = {
      id: `qa_user_${Date.now()}`,
      senderId: 'me',
      senderName: `${senderName}`,
      senderAvatar: me?.avatarUrl || '',
      text: `@${targetMember.name}: ${questionText}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    zoomSounds.playChatPop();

    // 2. Unlock participant's mic immediately & start processing state
    setIsVoiceQASpeaking(true);
    setActiveVoiceSpeaker(targetMember);
    setActiveSpeakerId(targetMember.id);
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === targetMember.id
          ? { ...p, isMuted: false, isSpeaking: true, audioLevel: 45 }
          : { ...p, isSpeaking: false, audioLevel: 0 }
      )
    );

    // 3. Fetch smart answer tailored to member's role, gender, and expertise
    const aiResponse = await getMemberAnswer(targetMember, questionText, topic);

    // 4. Post member's answer in meeting chat
    const memberMsg: ChatMessage = {
      id: `qa_reply_${Date.now()}`,
      senderId: targetMember.id,
      senderName: targetMember.name,
      senderAvatar: targetMember.avatarUrl,
      text: aiResponse.answer,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, memberMsg]);
    if (!isChatOpen) {
      setUnreadChatCount((c) => c + 1);
    }

    // 5. Show Live Caption (Google Meet style or Zoom subtitle)
    const caption: LiveCaption = {
      speakerName: targetMember.name,
      speakerAvatar: targetMember.avatarUrl,
      text: aiResponse.answer,
      timestamp: Date.now(),
    };
    setActiveCaptions([caption]);

    // 6. Speak aloud using gender-matching synthesized voice!
    voiceEngine.speak(
      aiResponse.answer,
      targetMember,
      () => {
        // onStart
        setIsVoiceQASpeaking(true);
        setParticipants((prev) =>
          prev.map((p) =>
            p.id === targetMember.id
              ? { ...p, isMuted: false, isSpeaking: true, audioLevel: 85 }
              : { ...p, isSpeaking: false }
          )
        );
      },
      () => {
        // onEnd
        setIsVoiceQASpeaking(false);
        setActiveVoiceSpeaker(null);
        setParticipants((prev) =>
          prev.map((p) =>
            p.id === targetMember.id
              ? { ...p, isSpeaking: false, audioLevel: 0 }
              : p
          )
        );
        setTimeout(() => {
          setActiveCaptions((prev) => prev.filter((c) => c.timestamp !== caption.timestamp));
        }, 3500);
      },
      (level) => {
        // onAudioLevel
        setParticipants((prev) =>
          prev.map((p) =>
            p.id === targetMember.id ? { ...p, audioLevel: level } : p
          )
        );
      }
    );
  };

  // Handle voice call/query detected by speech recognition
  const handleVoiceCallDetected = (transcript: string) => {
    const match = findMentionedParticipant(transcript, participants);
    if (match) {
      handleAskMember(match.id, transcript);
    } else {
      const nonUserMembers = participants.filter((p) => p.id !== 'me');
      const hostOrFirst = nonUserMembers.find((p) => p.isHost) || nonUserMembers[0];
      if (hostOrFirst) {
        handleAskMember(hostOrFirst.id, transcript);
      }
    }
  };

  // Send Reaction
  const handleSendReaction = (emoji: string) => {
    const reactionId = `react_${Date.now()}`;
    const newReaction: ReactionItem = {
      id: reactionId,
      emoji: emoji,
      x: 20 + Math.random() * 60,
      y: 70 + Math.random() * 20,
      senderName: 'You',
    };

    setFloatingReactions((prev) => [...prev, newReaction]);

    if (emoji === '🎉') {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8 },
      });
    }

    setParticipants((prev) =>
      prev.map((p) => (p.id === 'me' ? { ...p, reaction: { emoji, timestamp: Date.now() } } : p))
    );

    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== reactionId));
    }, 3000);
  };

  // Send Chat Message
  const handleSendMessage = (text: string, recipientId?: string, recipientName?: string) => {
    const me = participants.find((p) => p.id === 'me');
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'me',
      senderName: me?.name || 'Alex Rivera (You)',
      senderAvatar: me?.avatarUrl || '',
      recipientId,
      recipientName,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);

    setTimeout(() => {
      const nonUser = participants.filter((p) => p.id !== 'me');
      if (nonUser.length > 0) {
        const replier = nonUser[0];
        const answers = [
          `Thanks for mentioning that, ${me?.name.split(' ')[0]}!`,
          'Great question, let’s sync up on that right after the review.',
          '100% agreed.',
          'Noted! Added to the meeting minutes doc.',
        ];
        const answerText = answers[Math.floor(Math.random() * answers.length)];
        const replyMsg: ChatMessage = {
          id: `reply_${Date.now()}`,
          senderId: replier.id,
          senderName: replier.name,
          senderAvatar: replier.avatarUrl,
          text: answerText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, replyMsg]);
        zoomSounds.playChatPop();
      }
    }, 2000);
  };

  // Take Clean Screenshot of Zoom Window
  const handleTakeScreenshot = async () => {
    if (!containerRef.current) return;
    try {
      const canvas = await html2canvas(containerRef.current, {
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `Zoom_Meeting_100_Users_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setShowScreenshotAlert(true);
      setTimeout(() => setShowScreenshotAlert(false), 3000);
    } catch (e) {
      console.warn('Screenshot error:', e);
    }
  };

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const userParticipant = participants.find((p) => p.id === 'me') || INITIAL_USER;

  return (
    <div
      ref={containerRef}
      id="fake-zoom-app-root"
      className="relative w-screen h-screen bg-[#111111] text-zinc-100 flex flex-col overflow-hidden font-sans select-none"
    >
      {/* 1. INITIAL JOIN PREVIEW SCREEN */}
      {meetingState === 'preview' && (
        <MeetingJoinPreview
          topic={topic}
          meetingId={meetingId}
          meetCode={meetCode}
          initialName={userParticipant.name.replace(/\s*\(You\)/i, '') || 'Alex Rivera'}
          initialPlatform={platform}
          initialUserCount={participants.length || 100}
          onJoinMeeting={(name, isMuted, isVideoOn, videoType, chosenPlatform, customDetails) => {
            setPlatform(chosenPlatform);
            if (customDetails?.topic) {
              setTopic(customDetails.topic);
            }
            if (chosenPlatform === 'meet') {
              if (customDetails?.meetingIdOrCode) {
                setMeetCode(customDetails.meetingIdOrCode);
              }
            } else {
              if (customDetails?.meetingIdOrCode) {
                setMeetingId(customDetails.meetingIdOrCode);
              }
            }

            const count = customDetails?.initialAttendeeCount || participants.length || 100;
            const displayName = name ? `${name} (You)` : 'Alex Rivera (You)';
            setUserVideoType(videoType);

            if (customDetails?.streamJoin !== false) {
              const fullList = generateMassParticipants(count);
              const customUser = {
                ...fullList[0],
                id: 'me',
                name: displayName,
                isMuted,
                isVideoOn,
                videoType,
              };
              const initialHost = fullList[1];
              startSequentialLiveJoin(
                count, 
                customDetails?.streamSpeed || 'normal', 
                [customUser, initialHost]
              );
            } else {
              const updated = generateMassParticipants(count);
              setParticipants(
                updated.map((p) =>
                  p.id === 'me' ? { ...p, name: displayName, isMuted, isVideoOn, videoType } : p
                )
              );
              setMeetingState('in_meeting');
              if (chosenPlatform === 'meet') {
                zoomSounds.playMeetJoinChime();
              } else {
                zoomSounds.playJoinChime();
              }
              setJoinNotification(`Joined with ${count} attendees!`);
              setTimeout(() => setJoinNotification(null), 3000);
            }
          }}
        />
      )}

      {/* 2. MEETING ENDED SCREEN */}
      {meetingState === 'ended' && (
        <MeetingEndedView
          topic={topic}
          durationSeconds={durationSeconds}
          platform={platform}
          onRejoin={(chosenPlatform) => {
            if (chosenPlatform) setPlatform(chosenPlatform);
            if (chosenPlatform === 'meet' || platform === 'meet') {
              zoomSounds.playMeetJoinChime();
            } else {
              zoomSounds.playJoinChime();
            }
            setMeetingState('in_meeting');
          }}
          onOpenScenarios={() => setIsScenarioModalOpen(true)}
        />
      )}

      {/* 3. ACTIVE MEETING LAYOUT (GOOGLE MEET OR ZOOM) */}
      {meetingState === 'in_meeting' && (
        <>
          {/* Top Unstable Internet Warning Banner */}
          {isUserFrozen && (
            <div className="bg-amber-500 text-zinc-950 px-4 py-1.5 text-xs font-bold flex items-center justify-between z-50 animate-pulse">
              <div className="flex items-center gap-2">
                <WifiOff className="w-4 h-4" />
                <span>Your Internet Connection is Unstable. Audio and video may be degraded or frozen.</span>
              </div>
              <button
                onClick={() => setIsUserFrozen(false)}
                className="px-2 py-0.5 bg-zinc-900 text-white rounded text-[10px] hover:bg-zinc-800"
              >
                Restore Connection
              </button>
            </div>
          )}

          {/* Interactive Member Voice Q&A Floating Controller */}
          <MemberVoiceQAController
            participants={participants}
            currentUserId="me"
            isSpeaking={isVoiceQASpeaking}
            activeSpeakerName={activeVoiceSpeaker?.name}
            onAskMember={handleAskMember}
            onVoiceCallDetected={handleVoiceCallDetected}
          />

          {/* Live 1-by-1 Sequential Joining Progress HUD */}
          <LiveStreamHUD
            currentCount={participants.length}
            targetCount={streamTargetTotal}
            isStreaming={isStreamJoining}
            isPaused={isStreamPaused}
            speed={streamSpeed}
            lastJoinedName={lastJoinedName}
            onInstantComplete={handleInstantCompleteStream}
            onTogglePause={() => setIsStreamPaused(!isStreamPaused)}
            onChangeSpeed={(newSpeed) => setStreamSpeed(newSpeed)}
            onStop={() => {
              setIsStreamJoining(false);
              streamQueueRef.current = [];
            }}
          />

          {/* Join Notification Banner */}
          {!isStreamJoining && joinNotification && (
            <div className="fixed top-14 left-1/2 -translate-x-1/2 bg-blue-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full shadow-2xl text-xs font-semibold flex items-center gap-2 z-50 animate-fade-in border border-blue-400/40">
              <Users className="w-3.5 h-3.5 text-white" />
              <span>{joinNotification}</span>
            </div>
          )}

          {/* Screenshot Notification Alert */}
          {showScreenshotAlert && (
            <div className="fixed top-16 right-6 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 z-50 animate-bounce">
              <Camera className="w-4 h-4" /> Screenshot saved to downloads!
            </div>
          )}

          {/* PLATFORM HEADER: CONDITIONAL ZOOM VS GOOGLE MEET */}
          {platform === 'meet' ? (
            <GoogleMeetHeader
              topic={topic}
              meetCode={meetCode}
              durationSeconds={durationSeconds}
              participantCount={participants.length}
              currentPlatform={platform}
              onSwitchPlatform={handleSwitchPlatform}
              onOpenScenarios={() => setIsScenarioModalOpen(true)}
              onOpenMassJoinModal={() => setIsMassJoinModalOpen(true)}
              onOpenDirectJoinModal={() => setIsDirectJoinModalOpen(true)}
              onToggleFullscreen={handleToggleFullscreen}
              isFullscreen={isFullscreen}
            />
          ) : (
            <ZoomHeader
              topic={topic}
              meetingId={meetingId}
              passcode={passcode}
              hostName={hostName}
              durationSeconds={durationSeconds}
              isRecording={isRecording}
              isRecordingPaused={isRecordingPaused}
              viewMode={viewMode}
              participantCount={participants.length}
              currentPlatform={platform}
              onSwitchPlatform={handleSwitchPlatform}
              onViewModeChange={setViewMode}
              onTopicChange={setTopic}
              onToggleRecordingPause={() => setIsRecordingPaused(!isRecordingPaused)}
              onStopRecording={() => setIsRecording(false)}
              onOpenScenarios={() => setIsScenarioModalOpen(true)}
              onOpenMassJoinModal={() => setIsMassJoinModalOpen(true)}
              onOpenDirectJoinModal={() => setIsDirectJoinModalOpen(true)}
              onToggleFullscreen={handleToggleFullscreen}
              isFullscreen={isFullscreen}
            />
          )}

          {/* Main Stage & Drawers Flex Container */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Center Meeting Stage */}
            <div className={`flex-1 h-full ${platform === 'meet' ? 'bg-[#202124]' : 'bg-[#18181b]'} overflow-hidden flex flex-col relative`}>
              {/* Screen Share Mode */}
              {isScreenSharing ? (
                <ScreenShareView
                  presenterName={screenSharePresenter}
                  presetId={currentScenario.defaultScreenSharePreset}
                  onStopShare={() => setIsScreenSharing(false)}
                  isPresenterMe={true}
                />
              ) : viewMode === 'speaker' ? (
                <SpeakerView
                  participants={participants}
                  currentUserId="me"
                  activeSpeakerId={activeSpeakerId}
                  pinnedId={pinnedId}
                  spotlightId={spotlightId}
                  onTogglePin={handleTogglePin}
                  onToggleMute={handleToggleParticipantMute}
                  onToggleVideo={handleToggleParticipantVideo}
                  onRename={handleRenameParticipant}
                  onMakeHost={handleMakeHost}
                  onMakeSpeak={handleMakeSpeak}
                  onAskQuestion={(id) => handleAskMember(id, 'Can you give us a quick status update on your progress?')}
                  onRemove={handleRemoveParticipant}
                  userVirtualBg={userVirtualBg}
                  isUserFrozen={isUserFrozen}
                />
              ) : (
                <GalleryView
                  participants={participants}
                  currentUserId="me"
                  pinnedId={pinnedId}
                  spotlightId={spotlightId}
                  onTogglePin={handleTogglePin}
                  onToggleMute={handleToggleParticipantMute}
                  onToggleVideo={handleToggleParticipantVideo}
                  onRename={handleRenameParticipant}
                  onMakeHost={handleMakeHost}
                  onMakeSpeak={handleMakeSpeak}
                  onAskQuestion={(id) => handleAskMember(id, 'Can you give us a quick status update on your progress?')}
                  onRemove={handleRemoveParticipant}
                  userVirtualBg={userVirtualBg}
                  isUserFrozen={isUserFrozen}
                />
              )}

              {/* Live Speech Captions (Google Meet Style) */}
              {isCaptionsOn && activeCaptions.length > 0 && (
                <GoogleMeetCaptions caption={activeCaptions[0] || null} />
              )}

              {/* Floating Flying Emoji Reaction Elements */}
              {floatingReactions.map((r) => (
                <div
                  key={r.id}
                  className="absolute pointer-events-none text-4xl animate-float-up z-50"
                  style={{ left: `${r.x}%`, bottom: '80px' }}
                >
                  {r.emoji}
                </div>
              ))}

              {/* Quick Floating Actions: Direct Join, Quick +50/100 Booster, Mass Join & Screenshot */}
              <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 flex-wrap justify-end">
                <button
                  id="quick-direct-join-btn"
                  onClick={() => setIsDirectJoinModalOpen(true)}
                  title="Direct Join any Zoom or Google Meet Link / Meeting ID"
                  className="px-2.5 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 rounded-lg backdrop-blur-md border border-emerald-500/80 transition-all flex items-center gap-1.5 text-xs font-semibold shadow-lg cursor-pointer"
                >
                  <Link2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline">Join Any Link</span>
                </button>

                <div className="flex items-center bg-zinc-950/85 backdrop-blur-md border border-zinc-700/80 rounded-lg p-0.5 shadow-lg">
                  <button
                    onClick={() => handleAddBatchUsers(50, true)}
                    title="Stream +50 attendees into meeting one-by-one with live chimes"
                    className="px-2 py-1 text-zinc-300 hover:text-white hover:bg-emerald-600/30 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3 text-emerald-400" />
                    <span>+50 Live</span>
                  </button>
                  <button
                    onClick={() => handleAddBatchUsers(100, true)}
                    title="Stream +100 attendees into meeting one-by-one with live chimes"
                    className="px-2 py-1 text-zinc-300 hover:text-white hover:bg-blue-600/30 rounded text-xs font-semibold flex items-center gap-1 transition-colors border-l border-zinc-800"
                  >
                    <Plus className="w-3 h-3 text-blue-400" />
                    <span>+100 Live</span>
                  </button>
                </div>

                <button
                  id="quick-mass-join-btn"
                  onClick={() => setIsMassJoinModalOpen(true)}
                  title="Mass Attendee Controller (100 to 1,000+ Users)"
                  className="px-2.5 py-1.5 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg backdrop-blur-md border border-blue-400/80 transition-all flex items-center gap-1.5 text-xs font-bold shadow-lg cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>👥 {participants.length} Users</span>
                </button>

                <button
                  id="quick-screenshot-btn"
                  onClick={handleTakeScreenshot}
                  title="Take pristine screenshot"
                  className="p-1.5 bg-black/60 hover:bg-black/90 text-zinc-300 hover:text-white rounded-lg backdrop-blur-md border border-zinc-700/80 transition-all flex items-center gap-1 text-xs cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden lg:inline font-medium">Capture</span>
                </button>
              </div>
            </div>

            {/* Right Side: Participants Drawer */}
            {isParticipantsOpen && (
              <ParticipantsDrawer
                participants={participants}
                currentUserId="me"
                onClose={() => setIsParticipantsOpen(false)}
                onToggleMute={handleToggleParticipantMute}
                onToggleVideo={handleToggleParticipantVideo}
                onMuteAll={handleMuteAll}
                onOpenAddUserModal={() => setIsAddUserModalOpen(true)}
                onOpenMassJoinModal={() => setIsMassJoinModalOpen(true)}
                onAskQuestion={(id) => handleAskMember(id, 'Can you tell us about the latest status and next steps?')}
              />
            )}

            {/* Right Side: Chat Drawer */}
            {isChatOpen && (
              <ChatDrawer
                messages={messages}
                participants={participants}
                currentUserId="me"
                onSendMessage={handleSendMessage}
                onClose={() => setIsChatOpen(false)}
              />
            )}

            {/* Right Side: Google Meet Details Drawer */}
            {isDetailsDrawerOpen && (
              <GoogleMeetDetailsDrawer
                meetCode={meetCode}
                topic={topic}
                onClose={() => setIsDetailsDrawerOpen(false)}
              />
            )}

            {/* Right Side: Google Meet Activities Drawer */}
            {isActivitiesDrawerOpen && (
              <GoogleMeetActivitiesDrawer
                onClose={() => setIsActivitiesDrawerOpen(false)}
              />
            )}

            {/* Right Side: Google Meet Host Controls Drawer */}
            {isHostDrawerOpen && (
              <GoogleMeetHostDrawer
                onClose={() => setIsHostDrawerOpen(false)}
              />
            )}
          </div>

          {/* CONDITIONAL BOTTOM TOOLBAR: ZOOM OR GOOGLE MEET */}
          {platform === 'meet' ? (
            <GoogleMeetToolbar
              meetCode={meetCode}
              isMuted={userParticipant.isMuted}
              isVideoOn={userParticipant.isVideoOn}
              isHandRaised={userParticipant.isHandRaised}
              isScreenSharing={isScreenSharing}
              isCaptionsOn={isCaptionsOn}
              isChatOpen={isChatOpen}
              isPeopleOpen={isParticipantsOpen}
              isDetailsOpen={isDetailsDrawerOpen}
              isActivitiesOpen={isActivitiesDrawerOpen}
              isHostControlsOpen={isHostDrawerOpen}
              participantCount={participants.length}
              unreadChatCount={unreadChatCount}
              userVideoType={userVideoType}
              onToggleMute={handleToggleUserMute}
              onToggleVideo={handleToggleUserVideo}
              onToggleHandRaise={() => {
                handleToggleUserHandRaise();
                if (!userParticipant.isHandRaised) {
                  zoomSounds.playMeetHandRaise();
                }
              }}
              onToggleScreenShare={() => setIsScreenSharing(!isScreenSharing)}
              onToggleCaptions={() => setIsCaptionsOn(!isCaptionsOn)}
              onSendReaction={handleSendReaction}
              onToggleChat={() => {
                setIsChatOpen(!isChatOpen);
                if (!isChatOpen) {
                  setUnreadChatCount(0);
                  setIsParticipantsOpen(false);
                  setIsDetailsDrawerOpen(false);
                  setIsActivitiesDrawerOpen(false);
                  setIsHostDrawerOpen(false);
                }
              }}
              onTogglePeople={() => {
                setIsParticipantsOpen(!isParticipantsOpen);
                if (!isParticipantsOpen) {
                  setIsChatOpen(false);
                  setIsDetailsDrawerOpen(false);
                  setIsActivitiesDrawerOpen(false);
                  setIsHostDrawerOpen(false);
                }
              }}
              onToggleDetails={() => {
                setIsDetailsDrawerOpen(!isDetailsDrawerOpen);
                if (!isDetailsDrawerOpen) {
                  setIsChatOpen(false);
                  setIsParticipantsOpen(false);
                  setIsActivitiesDrawerOpen(false);
                  setIsHostDrawerOpen(false);
                }
              }}
              onToggleActivities={() => {
                setIsActivitiesDrawerOpen(!isActivitiesDrawerOpen);
                if (!isActivitiesDrawerOpen) {
                  setIsChatOpen(false);
                  setIsParticipantsOpen(false);
                  setIsDetailsDrawerOpen(false);
                  setIsHostDrawerOpen(false);
                }
              }}
              onToggleHostControls={() => {
                setIsHostDrawerOpen(!isHostDrawerOpen);
                if (!isHostDrawerOpen) {
                  setIsChatOpen(false);
                  setIsParticipantsOpen(false);
                  setIsDetailsDrawerOpen(false);
                  setIsActivitiesDrawerOpen(false);
                }
              }}
              onOpenVirtualBgModal={() => setIsVirtualBgModalOpen(true)}
              onOpenEscapeModal={() => setIsEscapeModalOpen(true)}
              onEndMeeting={() => {
                zoomSounds.playMeetLeaveChime();
                setMeetingState('ended');
              }}
              onSetUserVideoType={(type) => {
                setUserVideoType(type);
                setParticipants((prev) =>
                  prev.map((p) => (p.id === 'me' ? { ...p, videoType: type } : p))
                );
              }}
            />
          ) : (
            <ZoomToolbar
              isMuted={userParticipant.isMuted}
              isVideoOn={userParticipant.isVideoOn}
              isHandRaised={userParticipant.isHandRaised}
              isRecording={isRecording}
              isChatOpen={isChatOpen}
              isParticipantsOpen={isParticipantsOpen}
              isScreenSharing={isScreenSharing}
              participantCount={participants.length}
              unreadChatCount={unreadChatCount}
              userVideoType={userVideoType}
              onToggleMute={handleToggleUserMute}
              onToggleVideo={handleToggleUserVideo}
              onToggleHandRaise={() => {
                handleToggleUserHandRaise();
                if (!userParticipant.isHandRaised) {
                  zoomSounds.playHandRaiseDing();
                }
              }}
              onToggleRecording={() => setIsRecording(!isRecording)}
              onToggleChat={() => {
                setIsChatOpen(!isChatOpen);
                if (!isChatOpen) setUnreadChatCount(0);
              }}
              onToggleParticipants={() => setIsParticipantsOpen(!isParticipantsOpen)}
              onToggleScreenShare={() => setIsScreenSharing(!isScreenSharing)}
              onSendReaction={handleSendReaction}
              onOpenVirtualBgModal={() => setIsVirtualBgModalOpen(true)}
              onOpenEscapeModal={() => setIsEscapeModalOpen(true)}
              onEndMeeting={() => {
                zoomSounds.playLeaveChime();
                setMeetingState('ended');
              }}
              onSetUserVideoType={(type) => {
                setUserVideoType(type);
                setParticipants((prev) =>
                  prev.map((p) => (p.id === 'me' ? { ...p, videoType: type } : p))
                );
              }}
            />
          )}
        </>
      )}

      {/* 4. MODALS & POPUPS */}
      {/* Mass Attendee Controller Modal */}
      {isMassJoinModalOpen && (
        <MassJoinModal
          currentCount={participants.length}
          onSetTotalCount={handleSetTotalCount}
          onAddUsers={handleAddBatchUsers}
          onClose={() => setIsMassJoinModalOpen(false)}
          isStreamJoining={isStreamJoining}
          onToggleStreamJoining={() => setIsStreamJoining(!isStreamJoining)}
          onMassHandRaise={handleMassHandRaise}
        />
      )}

      {/* Tactical Escape / Excuse Toolkit Modal */}
      {isEscapeModalOpen && (
        <FakeEscapeModal
          onClose={() => setIsEscapeModalOpen(false)}
          onToggleFreeze={() => {
            setIsUserFrozen(!isUserFrozen);
            setIsEscapeModalOpen(false);
          }}
          isFrozen={isUserFrozen}
          onTriggerSpreadsheetOverlay={() => {
            setIsScreenSharing(true);
            setIsEscapeModalOpen(false);
          }}
        />
      )}

      {/* Virtual Background Modal */}
      {isVirtualBgModalOpen && (
        <VirtualBackgroundModal
          currentBgId={userVirtualBg}
          onSelectBackground={(bgUrl) => {
            setUserVirtualBg(bgUrl);
            setParticipants((prev) =>
              prev.map((p) => (p.id === 'me' ? { ...p, virtualBg: bgUrl } : p))
            );
          }}
          onClose={() => setIsVirtualBgModalOpen(false)}
        />
      )}

      {/* Add Custom Fake Attendee Modal */}
      {isAddUserModalOpen && (
        <CustomUserModal
          onAddParticipant={(newP) => {
            setParticipants((prev) => [...prev, newP]);
            zoomSounds.playJoinChime();
          }}
          onClose={() => setIsAddUserModalOpen(false)}
          onOpenMassJoin={() => setIsMassJoinModalOpen(true)}
        />
      )}

      {/* Direct Link Join Modal */}
      {isDirectJoinModalOpen && (
        <DirectJoinModal
          currentPlatform={platform}
          currentTopic={topic}
          currentParticipantCount={participants.length}
          onDirectJoin={handleDirectJoinMeeting}
          onClose={() => setIsDirectJoinModalOpen(false)}
        />
      )}

      {/* Switch Scenario Presets Modal */}
      {isScenarioModalOpen && (
        <MeetingScenarioPickerModal
          currentScenarioId={currentScenario.id}
          onSelectScenario={handleSelectScenario}
          onClose={() => setIsScenarioModalOpen(false)}
        />
      )}
    </div>
  );
}
