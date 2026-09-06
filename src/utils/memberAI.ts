import { Participant } from '../types';

export interface MemberAnswerResult {
  answer: string;
  source: 'gemini' | 'offline_engine';
  isHindi: boolean;
}

/**
 * Searches for a mentioned participant in user speech/text
 */
export function findMentionedParticipant(
  query: string,
  participants: Participant[]
): Participant | null {
  if (!query || query.trim().length === 0) return null;

  const normalized = query.toLowerCase().replace(/[@,#,!,?,.,:]/g, ' ');
  const words = normalized.split(/\s+/).filter(w => w.length > 1);

  // 1. Exact full name match (excluding 'You')
  for (const p of participants) {
    if (p.id === 'me') continue;
    const cleanName = p.name.replace(/\(.*\)/g, '').trim().toLowerCase();
    if (normalized.includes(cleanName)) {
      return p;
    }
  }

  // 2. First name match
  for (const p of participants) {
    if (p.id === 'me') continue;
    const firstName = p.name.split(' ')[0].replace(/[^a-zA-Z]/g, '').toLowerCase();
    if (firstName && words.includes(firstName)) {
      return p;
    }
  }

  // 3. Partial / Soundex-like matching for common names
  for (const p of participants) {
    if (p.id === 'me') continue;
    const firstName = p.name.split(' ')[0].toLowerCase();
    if (firstName.length >= 3 && words.some(w => w.startsWith(firstName) || firstName.startsWith(w))) {
      return p;
    }
  }

  return null;
}

/**
 * Generates an accurate, professional answer for the participant
 */
export async function getMemberAnswer(
  participant: Participant,
  question: string,
  meetingTopic: string
): Promise<MemberAnswerResult> {
  const isHindi = /[\u0900-\u097F]/.test(question) || 
    /\b(kya|kaise|batao|kripya|haan|nahi|kuch|aap|namaste|shukriya)\b/i.test(question);

  // 1. Attempt Server-side Gemini API call
  try {
    const res = await fetch('/api/member-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memberName: participant.name,
        memberRole: participant.role || 'Colleague',
        memberGender: participant.gender,
        meetingTopic: meetingTopic,
        question: question,
        isHindi
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.answer) {
        return {
          answer: data.answer,
          source: 'gemini',
          isHindi
        };
      }
    }
  } catch (err) {
    console.log('Using offline conversational engine fallback');
  }

  // 2. Intelligent Offline Fallback Engine
  const offlineAnswer = generateOfflineRoleAnswer(participant, question, isHindi, meetingTopic);
  return {
    answer: offlineAnswer,
    source: 'offline_engine',
    isHindi
  };
}

function generateOfflineRoleAnswer(
  participant: Participant,
  question: string,
  isHindi: boolean,
  topic: string
): string {
  const qLower = question.toLowerCase();
  const role = (participant.role || '').toLowerCase();
  const name = participant.name.split(' ')[0];

  // HINDI RESPONSES
  if (isHindi) {
    if (qLower.includes('namaste') || qLower.includes('kaise') || qLower.includes('kya haal')) {
      return `नमस्ते! मैं बिल्कुल ठीक हूँ और मीटिंग को पूरी तरह से फॉलो कर रहा हूँ। बताइए, मैं आपकी क्या मदद कर सकता हूँ?`;
    }
    if (qLower.includes('status') || qLower.includes('update') || qLower.includes('kaam') || qLower.includes('kahan tak')) {
      if (role.includes('eng') || role.includes('dev') || role.includes('architect')) {
        return `हमारी टीम ने कोर मॉड्यूल पूरा कर लिया है और टेस्टिंग बहुत अच्छी चल रही है। अगले 24 घंटे में डिप्लॉयमेंट रेडी हो जाएगा।`;
      }
      if (role.includes('finance') || role.includes('cfo')) {
        return `वित्तीय ऑडिट के अनुसार हमारा बजट और क्वार्टरली खर्च बिल्कुल नियंत्रण में है।`;
      }
      return `प्रोजेक्ट का काम पूरी तरह शेड्यूल पर है और सभी माइलस्टोन्स समय पर पूरे हो रहे हैं।`;
    }
    if (qLower.includes('budget') || qLower.includes('paisa') || qLower.includes('cost') || qLower.includes('kharcha')) {
      return `हमारा Q3/Q4 बजट मॉडल पूरी तरह से अप्रूव्ड है और हम निर्धारित मार्जिन के अंदर काम कर रहे हैं।`;
    }
    if (qLower.includes('kab') || qLower.includes('deadline') || qLower.includes('time')) {
      return `हमारा टारगेट इस सप्ताह के अंत तक पूरा करने का है। सब कुछ ऑन ट्रैक है।`;
    }
    return `जी बिल्कुल, मैं इस पर सहमत हूँ। मैं डिटेल एनालिसिस तैयार करके चैट में शेयर कर दूँगा।`;
  }

  // ENGLISH RESPONSES BY ROLE & QUESTION TOPIC

  // Greeting & Check-in
  if (qLower.includes('how are you') || qLower.includes('hello') || qLower.includes('hi') || qLower.includes('good morning')) {
    return `Hey Alex! Doing great, thanks for checking in. Ready to dive into the agenda today.`;
  }

  // Engineering / Architecture / Tech questions
  if (role.includes('eng') || role.includes('dev') || role.includes('architect') || role.includes('scrum') || role.includes('devops')) {
    if (qLower.includes('deploy') || qLower.includes('pipeline') || qLower.includes('build') || qLower.includes('ci')) {
      return `The latest build passed all integration tests, and the canary deployment is currently running at 100% health.`;
    }
    if (qLower.includes('blocker') || qLower.includes('issue') || qLower.includes('bug')) {
      return `No critical blockers on our end. We resolved the edge-case latency spike yesterday with a Redis cache patch.`;
    }
    if (qLower.includes('status') || qLower.includes('progress') || qLower.includes('sprint') || qLower.includes('update')) {
      return `We are tracking at 92% sprint completion. The remaining PRs are under peer review and will merge before EOD.`;
    }
    if (qLower.includes('architecture') || qLower.includes('database') || qLower.includes('backend') || qLower.includes('api')) {
      return `We designed the microservices with distributed idempotency and zero-downtime database migrations to guarantee 99.99% uptime.`;
    }
    return `From a technical standpoint, everything is fully decoupled and tested. I'll drop the pull request link in the chat.`;
  }

  // Finance / CFO / Budget questions
  if (role.includes('finance') || role.includes('cfo') || role.includes('ops') || role.includes('director')) {
    if (qLower.includes('budget') || qLower.includes('burn') || qLower.includes('revenue') || qLower.includes('margin') || qLower.includes('cost')) {
      return `Our cloud unit economics improved by 14% this quarter, so we are comfortably ahead of our gross margin targets.`;
    }
    if (qLower.includes('timeline') || qLower.includes('forecast') || qLower.includes('quarter')) {
      return `The Q3 numbers reflect strong net expansion, and our revised financial forecast is ready for board sign-off.`;
    }
    return `The financial metrics align with our operational plan, and we have enough runway allocated for all upcoming hires.`;
  }

  // Executive / CEO / VP Product
  if (role.includes('ceo') || role.includes('vp') || role.includes('product') || role.includes('lead')) {
    if (qLower.includes('vision') || qLower.includes('goal') || qLower.includes('strategy') || qLower.includes('roadmap')) {
      return `Our top priority this half is deepening enterprise adoption while sustaining our best-in-class 94% retention rate.`;
    }
    if (qLower.includes('feedback') || qLower.includes('customer') || qLower.includes('user') || qLower.includes('client')) {
      return `Early feedback from our tier-one enterprise partners has been overwhelmingly positive, especially on responsiveness.`;
    }
    return `Great point Alex. I'm completely aligned on these deliverables, let's keep the momentum going across all teams!`;
  }

  // Generic Smart Workplace Response
  return `That makes total sense. I've reviewed the requirements and I'm aligned with moving forward on this schedule.`;
}
