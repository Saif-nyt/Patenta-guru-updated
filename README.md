# 🇮🇹🇧🇩 Patente B Italia (বাংলা)

> **ইতালিয়ান ড্রাইভিং লাইসেন্স (Patente B) কুইজ বাংলা ব্যাখ্যা সহ (100% Free Trial)**  
> An interactive bilingual Italian-Bangla exam simulator and study portal for the Italian Driving License (Patente B).

---

## 🌟 Key Features

1. **🚦 Authentic SVG Italian Road Signs (`RoadSign.tsx`)**:
   - High-definition vector representations for STOP signs, Give Way triangles, danger signs, parking/stopping bans, speed limits, and overtaking prohibitions.
2. **🎯 30-Question Official Exam Simulator**:
   - Official ministerial format: 30 Questions, 20-minute countdown timer, max 3 mistakes passing rule.
   - Interactive 30-question matrix navigation with instant pass/fail verdict and confetti celebration.
3. **🎮 240-Round Game Map Progression**:
   - Systematic level-by-level study roadmap across all 25 chapters of the Italian Highway Code (*Codice della Strada*).
   - Rounds 1 to 7 are **100% Free** (up to 200 questions).
4. **🔒 €49 Lifetime VIP Membership Paywall**:
   - Unlocks all 240 rounds and 7,100+ questions.
   - Designed for Italian payment methods: PostePay Evolution, Credit Card, PayPal, Satispay.
5. **📖 Tricky Word Vocabulary & Audio Speech (TTS)**:
   - Searchable glossary of bureaucratic terms (*Carreggiata, Spartitraffico, Sorpasso, Sosta, Fermata, Dosso*) with native Italian text-to-speech audio pronunciation.
6. **❌ Persistent Mistake Bank**:
   - Saves failed questions in browser `localStorage` for targeted revision until zero errors.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (Glassmorphism & Responsive layout)
- **Icons**: Lucide React
- **Animations**: Canvas Confetti
- **Audio**: Web Speech API (Native Italian TTS)

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

### Environment configuration

Copy `.env.example` to `.env` and set the required MongoDB, JWT, Firebase, and email values. Vite loads `.env` for both the frontend and local API handlers; production deployments must set server-side values in the hosting provider's environment configuration.

Google sign-in is already available in the student sign-in dialog. To activate it, enable **Authentication > Sign-in method > Google** in Firebase Console and add each local/production hostname to **Authentication > Settings > Authorized domains**. Put Firebase web configuration in the `VITE_FIREBASE_*` variables. Google OAuth client secrets are not used by this Firebase flow and must never be exposed as `VITE_*` variables.

`GEMINI_API_KEY`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET` are needed only for the AI tutor and Stripe payment/webhook features. Email OTP uses SMTP when both `SMTP_USER` and `SMTP_PASS` are set, or Resend when configured.

---

## ⚖️ Legal Disclaimer

*Patente B Italia (বাংলা)* is an independent educational platform created to assist Bengali speakers in studying the Italian Highway Code (*Codice della Strada*). This platform is **NOT affiliated with, authorized, or sponsored by the Ministero delle Infrastrutture e dei Trasporti (MIT)** or the *Motorizzazione Civile*. All quiz questions are based on public domain ministerial decrees under Article 5 of Italian Law n. 633/1941.
