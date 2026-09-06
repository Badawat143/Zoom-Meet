import { MeetingScenario, Participant } from '../types';
import { generateMassParticipants } from './participantGenerator';

export const VIRTUAL_BACKGROUNDS = [
  { id: 'none', name: 'None', preview: 'bg-zinc-800' },
  { id: 'blur', name: 'Blur', preview: 'bg-gradient-to-tr from-slate-700 to-zinc-900 backdrop-blur-md' },
  { id: 'office_loft', name: 'Modern Loft Office', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80' },
  { id: 'penthouse', name: 'High-Rise City View', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80' },
  { id: 'cozy_books', name: 'Cozy Library Bookshelf', url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&auto=format&fit=crop&q=80' },
  { id: 'golden_gate', name: 'San Francisco Bay', url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&auto=format&fit=crop&q=80' },
  { id: 'tropical', name: 'Tropical Beach Sunset', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80' },
  { id: 'space', name: 'Deep Space Nebula', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80' },
  { id: 'cat_room', name: 'Cat Meme Living Room', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1200&auto=format&fit=crop&q=80' },
];

export const INITIAL_USER: Participant = {
  id: 'me',
  name: 'Alex Rivera (You)',
  role: 'Product Lead',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  gender: 'male',
  voicePitch: 0.85,
  voiceRate: 1.0,
  videoType: 'avatar',
  isVideoOn: true,
  isMuted: false,
  isSpeaking: false,
  isHandRaised: false,
  isHost: true,
  connectionQuality: 'excellent',
  audioLevel: 0,
  behavior: 'quiet',
};

export const MEETING_SCENARIOS: MeetingScenario[] = [
  {
    id: 'chaotic_all_hands',
    name: '100+ Person Global Company All-Hands',
    badge: '100+ Attendees (Default)',
    description: 'Full 100+ employee company all-hands with CEO presentation, active chatter, audience reactions, and paginated gallery view.',
    topic: 'Global Company All-Hands & Weekly Demo Hour (100+ Online)',
    meetingId: '492 8819 0293',
    meetCode: 'all-hand-demo',
    passcode: '883912',
    hostName: 'Jessica Miller (CEO)',
    participants: generateMassParticipants(100),
    initialChat: [
      {
        id: 'ch1',
        senderId: 'leader_1',
        senderName: 'Jessica Miller (CEO)',
        senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
        text: 'Welcome everyone to our Global 100+ All-Hands! Glad to see so many joined today 🎉',
        timestamp: '11:00 AM'
      },
      {
        id: 'ch2',
        senderId: 'p_gen_2',
        senderName: 'Elena Rostova (CFO)',
        senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        text: 'Sharing the Q3 Financial Summary spreadsheet with everyone in the thread.',
        timestamp: '11:02 AM'
      },
      {
        id: 'ch3',
        senderId: 'p_gen_5',
        senderName: 'Marcus Chen',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
        text: 'Big congrats to the engineering team for 99.99% uptime! 🚀🚀',
        timestamp: '11:03 AM'
      },
      {
        id: 'ch4',
        senderId: 'p_gen_14',
        senderName: 'Sofia Martinez',
        senderAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
        text: 'Peanut says hi from the CS department! 🐶',
        timestamp: '11:05 AM'
      }
    ],
    defaultScreenSharePreset: 'allhands_slides'
  },
  {
    id: 'global_townhall_250',
    name: '250+ Person Mega Townhall & Keynote',
    badge: '250+ Attendees',
    description: 'Massive enterprise townhall with 250 active participants across multiple Zoom gallery pages.',
    topic: 'Enterprise Global Townhall & Strategic Vision 2026',
    meetingId: '801 2948 1194',
    meetCode: 'twn-hall-2026',
    passcode: '202600',
    hostName: 'Dr. Evelyn Reed (VP)',
    participants: generateMassParticipants(250),
    initialChat: [
      {
        id: 'gt1',
        senderId: 'leader_1',
        senderName: 'Dr. Evelyn Reed',
        senderAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80',
        text: 'Welcome all 250+ attendees joining from North America, EMEA, and APAC offices!',
        timestamp: '09:00 AM'
      },
      {
        id: 'gt2',
        senderId: 'p_gen_7',
        senderName: 'Aarav Sharma',
        senderAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
        text: 'Audio and screen share look crystal clear from Bangalore office! 👍',
        timestamp: '09:02 AM'
      }
    ],
    defaultScreenSharePreset: 'financial_dashboard'
  },
  {
    id: 'executive_review',
    name: 'Executive Board & Q3 KPI Review',
    badge: 'Formal / High-Stakes',
    description: 'High-level executive meeting with VP of Product, CFO, and Directors analyzing quarterly retention metrics.',
    topic: 'Q3 Product Strategy & Global ARR Target Review',
    meetingId: '849 2931 0492',
    meetCode: 'q3-exec-revw',
    passcode: '902184',
    hostName: 'David Vance (VP Product)',
    participants: [
      INITIAL_USER,
      {
        id: 'p1',
        name: 'David Vance (VP Product)',
        role: 'VP of Product',
        company: 'Apex Technologies',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        gender: 'male',
        voicePitch: 0.82,
        voiceRate: 0.98,
        videoType: 'preset_video',
        isVideoOn: true,
        isMuted: false,
        isSpeaking: true,
        isHost: true,
        isHandRaised: false,
        connectionQuality: 'excellent',
        audioLevel: 75,
        behavior: 'executive',
        speechScript: [
          'Looking at the cohort breakdown on slide 4, our net revenue retention jumped 18% month over month.',
          'Let’s make sure we align on the Q4 roadmap by next Tuesday.',
          'Alex, what does the customer feedback look like on the enterprise tier rollouts?',
          'Great question Sarah, our churn rate is currently at an all-time low of 1.2%.'
        ]
      },
      {
        id: 'p2',
        name: 'Elena Rostova (CFO)',
        role: 'Chief Financial Officer',
        company: 'Apex Technologies',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        gender: 'female',
        voicePitch: 1.15,
        voiceRate: 0.98,
        videoType: 'preset_video',
        isVideoOn: true,
        isMuted: true,
        isSpeaking: false,
        isHost: false,
        isCoHost: true,
        isHandRaised: false,
        connectionQuality: 'excellent',
        audioLevel: 0,
        behavior: 'nodder',
        speechScript: [
          'I’ve audited the infrastructure burn rate; we are well within our margin expectations for this quarter.',
          'Let’s make sure the gross margin models factor in the upcoming server expansion.'
        ]
      },
      {
        id: 'p3',
        name: 'Marcus Chen (Head of Eng)',
        role: 'Head of Engineering',
        company: 'Apex Technologies',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
        gender: 'male',
        voicePitch: 0.78,
        voiceRate: 1.04,
        videoType: 'preset_video',
        isVideoOn: true,
        isMuted: true,
        isSpeaking: false,
        isHost: false,
        isHandRaised: false,
        connectionQuality: 'excellent',
        audioLevel: 0,
        behavior: 'nodder',
      },
      {
        id: 'p4',
        name: 'Sarah Jenkins (Director of Ops)',
        role: 'Director of Operations',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
        gender: 'female',
        voicePitch: 1.25,
        voiceRate: 1.02,
        videoType: 'preset_video',
        isVideoOn: true,
        isMuted: true,
        isSpeaking: false,
        isHost: false,
        isHandRaised: true,
        connectionQuality: 'excellent',
        audioLevel: 0,
        behavior: 'talkative',
      },
      {
        id: 'p5',
        name: 'Vikram Patel (Principal Architect)',
        role: 'Principal Architect',
        avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
        gender: 'male',
        voicePitch: 0.88,
        voiceRate: 1.0,
        videoType: 'preset_video',
        isVideoOn: true,
        isMuted: true,
        isSpeaking: false,
        isHost: false,
        isHandRaised: false,
        connectionQuality: 'good',
        audioLevel: 0,
        behavior: 'quiet',
      }
    ],
    initialChat: [
      {
        id: 'c1',
        senderId: 'p2',
        senderName: 'Elena Rostova (CFO)',
        senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        text: 'Sharing the Q3 Financial Summary spreadsheet with everyone in the thread.',
        timestamp: '10:02 AM'
      },
      {
        id: 'c2',
        senderId: 'p4',
        senderName: 'Sarah Jenkins (Director of Ops)',
        senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
        text: 'Quick heads up: I’ve raised my hand for a quick clarifying question on the EMEA expansion timing.',
        timestamp: '10:04 AM'
      }
    ],
    defaultScreenSharePreset: 'financial_dashboard'
  },
  {
    id: 'tech_standup',
    name: 'Engineering Daily Standup & Sprint Sync',
    badge: 'Casual / Agile',
    description: 'Dev team daily standup discussing PR reviews, blockers, microservice deployment, and coffee.',
    topic: 'Core Frontend & Backend Daily Standup #241',
    meetingId: '912 4028 1195',
    meetCode: 'eng-sync-daily',
    passcode: '481029',
    hostName: 'Marcus Chen (Head of Eng)',
    participants: [
      INITIAL_USER,
      {
        id: 'p3',
        name: 'Marcus Chen (Scrum Master)',
        role: 'Tech Lead',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
        gender: 'male',
        voicePitch: 0.78,
        voiceRate: 1.02,
        videoType: 'preset_video',
        isVideoOn: true,
        isMuted: false,
        isSpeaking: true,
        isHost: true,
        isHandRaised: false,
        connectionQuality: 'excellent',
        audioLevel: 80,
        behavior: 'talkative',
        speechScript: [
          'Alright team, let’s do a quick round of updates. Who wants to kick off sprint blockers?',
          'The CI pipeline should be green now after that cache invalidation fix.',
          'Alex, are you ready to merge the auth token refresh middleware?'
        ]
      },
      {
        id: 'p6',
        name: 'Chloe Zhao (Frontend Dev)',
        role: 'Senior React Engineer',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        gender: 'female',
        voicePitch: 1.28,
        voiceRate: 1.04,
        videoType: 'preset_video',
        isVideoOn: true,
        isMuted: true,
        isSpeaking: false,
        isHost: false,
        isHandRaised: false,
        connectionQuality: 'excellent',
        audioLevel: 0,
        behavior: 'nodder',
      },
      {
        id: 'p7',
        name: 'Toby Miller (DevOps)',
        role: 'Cloud Infra',
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
        gender: 'male',
        voicePitch: 0.88,
        voiceRate: 0.98,
        videoType: 'preset_video',
        isVideoOn: true,
        isMuted: true,
        isSpeaking: false,
        isHost: false,
        isHandRaised: false,
        connectionQuality: 'good',
        audioLevel: 0,
        behavior: 'distracted',
      },
      {
        id: 'p8',
        name: 'Lawyer Cat Filter Guy',
        role: 'QA Engineer',
        avatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop&q=80',
        gender: 'male',
        voicePitch: 0.94,
        voiceRate: 1.0,
        videoType: 'preset_video',
        isVideoOn: true,
        isMuted: true,
        isSpeaking: false,
        isHost: false,
        isHandRaised: false,
        connectionQuality: 'poor',
        audioLevel: 0,
        behavior: 'cat_filter',
        speechScript: [
          'I’m here live, I’m not a cat!',
          'Can someone tell me how to turn off this filter please?'
        ]
      }
    ],
    initialChat: [
      {
        id: 'c4',
        senderId: 'p6',
        senderName: 'Chloe Zhao',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        text: 'Left a couple minor comments on PR #892, looks ready to ship otherwise! 🚀',
        timestamp: '09:31 AM'
      },
      {
        id: 'c5',
        senderId: 'p8',
        senderName: 'Lawyer Cat Filter Guy',
        senderAvatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop&q=80',
        text: 'I am prepared to move forward with the meeting... I am not a cat.',
        timestamp: '09:32 AM'
      }
    ],
    defaultScreenSharePreset: 'code_ide'
  },
  {
    id: 'job_interview',
    name: 'Final Round Panel Job Interview',
    badge: 'Evaluation / Serious',
    description: '3 Senior Interviewers taking notes, assessing architectural depth, culture fit, and leadership.',
    topic: 'Senior Staff Architect Candidate Evaluation - Final Loop',
    meetingId: '772 1948 3019',
    passcode: '319024',
    hostName: 'Dr. Evelyn Reed',
    participants: [
      INITIAL_USER,
      {
        id: 'i1',
        name: 'Dr. Evelyn Reed (Lead Interviewer)',
        role: 'VP of Technology',
        avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80',
        gender: 'female',
        voicePitch: 1.18,
        voiceRate: 0.98,
        videoType: 'preset_video',
        isVideoOn: true,
        isMuted: false,
        isSpeaking: true,
        isHost: true,
        isHandRaised: false,
        connectionQuality: 'excellent',
        audioLevel: 85,
        behavior: 'executive',
        speechScript: [
          'Welcome Alex! Thank you for taking the time to join us today for this final architectural discussion.',
          'Could you walk us through a time you had to make a difficult trade-off between consistency and availability?',
          'That’s a very sound approach. Brian, did you want to dive deeper into the distributed consensus layer?'
        ]
      },
      {
        id: 'i2',
        name: 'Brian Thorne (Principal Systems)',
        role: 'Principal Engineer',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
        gender: 'male',
        voicePitch: 0.74,
        voiceRate: 0.96,
        videoType: 'preset_video',
        isVideoOn: true,
        isMuted: true,
        isSpeaking: false,
        isHost: false,
        isHandRaised: false,
        connectionQuality: 'excellent',
        audioLevel: 0,
        behavior: 'nodder',
      },
      {
        id: 'i3',
        name: 'Maya Lin (People Partner)',
        role: 'Senior Talent Partner',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
        gender: 'female',
        voicePitch: 1.26,
        voiceRate: 1.02,
        videoType: 'preset_video',
        isVideoOn: true,
        isMuted: true,
        isSpeaking: false,
        isHost: false,
        isHandRaised: false,
        connectionQuality: 'excellent',
        audioLevel: 0,
        behavior: 'nodder',
      }
    ],
    initialChat: [
      {
        id: 'ci1',
        senderId: 'i3',
        senderName: 'Maya Lin (People Partner)',
        senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
        text: 'Welcome Alex! Feel free to share your screen or diagram whenever you’re ready.',
        timestamp: '02:01 PM'
      }
    ],
    defaultScreenSharePreset: 'architecture_diagram'
  }
];

export const SCREEN_SHARE_PRESETS = [
  {
    id: 'financial_dashboard',
    name: 'Q3 Enterprise Revenue & SaaS Metrics',
    type: 'dashboard',
    description: 'High-level financial KPIs, ARR charts, CAC payback, and churn rates'
  },
  {
    id: 'code_ide',
    name: 'VS Code - React & TypeScript Auth Module',
    type: 'ide',
    description: 'Dark modern code editor with live syntax highlighting and terminal'
  },
  {
    id: 'architecture_diagram',
    name: 'Cloud Infrastructure & Microservice Topology',
    type: 'diagram',
    description: 'Distributed system nodes, Kafka event stream, Redis clusters, and load balancers'
  },
  {
    id: 'allhands_slides',
    name: 'Keynote - Q4 Strategic Horizons & Vision',
    type: 'slides',
    description: 'Executive slide deck with company pillars and roadmap milestones'
  }
];
