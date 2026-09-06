import { Participant, ParticipantBehavior } from '../types';

// High-quality diverse human portrait URLs
export const DIVERSE_AVATAR_URLS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534751516642-a171488a0026?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
];

export const FEMALE_NAMES = new Set([
  'Abigail', 'Aditi', 'Amara', 'Ananya', 'Angela', 'Aria', 'Charlotte', 'Chloe', 
  'Elena', 'Emily', 'Emma', 'Fatima', 'Grace', 'Hannah', 'Harper', 'Isabella', 
  'Jasmine', 'Jessica', 'Julia', 'Kavita', 'Luna', 'Maya', 'Mei', 'Mia', 
  'Nadia', 'Olivia', 'Pooja', 'Priya', 'Samantha', 'Sarah', 'Sneha', 'Sofia', 
  'Sophia', 'Tanvi', 'Valerie', 'Yuki', 'Zara', 'Zoey', 'Evelyn'
]);

const FIRST_NAMES = [
  'Aarav', 'Abigail', 'Aditi', 'Alex', 'Amara', 'Amit', 'Ananya', 'Andreas', 'Angela', 'Anthony',
  'Aria', 'Benjamin', 'Carlos', 'Charlotte', 'Chloe', 'Daniel', 'David', 'Deepak', 'Elena', 'Emily',
  'Emma', 'Ethan', 'Fatima', 'Gabriel', 'Grace', 'Hannah', 'Harper', 'Hassan', 'Henry', 'Isabella',
  'Jack', 'James', 'Jasmine', 'Jessica', 'Jin', 'John', 'Jonathan', 'Julia', 'Karan', 'Kenji',
  'Kavita', 'Liam', 'Lucas', 'Luna', 'Marcus', 'Maya', 'Mei', 'Michael', 'Mia', 'Nadia',
  'Nathan', 'Noah', 'Oliver', 'Olivia', 'Pooja', 'Priya', 'Rahul', 'Ravi', 'Rohan', 'Samantha',
  'Sameer', 'Samuel', 'Sarah', 'Sneha', 'Sofia', 'Siddharth', 'Sophia', 'Tanvi', 'Tariq', 'Thomas',
  'Toby', 'Tyler', 'Valerie', 'Vikram', 'William', 'Yuki', 'Zack', 'Zain', 'Zara', 'Zoey'
];

const LAST_NAMES = [
  'Sharma', 'Patel', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore',
  'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez',
  'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen',
  'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards',
  'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz',
  'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox',
  'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza',
  'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Verma', 'Gupta', 'Singh'
];

const ROLES = [
  'Software Engineer', 'Senior Frontend Dev', 'Backend Lead', 'Product Manager', 'UX Designer',
  'DevOps Architect', 'QA Engineer', 'Data Scientist', 'VP of Engineering', 'Director of Ops',
  'Account Executive', 'Customer Success', 'Scrum Master', 'Security Analyst', 'AI Researcher',
  'Growth Marketer', 'Content Strategist', 'Finance Director', 'HR Business Partner', 'Staff Engineer',
  'Chief Architect', 'Technical Writer', 'Cloud Consultant', 'Solutions Architect', 'Sales Lead',
  'Operations Manager', 'Billing Specialist', 'Legal Counsel', 'Brand Manager', 'Product Analyst'
];

const BEHAVIORS: ParticipantBehavior[] = [
  'nodder', 'quiet', 'distracted', 'talkative', 'executive', 'eater', 'cat_filter', 'sleeping'
];

const SPEECH_SNIPPETS = [
  'I agree with the roadmap proposed for this quarter.',
  'Let me follow up with the platform team on that ticket.',
  'Great point, I’ll drop the Google Doc link in the chat.',
  'Can everyone see the updated spreadsheet on my screen?',
  'We observed a 24% boost in test suite performance this week.',
  'Thanks for the shoutout, the team worked hard on the release!',
  'Quick question: does this affect the European region endpoints?',
  'I’m aligned on the timeline, let’s sync tomorrow morning.',
  'Let’s make sure we test backwards compatibility first.',
  'Sending the updated slide deck right after this call.'
];

