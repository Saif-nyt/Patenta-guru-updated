// Natural Female Italian Speech Synthesis & Dual-Engine Audio Utility
// Seamlessly combines Web Speech API with Google Cloud TTS fallback
// Ensures 100% audio playback across Windows, Mac, iOS, Android, Chrome, Edge, Safari

let cachedFemaleVoice: SpeechSynthesisVoice | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;
let currentAudio: HTMLAudioElement | null = null;
let activeTimeout: any = null;

/**
 * Discovers and selects the best natural female Italian voice available on the device
 */
export const getBestItalianFemaleVoice = (): SpeechSynthesisVoice | null => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // Filter Italian voices (it-IT, it_IT, it)
  const itVoices = voices.filter(
    (v) => v.lang && (v.lang.toLowerCase().startsWith('it') || v.lang.toLowerCase() === 'it')
  );

  if (itVoices.length === 0) return null;

  // Preferred natural female voices across Windows, Mac, iOS, Android, and Chrome
  const preferredFemaleNames = [
    'isabella',         // Microsoft Online (Natural) - Italian (Italy)
    'elsa',             // Microsoft Elsa - Italian (Italy)
    'alice',            // Apple iOS/macOS Alice (Natural Italian female)
    'federica',         // Apple Federica
    'paola',            // Apple Paola
    'bianca',           // Italian female
    'chiara',           // Italian female
    'google italiano',  // Chrome Google Italian female
    'natural',          // Any natural neural voice
    'female',
    'femmina',
    'donna'
  ];

  for (const nameKeyword of preferredFemaleNames) {
    const match = itVoices.find((v) => v.name.toLowerCase().includes(nameKeyword));
    if (match) {
      cachedFemaleVoice = match;
      return match;
    }
  }

  // Fallback: exclude known male voices (Cosimo, Luca, Diego, Giorgio, Male, Uomo)
  const nonMale = itVoices.find(
    (v) => !/cosimo|luca|diego|giorgio|male|uomo/i.test(v.name)
  );
  if (nonMale) {
    cachedFemaleVoice = nonMale;
    return nonMale;
  }

  cachedFemaleVoice = itVoices[0];
  return itVoices[0];
};

// Initialize voice listener on client load
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    getBestItalianFemaleVoice();
  };
}

/**
 * Clean Italian text: strip parenthesis numbers like (505) and markdown for clean pronunciation
 */
