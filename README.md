# DesignDash

**Make Design Decisions. Together.**

DesignDash is an interactive classroom activity where student teams work through real-world product design challenges using the Design Thinking framework (Empathize, Define, Ideate, Prototype, Test). A teacher presents and paces the activity while student teams make decisions, submit their designs, view each other's work, and vote on awards.

**Live app:** [design-dash-two.vercel.app](https://design-dash-two.vercel.app)

---

## How the Activity Works

### Overview

The teacher creates a game and gets a **4-digit code**. Students go to the website, work through design decisions as a team, then submit using that code. After everyone submits, the class views all designs in a gallery and votes on awards.

### Step-by-Step for Teachers

#### 1. Create a Game
- Go to the website and click **"Create Game"**
- You'll be taken to the **Presenter Dashboard** with a 4-digit game code
- Share this code with your students (project it on screen)

#### 2. Have Students Open the Activity
- Students go to the website and click **"Start Playing"**
- They'll see the case study briefing (a product design scenario with a user persona)
- Students work through 5 design decisions, one at a time

#### 3. Pace the Activity (Presenter Dashboard)
From your presenter screen you can:
- See which **phase** the game is in (Presenting → Submission → Gallery → Voting → Awards)
- Click **"Advance"** to move to the next round or phase
- Click **"Go Back"** if you need to return to a previous step
- See how many teams have submitted or voted in real time

#### 4. Student Decision-Making
Each decision corresponds to a Design Thinking phase:

| Round | Phase | What Students Decide |
|-------|-------|---------------------|
| 1 | Empathize | Understand the user's needs |
| 2 | Define | Define the core problem |
| 3 | Ideate | Brainstorm solutions |
| 4 | Prototype | Design their solution |
| 5 | Test | Plan how to test it |

Students pick a main approach (branching path), then make a follow-up choice within that path.

**Optional timers:** Students can start a 3, 4, or 5-minute countdown timer from their screen to pace group discussion. Timers are not enforced — they're just a classroom tool.

#### 5. Submission
- Once all rounds are done, advance to the **Submission** phase
- Students enter the 4-digit game code and submit their decisions
- Each team is automatically assigned a team name (e.g., "Studio Red", "Studio Blue")
- Your presenter dashboard shows submissions as they come in

#### 6. Gallery
- Advance to the **Gallery** phase
- Everyone can browse all submitted designs side-by-side
- Each submission shows the team's choices with a phone mockup preview

#### 7. Voting & Awards
- Advance to the **Voting** phase
- Teams vote in 3 categories (they cannot vote for themselves):
  - **Most Creative** — Most original design approach
  - **Best for Users** — Most user-friendly design
  - **Would Use It** — Product you'd actually want to use
- Advance to **Awards** to reveal the winners

### Group Mode

For classroom use, have students add `?group=true` to the play URL. This mode:
- Asks for the game code upfront
- Adds "Discuss then reveal" prompts to encourage team discussion before seeing each decision

---

## Current Case Study

### Roblox: Gaming Platform Discovery
- **Persona:** Maya Torres, an 11-year-old who plays and creates Roblox games
- **Problem:** It's hard to find good games, and new creator games are invisible
- **Duration:** ~25 minutes (3 min briefing + 5 rounds of ~4 min each + submission)
- **Difficulty:** Beginner

The case study is extensible — new scenarios can be added in the code.

---

## Running It Locally

### Prerequisites
- **Node.js** version 18 or higher
- **npm** (comes with Node.js)

### Install & Run

```bash
# Clone the repository
git clone <repo-url>
cd design-dash

# Install all dependencies
npm install

# Start both frontend and backend
npm run dev
```

This starts:
- **Frontend:** http://localhost:3000 (the website students and teachers use)
- **Backend:** http://localhost:3001 (the API server)

### Other Commands

```bash
npm run dev:web      # Run only the frontend
npm run dev:server   # Run only the backend
npm run build        # Build everything for production
```

### Environment Variables

For local development, the defaults work out of the box — no `.env` file needed. The frontend automatically talks to `http://localhost:3001`.

For production, the following are set:

| Variable | Where | Value |
|----------|-------|-------|
| `NEXT_PUBLIC_API_URL` | Vercel (frontend) | `https://dash-api.collinsoik.dev` |
| `CORS_ORIGIN` | Docker (backend) | `https://design-dash-two.vercel.app` |
| `PORT` | Docker (backend) | `3002` |

---

## Project Structure

```
design-dash/
├── apps/
│   ├── web/                  # Next.js frontend (student + teacher UI)
│   │   ├── app/
│   │   │   ├── page.tsx              # Landing page (Play / Create Game)
│   │   │   ├── play/page.tsx         # Student gameplay
│   │   │   ├── present/[code]/       # Teacher presenter dashboard
│   │   │   └── gallery/[code]/       # Gallery, voting, and awards
│   │   ├── components/
│   │   │   ├── game/                 # Decision UI components
│   │   │   └── preview/              # Phone mockup previews
│   │   └── lib/api.ts               # API client
│   │
│   └── server/               # Express REST API backend
│       ├── src/
│       │   ├── index.ts              # Server setup
│       │   ├── routes.ts             # API endpoints
│       │   └── db.ts                 # SQLite database
│       ├── Dockerfile
│       └── docker-compose.yml
│
├── packages/
│   └── shared/               # Shared types and case study data
│       └── src/
│           ├── types.ts              # TypeScript interfaces
│           └── case-studies.ts       # Roblox case study definition
│
└── package.json              # Monorepo root (npm workspaces)
```

## Tech Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS, TypeScript
- **Backend:** Express, SQLite (via sql.js), TypeScript
- **Monorepo:** npm workspaces
- **Hosting:** Vercel (frontend), Docker on VM with Cloudflare Tunnel (backend)

---

## Game Phases Reference

```
Presenting ──► Submission ──► Gallery ──► Voting ──► Awards
   (5 rounds)     (teams submit)   (browse designs)  (vote)   (winners!)
```

The teacher controls progression through all phases using the Advance/Go Back buttons on the presenter dashboard. Students see updated content automatically (the app polls the server every few seconds).

---

## Troubleshooting

**"Failed to create game"**
- Make sure the backend server is running (`npm run dev:server`)

**Students can't submit**
- Verify the game is in the **Submission** phase (advance past all 5 rounds)
- Check that students are entering the correct 4-digit code

**Page won't load**
- Run `npm install` to make sure all dependencies are installed
- Make sure you're using Node.js 18+: `node --version`

**Voting doesn't appear**
- The game must be in the **Voting** phase — advance from Gallery using the presenter dashboard
