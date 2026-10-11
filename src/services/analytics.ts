// Google Analytics 4 (GA4) & Event Tracking Service
// Measurement ID: G-5W892DWMHR

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const GA_MEASUREMENT_ID = 'G-5W892DWMHR';

/**
 * Safe wrapper for sending gtag events
 */
export const trackEvent = (
  eventName: string,
  eventParams: Record<string, string | number | boolean | undefined> = {}
) => {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventParams);
    }
  } catch (err) {
    console.debug('Analytics trackEvent notice:', err);
  }
};

/**
 * Track navigation page or tab views
 */
export const trackPageView = (pageName: string, path: string = window.location.pathname) => {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_title: pageName,
        page_path: path,
        send_to: GA_MEASUREMENT_ID,
      });
    }
  } catch {}
};

/**
 * Track when a user starts an exam or round
 */
export const trackExamStart = (roundId?: number) => {
  trackEvent('exam_start', {
    round_id: roundId || 'mock_test',
    type: roundId ? 'curriculum_round' : 'standard_simulation',
  });
};

/**
 * Track exam completion and score
 */
export const trackExamSubmit = (
  roundId: number | undefined,
  score: number,
  passed: boolean,
  errors: number
) => {
  trackEvent('exam_complete', {
    round_id: roundId || 'mock_test',
    score_percentage: score,
    passed,
    error_count: errors,
  });
};

/**
 * Track theme change (Dark, Light, Sepia)
 */
export const trackThemeChange = (themeName: string) => {
  trackEvent('theme_change', {
    theme: themeName,
  });
};

/**
 * Track when audio pronunciation is played
 */
export const trackAudioPlay = (questionId?: string) => {
  trackEvent('audio_play', {
    question_id: questionId || 'unknown',
  });
};

/**
 * Track checkout or payment start
 */
export const trackPaymentStart = (roundId: number, amountEur: number = 49) => {
  trackEvent('begin_checkout', {
    value: amountEur,
    currency: 'EUR',
    attempted_round: roundId,
  });
};

/**
 * Track student signup or lead capture
 */
export const trackStudentRegistration = (method: 'firebase' | 'local' = 'firebase') => {
  trackEvent('sign_up', {
    method,
  });
};

/**
 * Track WhatsApp student group join click
 */
export const trackWhatsAppJoin = (source: string = 'registration_modal') => {
  trackEvent('whatsapp_group_join', {
    source,
    group_link: 'https://chat.whatsapp.com/ByoJ9BxIbRvF7Bu5LykErV?mode=gi_t',
  });
};