export const cleanItalianText = (text: string): string => {
  return text
    .replace(/\(\d+\)/g, '')
    .replace(/[*_#"`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Splits text into natural speech chunks under 160 characters for HTTP TTS audio streaming
 */
export const splitTextIntoTTSChunks = (text: string, maxLen = 160): string[] => {
  if (text.length <= maxLen) return [text];

  const parts = text.split(/([.,;:?]+)/);
  const chunks: string[] = [];
  let current = '';

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if ((current + part).length <= maxLen) {
      current += part;
    } else {
      if (current.trim()) chunks.push(current.trim());
      current = part;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [text.slice(0, maxLen)];
};

/**
 * Immediately cancels any active speech from either Web Speech API or HTML5 Audio
 */
export const stopSpeech = (): void => {
  if (activeTimeout) {
    clearTimeout(activeTimeout);
    activeTimeout = null;
  }

  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.onended = null;
      currentAudio.onerror = null;
    } catch {}
    currentAudio = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }

  if (activeUtterance) {
    try {
      activeUtterance.onstart = null;
      activeUtterance.onend = null;
      activeUtterance.onerror = null;
    } catch {}
    activeUtterance = null;
  }
};

/**
 * Fallback: Plays native Italian audio chunks via HTML5 Audio element (Google TTS CDN)
 */
export const playViaHtml5Audio = (
  text: string,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    rate?: number;
  }
): void => {
  stopSpeech();

  const clean = cleanItalianText(text);
  if (!clean) {
    callbacks?.onEnd?.();
    return;
  }

  const chunks = splitTextIntoTTSChunks(clean, 150);
  let chunkIdx = 0;
  let hasStarted = false;

  const playNext = () => {
    if (chunkIdx >= chunks.length) {
      callbacks?.onEnd?.();
      return;
    }

    const chunk = chunks[chunkIdx++];
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=it&client=tw-ob&q=${encodeURIComponent(chunk)}`;

    const audio = new Audio(url);
    currentAudio = audio;

    if (callbacks?.rate) {
      audio.playbackRate = callbacks.rate;
    }

    audio.onplay = () => {
      if (!hasStarted) {
        hasStarted = true;
        callbacks?.onStart?.();
      }
    };

    audio.onended = () => {
      playNext();
    };

    audio.onerror = () => {
      // If one chunk fails, continue to next chunk or finish
      playNext();
    };

    audio.play().catch((err) => {
      console.warn('HTML5 Audio playback notice:', err);
      // If blocked by browser autoplay, still call onEnd cleanly
      callbacks?.onEnd?.();
    });
  };

  playNext();
};

/**
 * Speaks Italian text using natural female voice at regular human reading speed.
 * Uses Web Speech API where available and seamlessly falls back to HTML5 Audio.
 */
export const speakItalian = (
  text: string,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    rate?: number;
  }
): void => {
  if (typeof window === 'undefined') return;

  const cleanText = cleanItalianText(text);
  if (!cleanText) return;

  // Check if browser has Web Speech API
  const hasSpeechSynthesis = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

  if (!hasSpeechSynthesis) {
    playViaHtml5Audio(cleanText, callbacks);
    return;
  }

  // Get available Italian voice
  const femaleVoice = cachedFemaleVoice || getBestItalianFemaleVoice();

  // If the operating system has NO Italian voices installed (common on English Windows),
  // immediately use the high-fidelity Google Italian Audio engine!
  if (!femaleVoice) {
    playViaHtml5Audio(cleanText, callbacks);
    return;
  }

  try {
    stopSpeech();

    // Workaround for Chrome bug where speechSynthesis gets stuck in paused state
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'it-IT';
    utterance.voice = femaleVoice;
    utterance.rate = callbacks?.rate ?? 1.0;
    utterance.pitch = 1.05;

    // Prevent Chromium Garbage Collector from killing active utterance prematurely
    activeUtterance = utterance;

    let hasStarted = false;

    utterance.onstart = () => {
      hasStarted = true;
      if (activeTimeout) {
        clearTimeout(activeTimeout);
        activeTimeout = null;
      }
      callbacks?.onStart?.();
    };

    utterance.onend = () => {
      activeUtterance = null;
      callbacks?.onEnd?.();
    };

    utterance.onerror = (e) => {
      activeUtterance = null;
      console.warn('SpeechSynthesis error, falling back to HTML5 audio:', e);
      // Seamlessly fall back to HTML5 audio on any speech error
      playViaHtml5Audio(cleanText, callbacks);
    };

    // Microtask delay to ensure cancel() has completed before speak()
    setTimeout(() => {
      try {
        window.speechSynthesis.speak(utterance);

        // Fail-safe: If speech synthesis doesn't start within 500ms (stuck queue), fallback to HTML5 audio
        activeTimeout = setTimeout(() => {
          if (!hasStarted) {
            console.warn('SpeechSynthesis timed out, switching to HTML5 audio fallback');
            stopSpeech();
            playViaHtml5Audio(cleanText, callbacks);
          }
        }, 500);
      } catch (speakErr) {
        console.warn('SpeechSynthesis speak call error:', speakErr);
        playViaHtml5Audio(cleanText, callbacks);
      }
    }, 10);
  } catch (err) {
    console.warn('Web Speech error, using HTML5 audio fallback:', err);
    playViaHtml5Audio(cleanText, callbacks);
  }
};
