# RepoMind AI

> **Your repository. Your context. Your AI engineer.**

RepoMind AI is an AI-powered software engineer that connects to your GitHub repositories, analyzes the codebase for bugs and security issues, and lets you chat with an AI that has real repository context.

---

## Project Structure

```
├── client/                 # React + TypeScript + Vite frontend
│   └── src/
│       ├── components/     # UI components by domain
│       │   ├── layout/     # App shell, sidebar, topbar
│       │   ├── dashboard/  # Dashboard widgets
│       │   ├── repository/ # Repository cards & details
│       │   ├── ai/         # Chat panel & AI interactions
│       │   ├── analysis/   # Analysis results & charts
│       │   └── ui/         # Shared/reusable primitives
│       ├── pages/          # Route-level page components
│       ├── services/       # API client (calls OUR backend only)
│       ├── data/           # Demo/seed data
│       └── types/          # Shared TypeScript interfaces
│
├── server/                 # Node.js + Express + TypeScript backend
│   └── src/
│       ├── routes/         # Express route handlers
│       │   ├── ai.ts       # /api/ai/* — AI chat endpoints
│       │   ├── github.ts   # /api/github/* — OAuth & repo access
│       │   └── repositories.ts  # /api/repositories/* — CRUD + analysis
│       └── services/       # Business logic (no routes here)
│           ├── gemini.ts           # Gemini API integration
│           ├── github.ts           # GitHub API integration
│           ├── repositoryAnalyzer.ts  # Analysis orchestrator
│           └── contextBuilder.ts   # Builds prompt context from code
│
├── .env.example            # Environment variable template
└── README.md               # You are here
```

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A **GitHub OAuth App** (for repository access)
- A **Google Gemini API key** (for AI features)

## Getting Started

### 1. Clone & configure environment

```bash
git clone <your-repo-url>
cd repomind-ai
cp .env.example .env
# Fill in GEMINI_API_KEY, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
```

### 2. Install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Start the dev servers

Open **two terminals**:

**Terminal 1 — Backend** (runs on `http://localhost:3001`):

```bash
cd server
npm run dev
```

**Terminal 2 — Frontend** (runs on `http://localhost:5173`):

```bash
cd client
npm run dev
```

The Vite dev server proxies `/api` requests to the Express backend automatically, so everything works from `http://localhost:5173`.

## Architecture

- **Frontend ↔ Backend**: The client only talks to our Express backend (`/api/*`). It never calls GitHub or Gemini directly — all secrets stay on the server.
- **Backend ↔ External APIs**: The server handles GitHub OAuth, fetches repository data, and calls the Gemini API with assembled code context.
- **Hot reload**: Both sides hot-reload on save — Vite for the frontend, ts-node-dev for the backend.

## Scripts

| Location | Command          | Description                           |
| -------- | ---------------- | ------------------------------------- |
| `client` | `npm run dev`    | Start Vite dev server (port 5173)     |
| `client` | `npm run build`  | Type-check + production build         |
| `server` | `npm run dev`    | Start Express with ts-node-dev (3001) |
| `server` | `npm run build`  | Compile TypeScript to `dist/`         |
| `server` | `npm start`      | Run compiled JS from `dist/`          |

## License

MIT
