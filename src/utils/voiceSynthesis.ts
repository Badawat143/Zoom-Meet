import { Participant } from '../types';

// Speech synthesis controller & voice manager
class VoiceManager {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isSpeaking = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private audioPulseInterval: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && this.synth) {
      this.voices = this.synth.getVoices();
    }
    return this.voices;
  }

  /**
   * Selects the best distinct voice according to participant gender, language, and name hash
   */
  public selectVoiceForParticipant(
    participant: Participant, 
    text: string
  ): { voice: SpeechSynthesisVoice | null; pitch: number; rate: number } {
    const voices = this.getVoices();
    const isHindiText = /[\u0900-\u097F]/.test(text);

    // Filter available voices by language
    let langVoices = voices.filter(v => 
      isHindiText 
        ? v.lang.startsWith('hi') || v.lang.includes('IN')
        : v.lang.startsWith('en')
    );

    if (langVoices.length === 0) {
      langVoices = voices;
    }

    const isFemale = participant.gender === 'female';

    // Heuristics for female vs male voice names in modern browser engines
    const femaleKeywords = ['female', 'woman', 'zira', 'samantha', 'victoria', 'karen', 'moira', 'fiona', 'veena', 'leena', 'kavya', 'priya', 'swara', 'geeta', 'girl', 'eva', 'serena'];
    const maleKeywords = ['male', 'man', 'david', 'alex', 'daniel', 'george', 'guy', 'fred', 'rishi', 'anil', 'madhav', 'boy', 'oliver', 'rory', 'tom', 'mark'];

    let genderMatchedVoices = langVoices.filter(v => {
      const vName = v.name.toLowerCase();
      if (isFemale) {
        return femaleKeywords.some(kw => vName.includes(kw)) || (!maleKeywords.some(kw => vName.includes(kw)) && vName.includes('female'));
      } else {
        return maleKeywords.some(kw => vName.includes(kw)) || (!femaleKeywords.some(kw => vName.includes(kw)) && vName.includes('male'));
      }
    });

    if (genderMatchedVoices.length === 0) {
      genderMatchedVoices = langVoices;
    }

    // Deterministic voice index using participant ID
    let hash = 0;
    const key = participant.id + participant.name;
    for (let i = 0; i < key.length; i++) {
      hash = (hash << 5) - hash + key.charCodeAt(i);
      hash |= 0;
    }
    const safeHash = Math.abs(hash);

    const chosenVoice = genderMatchedVoices.length > 0 
      ? genderMatchedVoices[safeHash % genderMatchedVoices.length] 
      : null;

    // Distinct pitch & rate per member:
    // Female pitch: 1.05 to 1.35 (lighter, higher tone)
    // Male pitch: 0.72 to 0.95 (deeper, baritone/tenor tone)
    const pitchVariation = (safeHash % 25) / 100; // 0.00 to 0.24
    const rateVariation = ((safeHash % 15) - 7) / 100; // -0.07 to +0.07

    const finalPitch = isFemale 
      ? Math.max(1.02, Math.min(1.40, (participant.voicePitch || 1.15) + pitchVariation * 0.5))
      : Math.max(0.68, Math.min(0.96, (participant.voicePitch || 0.82) - pitchVariation * 0.4));

    const finalRate = Math.max(0.88, Math.min(1.15, (participant.voiceRate || 1.0) + rateVariation));

    return {
      voice: chosenVoice,
      pitch: finalPitch,
      rate: finalRate
    };
  }

  /**
   * Speaks out a text response with active waveform updates and status callbacks
   */
  public speak(
    text: string,
    participant: Participant,
    onStart?: () => void,
    onEnd?: () => void,
    onAudioLevel?: (level: number) => void
  ): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onStart) onStart();
      setTimeout(() => { if (onEnd) onEnd(); }, 3500);
      return false;
    }

    try {
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      const { voice, pitch, rate } = this.selectVoiceForParticipant(participant, text);

      if (voice) {
        utterance.voice = voice;
      }

      // Check if text is Hindi
      if (/[\u0900-\u097F]/.test(text)) {
        utterance.lang = 'hi-IN';
      } else {
        utterance.lang = 'en-US';
      }

      utterance.pitch = pitch;
      utterance.rate = rate;

      utterance.onstart = () => {
        this.isSpeaking = true;
        if (onStart) onStart();

        // Simulate lively audio waveform pulses while speaking
        if (onAudioLevel) {
          if (this.audioPulseInterval) clearInterval(this.audioPulseInterval);
          this.audioPulseInterval = setInterval(() => {
            const randomLevel = Math.floor(Math.random() * 55) + 40; // 40 to 95
            onAudioLevel(randomLevel);
          }, 120);
        }
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        if (this.audioPulseInterval) {
          clearInterval(this.audioPulseInterval);
          this.audioPulseInterval = null;
        }
        if (onAudioLevel) onAudioLevel(0);
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        this.isSpeaking = false;
        if (this.audioPulseInterval) {
          clearInterval(this.audioPulseInterval);
          this.audioPulseInterval = null;
        }
        if (onAudioLevel) onAudioLevel(0);
        if (onEnd) onEnd();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      console.error('Failed to run speech synthesis:', err);
      if (onStart) onStart();
      setTimeout(() => { if (onEnd) onEnd(); }, 3000);
      return false;
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    if (this.audioPulseInterval) {
      clearInterval(this.audioPulseInterval);
      this.audioPulseInterval = null;
    }
  }

  public isCurrentlySpeaking(): boolean {
    return this.isSpeaking || (typeof window !== 'undefined' && window.speechSynthesis?.speaking);
  }
}

export const voiceEngine = new VoiceManager();

/**
 * Web Speech Recognition helper for user live microphone voice asking
 */
export function createSpeechRecognizer(
  onResult: (transcript: string) => void,
  onEnd: () => void,
  onError?: (error: string) => void,
  lang: string = 'en-US'
) {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang; // 'en-US' or 'hi-IN'

    recognition.onresult = (event: any) => {
      if (event.results && event.results[0] && event.results[0][0]) {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      if (onError) onError(event.error || 'Speech recognition error');
    };

    recognition.onend = () => {
      onEnd();
    };

    return recognition;
  } catch (e: any) {
    console.warn('SpeechRecognition initialization error:', e);
    return null;
  }
}
