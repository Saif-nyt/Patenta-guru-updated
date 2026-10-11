import Stripe from 'stripe';
import { getCollection } from './_db.js';

let cachedStripeKey = '';

async function getStripeSecretKey() {
  if (process.env.STRIPE_SECRET_KEY) {
    return process.env.STRIPE_SECRET_KEY.trim();
  }

  if (cachedStripeKey) {
    return cachedStripeKey;
  }

  // Fallback to MongoDB Atlas settings
  try {
    const settingsCol = await getCollection('settings');
    const doc = await settingsCol.findOne({ key: 'app_settings' });
    if (doc?.stripeSecretKey) {
      cachedStripeKey = doc.stripeSecretKey.trim();
      return cachedStripeKey;
    }
  } catch (err) {
    console.warn('Could not read stripeSecretKey from MongoDB settings:', err.message);
  }

  return '';
}

let cachedWebhookSecret = '';

export async function getStripeWebhookSecret() {
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    return process.env.STRIPE_WEBHOOK_SECRET.trim();
  }

  if (cachedWebhookSecret) {
    return cachedWebhookSecret;
  }

  // Fallback to MongoDB Atlas settings
  try {
    const settingsCol = await getCollection('settings');
    const doc = await settingsCol.findOne({ key: 'app_settings' });
    if (doc?.stripeWebhookSecret) {
      cachedWebhookSecret = doc.stripeWebhookSecret.trim();
      return cachedWebhookSecret;
    }
  } catch (err) {
    console.warn('Could not read stripeWebhookSecret from MongoDB settings:', err.message);
  }

  return '';
}

export async function getStripe() {
  const secretKey = await getStripeSecretKey();
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured in environment variables or database');
  }
  return new Stripe(secretKey);
}
