// src/utils/metaPixel.ts - Meta (Facebook) Pixel Event Tracker

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

/**
 * Safely trigger any Meta Pixel custom or standard event
 */
export const trackPixelEvent = (eventName: string, params?: Record<string, any>) => {
  try {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      if (params) {
        window.fbq('track', eventName, params);
      } else {
        window.fbq('track', eventName);
      }
      console.log(`[Meta Pixel] Event tracked: ${eventName}`, params);
    }
  } catch (err) {
    console.warn('[Meta Pixel] Failed to send event:', err);
  }
};

/**
 * Step 3A: When student starts Free Round / Practice Simulation
 */
export const trackViewContent = (
  contentName: string = 'Free Quiz Round',
  contentCategory: string = 'Patente B Trial'
) => {
  trackPixelEvent('ViewContent', {
    content_name: contentName,
    content_category: contentCategory,
  });
};

/**
 * Step 3B: When student clicks "Pay Now" / "ভর্তি হন" to initiate checkout
 */
export const trackInitiateCheckout = (
  value: number = 49,
  currency: string = 'EUR',
  contentName: string = 'Patente Bangla Pro Pass'
) => {
  trackPixelEvent('InitiateCheckout', {
    value,
    currency,
    content_name: contentName,
  });
};

/**
 * Step 3C: When student successfully completes purchase / unlocks full course
 */
export const trackPurchase = (
  value: number = 49,
  currency: string = 'EUR',
  contentName: string = 'Patente Bangla Pro Pass - 240 Rounds'
) => {
  trackPixelEvent('Purchase', {
    value,
    currency,
    content_name: contentName,
  });
};