export function generateMassParticipants(totalCount: number, currentUserId = 'me'): Participant[] {
  const participants: Participant[] = [];

  // Always keep user as first participant
  participants.push({
    id: currentUserId,
    name: 'Alex Rivera (You)',
    role: 'Host & Product Lead',
    company: 'Apex Global Technologies',
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
    behavior: 'executive',
  });

  // Host / Co-host key speakers
  const keyLeaders = [
    {
      name: 'Jessica Miller (CEO)',
      role: 'Chief Executive Officer',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      gender: 'female' as const,
      voicePitch: 1.22,
      voiceRate: 1.02,
      isSpeaking: true,
      isHost: false,
      isCoHost: true,
      isMuted: false,
      isVideoOn: true,
      behavior: 'executive' as ParticipantBehavior,
      script: [
        'Welcome everyone to our Global 100+ All-Hands meeting!',
        'Thank you all for tuning in across our global offices.',
        'Let’s dive into our quarterly accomplishments and team awards.'
      ]
    },
    {
      name: 'David Vance (VP Product)',
      role: 'VP of Product',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      gender: 'male' as const,
      voicePitch: 0.82,
      voiceRate: 0.98,
      isSpeaking: false,
      isHost: false,
      isCoHost: true,
      isMuted: true,
      isVideoOn: true,
      behavior: 'executive' as ParticipantBehavior,
      script: ['Our core retention numbers reached an all-time high of 94.8%!']
    },
    {
      name: 'Elena Rostova (CFO)',
      role: 'Chief Financial Officer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      gender: 'female' as const,
      voicePitch: 1.15,
      voiceRate: 0.96,
      isSpeaking: false,
      isHost: false,
      isCoHost: true,
      isMuted: true,
      isVideoOn: true,
      behavior: 'nodder' as ParticipantBehavior,
    },
    {
      name: 'Marcus Chen (Head of Eng)',
      role: 'Head of Engineering',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      gender: 'male' as const,
      voicePitch: 0.78,
      voiceRate: 1.04,
      isSpeaking: false,
      isHost: false,
      isCoHost: false,
      isMuted: true,
      isVideoOn: true,
      behavior: 'nodder' as ParticipantBehavior,
    }
  ];

  keyLeaders.forEach((leader, idx) => {
    if (participants.length < totalCount) {
      participants.push({
        id: `leader_${idx + 1}`,
        name: leader.name,
        role: leader.role,
        avatarUrl: leader.avatar,
        gender: leader.gender,
        voicePitch: leader.voicePitch,
        voiceRate: leader.voiceRate,
        videoType: 'preset_video',
        isVideoOn: leader.isVideoOn,
        isMuted: leader.isMuted,
        isSpeaking: leader.isSpeaking,
        isHandRaised: false,
        isHost: leader.isHost,
        isCoHost: leader.isCoHost,
        connectionQuality: 'excellent',
        audioLevel: leader.isSpeaking ? 80 : 0,
        behavior: leader.behavior,
        speechScript: leader.script,
        currentSpeechIndex: 0
      });
    }
  });

  // Generate the rest of the 100+ participants
  const remainingNeeded = totalCount - participants.length;
  for (let i = 0; i < remainingNeeded; i++) {
    const numId = i + 1;
    const firstName = FIRST_NAMES[(numId * 7 + 3) % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(numId * 13 + 5) % LAST_NAMES.length];
    const avatarUrl = DIVERSE_AVATAR_URLS[numId % DIVERSE_AVATAR_URLS.length];
    const role = ROLES[numId % ROLES.length];
    
    const isFemale = FEMALE_NAMES.has(firstName) || numId % 2 === 0;
    const gender: 'female' | 'male' = isFemale ? 'female' : 'male';
    const voicePitch = isFemale ? 1.08 + (numId % 25) * 0.01 : 0.72 + (numId % 20) * 0.01;
    const voiceRate = 0.95 + (numId % 15) * 0.01;

    // Realistic distribution for mass meetings:
    // ~75% have video on, ~25% off
    const isVideoOn = (numId % 4 !== 0);
    // Almost everyone is muted in large calls, except 2-3 random people
    const isMuted = numId > 3;
    const isHandRaised = numId % 14 === 0; // occasional hand raises
    const behavior = BEHAVIORS[numId % BEHAVIORS.length];
    const connectionQuality = numId % 19 === 0 ? 'poor' : numId % 37 === 0 ? 'frozen' : 'excellent';

    participants.push({
      id: `p_gen_${numId}_${Date.now()}`,
      name: `${firstName} ${lastName}`,
      role: role,
      company: 'Apex Global',
      avatarUrl: avatarUrl,
      gender: gender,
      voicePitch: Number(voicePitch.toFixed(2)),
      voiceRate: Number(voiceRate.toFixed(2)),
      videoType: 'preset_video',
      isVideoOn: isVideoOn,
      isMuted: isMuted,
      isSpeaking: false,
      isHandRaised: isHandRaised,
      isHost: false,
      isCoHost: numId === 8 || numId === 12,
      connectionQuality: connectionQuality,
      audioLevel: 0,
      behavior: behavior,
      speechScript: [
        SPEECH_SNIPPETS[numId % SPEECH_SNIPPETS.length],
        `+1 from ${firstName} in the ${role.split(' ')[0]} team!`
      ],
      currentSpeechIndex: 0
    });
  }

  return participants;
}
