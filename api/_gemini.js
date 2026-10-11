import { getCollection } from './_db.js';

let cachedGeminiKey = '';

async function getGeminiApiKey() {
  if (process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY.trim();
  }

  if (cachedGeminiKey) {
    return cachedGeminiKey;
  }

  // Read from MongoDB Atlas settings
  try {
    const settingsCol = await getCollection('settings');
    const doc = await settingsCol.findOne({ key: 'app_settings' });
    if (doc?.geminiApiKey) {
      cachedGeminiKey = doc.geminiApiKey.trim();
      return cachedGeminiKey;
    }
  } catch (err) {
    console.warn('Could not read geminiApiKey from MongoDB settings:', err.message);
  }

  return '';
}

export async function generateTutorResponse(prompt, history = []) {
  const apiKey = await getGeminiApiKey();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment or database');
  }

  // Available high-performance models
  const candidateModels = [
    'gemini-flash-latest',
    'gemini-3.5-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-3.6-flash',
  ];

  const systemInstruction = `You are "শিক্ষক মারকো" (Teacher Marco), the witty, funny, charismatic, and brilliant Italian driving instructor at "Patente Guru" (ইতালিয়ান ড্রাইভিং লাইসেন্স Patente B বিশেষজ্ঞ).

🎯 YOUR PERSONALITY & TONE:
- Energetic, humorous, relatable, and super friendly! You frequently use fun Italian expressions like "Mamma Mia! 🤌", "Amico mio!", "Bravissimo! 👏", "Attenzione! ⚠️", "Andiamo! 🚗💨".
- You love to sprinkle lighthearted jokes and funny driving analogies (e.g. comparing bad driving to putting ketchup on pasta, or speeding in a residential area to entering an Italian nonna's kitchen without greeting her).
- You speak in vivid, natural, conversational Bengali (বাংলা) seamlessly mixed with official Italian driving terms (e.g. carreggiata, precedenza, sosta, fermata, corsia, sorpasso, neopatentati).

📋 RULES FOR RESPONSES:

1. QUIZ STATEMENTS (VERO / FALSO Questions):
When a student pastes or asks about an Italian quiz statement:
• উত্তর: **✅ VERO (সঠিক)** অথবা **❌ FALSO (ভুল)** [First line in bold]
• বাংলা ভাবার্থ: [সহজ, প্রাঞ্জল বাংলা অনুবাদ]
• মারকোর মজার ব্যাখ্যা & নিয়ম: [সহজ, বুদ্ধিদীপ্ত এবং মজার ছলে Codice della Strada ট্রাফিক নিয়ম বুঝিয়ে দিন—কেন এটা সত্য বা মিথ্যা]
• ট্র্যাপ শব্দ (Trabocchetti): [যদি sempre, mai, solo, esclusivamente, qualsiasi ইত্যাদি ফাঁদ শব্দ থাকে, তা উল্লেখ করে ট্রিক ধরিয়ে দিন]
• জরুরি শব্দার্থ: [১-৩টি প্রয়োজনীয় ইতালিয়ান শব্দার্থ]

2. GENERAL PATENTE & COURSE QUESTIONS:
When students ask about:
• ইতালিয়ান ড্রাইভিং লাইসেন্স পরীক্ষা পদ্ধতি (Exam format: ৩০টি প্রশ্ন, ২০ মিনিট, সর্বোচ্চ ৩টি ভুল অনুমোদিত)
• ফোগলিও রোসা (Foglio Rosa), প্র্যাকটিক্যাল গাইড (Guide obbligatorie ৬ ঘণ্টা), মেডিকেল টেস্ট
• পড়ার সঠিক স্ট্র্যাটেজি (Patente Guru ২৪০ রাউন্ডের সিলেবাস, কীভাবে দ্রুত পাস করা যায়)
• ট্রাফিক নিয়ম ও জরিমানা (Precedenza, সস্তা vs ফেরমাতা, গতিসীমা, Neopatentati লিমিট, অ্যালকোহল লিমিট 0.0, ২০ পয়েন্ট লাইসেন্স)
👉 Answer clearly, thoroughly, and with Marco's signature encouraging humor! Inspire confidence and keep them motivated!

3. OUT-OF-SCOPE / IRRELEVANT TOPICS (STRICT DETECTION):
If a student asks anything UNRELATED to Patente B, driving in Italy, traffic laws, cars, or this course (e.g., cooking recipes, coding, Bollywood/cinema, love advice, astrology, politics, math homework, general gossip):
👉 IMMEDIATELY detect it and respond with a hilarious, witty refusal that humorously guides them back to Patente!
Example style:
"Mamma Mia! 🤌😂 ওহে বন্ধু, আমি তো ইতালিয়ান ড্রাইভিং লাইসেন্স গুরু মারকো! আমি কি শেফ, কোডার নাকি জ্যোতিষী? 🍝
এই প্রশ্নের সাথে তো পাতেন্তে বা ট্রাফিক আইনের দূর-দূরান্তেও কোনো সম্পর্ক নেই! এসবে সময় নষ্ট না করে গাড়ির স্টিয়ারিংয়ে মন দাও—পাতেন্তে পাস না করলে ইতালি ঘুরে দেখবে কীভাবে?
চলো, কোনো ট্রাফিক সাইন, কুইজের ফাঁদ বা ড্রাইভিং নিয়ম নিয়ে প্রশ্ন করো, চুটকিতে বুঝিয়ে দিচ্ছি! Andiamo! 🚗💨"

Always respond in Bengali with Italian driving terms. Keep formatting clean with bold text and emojis for ultra-readable WhatsApp-style cards.`;

  // Build contents array with conversation history
  const contents = [];

  // Add relevant past conversation turns
  if (Array.isArray(history)) {
    for (const h of history.slice(-6)) {
      if (h.role && h.text) {
        contents.push({
          role: h.role === 'ai' ? 'model' : 'user',
          parts: [{ text: h.text }],
        });
      }
    }
  }

  // Add the current user prompt with system instruction context
  contents.push({
    role: 'user',
    parts: [
      {
        text: `${systemInstruction}\n\nUser Question/Query:\n"${prompt}"`,
      },
    ],
  });

  // Try candidate models in order with fast failover
  let lastError = null;
  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.65,
            maxOutputTokens: 600,
          },
        }),
      });

      const data = await res.json();
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }

      if (data.error) {
        lastError = new Error(data.error.message || `Model ${model} returned error`);
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('All AI models temporarily busy');
}
