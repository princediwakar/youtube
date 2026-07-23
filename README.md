# ZenTuber — Guided Mastery Engine

An interactive YouTube-powered learning platform that turns any educational video into an adaptive quiz-based mastery session.

## How it works

1. **Search a topic** — Enter any subject (e.g., "Advanced SQL Window Functions")
2. **AI generates a syllabus** — DeepSeek analyzes the video transcript and creates conceptual checkpoints at specific timestamps
3. **Watch & get quizzed** — The video auto-pauses at each checkpoint; answer correctly to increase your mastery score
4. **Remediation on failure** — Wrong answers trigger a hint and a rewind to the relevant context
5. **Flow Mode** — Toggle off interruptions to watch uninterrupted

## Tech stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Zustand** (state persistence)
- **DeepSeek** (AI syllabus generation via OpenAI SDK)
- **yt-search** (YouTube video search)
- **youtube-transcript** (transcript fetching)
- **react-youtube** (YouTube iframe player)

## Getting started

```bash
npm install
cp .env.local.example .env.local   # Add your DEEPSEEK_API_KEY
npm run dev
```

## Environment

| Variable | Description |
|---|---|
| `DEEPSEEK_API_KEY` | API key for DeepSeek (used for syllabus generation) |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Themes

Star Chart, Neon Cyber, Deep Ocean, and Ember Minimal — selected during onboarding.
