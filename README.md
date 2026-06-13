# 🧠 MindWell — Mental Wellness Tracker

A Generative AI-powered mental wellness companion for students preparing for high-stakes exams (JEE, NEET, CUET, CAT, GATE, UPSC).

## Features

- **Daily Check-in** — Log mood, stress, sleep, exercise, and journal
- **GenAI Analysis** — Detects hidden stress triggers, emotional patterns, and exam context from journal entries
- **Personalized Insights** — Tracks mood trends, recurring triggers, and provides adaptive coping strategies
- **AI Chat Companion** — Empathetic conversational AI offering real-time support, grounding exercises, and motivation
- **Streak Tracking** — Encourages daily consistency

## Tech Stack

- React 19 + Vite
- Client-side AI (mock/demo engine — pluggable with real APIs)
- localStorage persistence
- Deployable as static SPA (Vercel, Netlify, Cloudflare Pages)

## Quick Start

```bash
npm install
npm run dev      # local dev at localhost:5173
npm run build    # production build
```

## Deploy

### Vercel (free)
```bash
npm i -g vercel
vercel --prod
```
Or connect GitHub → [vercel.com/new](https://vercel.com/new)

### Netlify (free)
Connect repo at [netlify.com](https://netlify.com) — auto-detects Vite.

## Architecture

```
src/
├── context/WellnessContext.jsx   # Global state + persistence
├── utils/
│   ├── ai.js                     # Mock GenAI engine (sentiment, triggers, chat)
│   └── storage.js                # localStorage helpers
├── components/
│   ├── Dashboard.jsx             # Home with stats, streak, mood chart
│   ├── CheckIn.jsx               # Multi-step daily journal
│   ├── JournalHistory.jsx        # Past entries with AI analysis
│   ├── Insights.jsx              # Trends, triggers, patterns
│   └── AIChat.jsx                # Conversational AI companion
├── App.jsx / App.css
├── main.jsx
└── index.css
```

The AI engine in `utils/ai.js` uses keyword analysis, sentiment detection, and stress trigger classification to simulate GenAI responses. It can be swapped with any real API (OpenAI, Gemini, Claude) by replacing the `analyzeEntry` and `generateChatResponse` functions.
