<p align="center">
  <h1 align="center">selfapp</h1>
  <p align="center"><strong>Your app. Your rules. No code required.</strong></p>
  <p align="center">
    <a href="./README-vi.md">Tiếng Việt</a> ·
    <a href="#quick-start">Quick Start</a> ·
    <a href="#how-it-works">How It Works</a>
  </p>
</p>

---

## The Problem Nobody Talks About

AI can write code now. That's not news.

What's news is that **millions of people** are using AI to "vibe code" their own apps — expense trackers, habit journals, team dashboards, personal CRMs. And most of those apps **die within a week**.

Not because the code was bad. Because nobody told them what happens *after* the code is written.

> *"I asked ChatGPT to build me an expense tracker. It worked great on my laptop. Then I closed the tab and everything was gone."*

This is the story of every non-technical person who tried to build something with AI. They hit the same three walls:

1. **They can't describe what they want clearly enough** — and AI builds the wrong thing
2. **They have no mental model of how software works** — so when things break, they're lost
3. **They don't know how to operate an app** — deploy it, keep it running, back up data, add features later

"Vibe coding" tools solve problem zero: *generating code*. They ignore problems one through three — the ones that actually determine whether your app survives.

---

## Why We Built selfapp

We believe in a simple idea:

> **Everyone deserves software that fits their life perfectly — not just people who can code.**

Not a template from an app store. Not a no-code form builder with 47 limitations. A *real* app, built exactly for you, that runs on the internet, stores your data safely, and grows with you over time.

The missing piece was never AI's ability to code. It was **everything around the code** — the infrastructure, the deployment, the operations, the communication between AI and human.

selfapp fills that gap.

---

## How It Works

selfapp gives AI everything it needs to be your **personal software engineer** — not a tool you prompt, but a partner that builds, deploys, and maintains your app.

### AI as Your Engineer, Not Your Tool

Traditional "vibe coding" works like this:

```
You → describe app → AI generates code → you figure out the rest → 💀
```

selfapp works like this:

```
You → describe what you need
  → AI asks smart questions to understand your intent
  → AI builds a working app
  → AI deploys it to the internet
  → AI stays to maintain, fix, and improve it
  → your app lives as long as you need it ✓
```

The difference? **AI doesn't leave after building.** It stays as your app's caretaker.

### Three Solutions to Three Problems

**Problem 1: "I don't know how to describe what I want"**

You don't have to. AI runs a guided interview — asking you specific, multiple-choice questions instead of expecting a detailed spec. After 3-4 questions, it builds a rough draft. You react to something real instead of imagining something abstract.

> *Think of it like sculpting clay — you start with a shape and refine it, not a blueprint.*

**Problem 2: "I don't understand how software works"**

You don't need to — until you do. selfapp uses **just-in-time education**: AI explains things only when you hit a real problem, using everyday language.

| When you say... | AI explains like this |
|---|---|
| "Why did my data disappear?" | "Your app was saving to a whiteboard — wipe it and it's gone. I'll switch it to a notebook — permanent. Want me to fix it now?" |
| "Why can't my friend see my app?" | "It's running on your computer only — like cooking in your kitchen. I'll put it online so anyone with the link can use it." |

No jargon. No lectures. Just answers when you need them.

**Problem 3: "I built it... now what?"**

selfapp's infrastructure handles operations automatically:

| What | How |
|---|---|
| **Deployment** | AI deploys your app globally with one action. You get a link instantly. |
| **Data safety** | Your data lives in a managed database. No "oops I closed the tab" disasters. |
| **Updates** | Tell AI what you want changed. It updates without breaking what already works. |
| **Monitoring** | A simple health page in plain language: "App is running. 1,234 records saved. Last updated yesterday." |

---

## What's Inside

selfapp is an open-source **full-stack app template** designed for AI to read, understand, and build upon.

```
selfapp/
├── template/           ← The full-stack app template
│   ├── fe/             ← Frontend (Vue 3 + Tailwind CSS)
│   ├── be/             ← Backend (Hono on Cloudflare Workers)
│   ├── db/             ← Database (D1 / SQLite)
│   ├── shared/         ← Shared data models
│   └── .claude/        ← AI skills, agents & workflows
│       ├── skills/     ← How AI should build, debug, deploy
│       ├── agents/     ← Specialized AI agents (architect, reviewer, etc.)
│       └── commands/   ← Slash commands for common workflows
└── notes/              ← Research & design decisions
```

### Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Runtime** | Cloudflare Workers | Global edge deployment, near-zero cost, AI can deploy via MCP |
| **Frontend** | Vue 3 + Tailwind + shadcn-vue | Modern, fast, beautiful defaults |
| **Backend** | Hono | Lightweight, Workers-native, TypeScript |
| **Database** | D1 (managed SQLite) | Zero config, automatic backups, 10GB free |
| **Language** | TypeScript | End-to-end type safety |
| **AI** | Claude Code + Skills | AI reads the template and knows exactly how to build |

### Why Cloudflare Workers?

| Platform | Steps to deploy | Method | Cost |
|---|---|---|---|
| **Cloudflare Workers** | **2-3** | **MCP (native AI tool)** | **~$0 for personal apps** |
| Railway | 4-5 | REST API | Higher |
| Fly.io | 6-7 | CLI + API | Most complex |

AI can deploy a selfapp with a single tool call. No CLI commands, no config files, no DevOps knowledge. That's the whole point.

---

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) runtime
- [Claude Code](https://claude.ai/code) (with Cloudflare MCP)
- A Cloudflare account (free tier is enough)

### Create Your First selfapp

```bash
# 1. Clone the template
git clone https://github.com/aiocean/selfapp.git
cd selfapp/template

# 2. Install dependencies
bun install

# 3. Set up the database
bun run db:migrate

# 4. Start developing
bun run dev
```

Then open Claude Code and tell it what you want to build:

> *"I want an app to track my daily expenses. I want to quickly add how much I spent and on what, and see a summary at the end of each week."*

AI takes it from there.

### Deploy to the Internet

```bash
bun run deploy
```

Or just tell AI: *"Put my app online."*

---

## The Bigger Picture

selfapp is not just a template. It's a belief system:

1. **Software should be personal.** The best app for tracking *your* habits is one built for *your* habits — not a generic one with features you'll never use.

2. **AI should be an engineer, not a code generator.** Building is 30% of the work. Operating, maintaining, and evolving is the other 70%. AI should own the full lifecycle.

3. **Technical knowledge should not be a gate.** A teacher tracking student progress, a chef managing recipes, a freelancer organizing invoices — they all deserve custom software without learning to code.

4. **The best UX is a conversation.** No drag-and-drop builders. No config screens. Just tell AI what you need, in your own words, and it figures out the rest.

---

## Project Status

selfapp is in active development. The template works end-to-end (build → deploy → operate), and we're refining the AI workflows for smoother non-technical user experiences.

Contributions, feedback, and ideas are welcome.

---

## License

MIT

---

<p align="center">
  <sub>Built with the belief that everyone deserves software that fits their life.</sub>
</p>
