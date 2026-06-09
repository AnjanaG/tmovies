# tmovies

Movie catalog app extended with AI agents modeling content ops capabilities — launch workflow analyzer, [future: metadata enrichment, localization QA].

Built with React, TypeScript, and Tailwind CSS. Uses the TMDB API for catalog data and the Anthropic API for AI features.

[Live demo](https://tmovies-blush.vercel.app)

---

## Features

**Catalog** — Search and browse movies and TV series. View trailers, cast details, and metadata.

**Launch Process Analyzer** — Paste any multi-step content launch workflow. The analyzer classifies each step into an automation tier, explains its reasoning, flags misclassification risk, and outputs a sequenced transformation roadmap.

---

## The PM thinking behind this

Content operations at a streaming company involves hundreds of workflow steps per title, per market. The question is never "can we automate this?" — it's "which steps should we automate, in what order, and where does automation create unacceptable risk?"

The Launch Process Analyzer models that decision framework explicitly. Each step is classified into one of four tiers:

**Full Automation** — Repetitive, rule-based, low-stakes, high-volume. No human needs to see this. Examples: metadata ingestion, CDN propagation confirmation, availability window configuration.

**Human-in-Loop** — The agent does the work, but a human approves before any action is taken. The efficiency gain comes from reducing the cognitive load on the human, not removing them. Examples: push notification copy review, thumbnail selection assistance.

**Human Decides, Agent Executes** — Judgment stays human (editorial, risk, strategy), but once a decision is made, the execution can be automated. This is often the highest-leverage tier because it preserves human accountability while eliminating manual execution overhead. Examples: go/no-go for a launch date, territory availability decisions.

**Fully Human** — Creative judgment, editorial discretion, stakeholder politics, exception handling. Automating these steps degrades quality or creates compliance risk. Examples: thumbnail selection for a flagship title in a new market, executive summary to senior leadership.

The roadmap output sequences automation by impact x feasibility, with explicit dependencies. This mirrors how a senior PM would actually prioritize a workflow transformation initiative — not by what's technically easiest, but by what unlocks the most downstream value.

---

## Architecture

The analyzer routes through a Vercel serverless function (`/api/analyze-launch.ts`) that proxies to the Anthropic API. The API key stays server-side. The React frontend calls `/api/analyze-launch` and renders structured JSON results.

```
User input (workflow steps)
       ↓
React page (/launch-analyzer)
       ↓
POST /api/analyze-launch (Vercel serverless)
       ↓
Anthropic API (claude-sonnet-4-20250514)
       ↓
Structured JSON: step classifications + roadmap
       ↓
Step cards + distribution bar + phase roadmap
```

---

## Local setup

```bash
git clone https://github.com/AnjanaG/tmovies.git
cd tmovies
npm install
```

Create a `.env` file at root:

```bash
VITE_API_KEY=<your-tmdb-api-key>
VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3
ANTHROPIC_API_KEY=<your-anthropic-api-key>
```

Run locally with Vercel CLI (needed for the serverless function):

```bash
npm install -g vercel
vercel dev
```

Or run without the AI feature:

```bash
npm run dev
```

Get a TMDB API key at [themoviedb.org](https://www.themoviedb.org/settings/api).
Get an Anthropic API key at [console.anthropic.com](https://console.anthropic.com).

---

## What's next

- Metadata enrichment agent — given a title ID, auto-populate genres, content warnings, and audience ratings from multiple sources with a human review step before write-back
- Localization QA agent — check subtitle timing, tone consistency, and character limits across languages, flagging issues for human review rather than auto-correcting
