# Pivot Branch: `pivot-decision-game`

## What This Is

The `pivot-decision-game` branch contains a complete rewrite that transforms DesignDash from a **drag-and-drop website builder** into a **scenario-based product design decision game**. Instead of placing Tailwind components onto website sections, teams now face real product design scenarios and make decisions (multiple choice, tradeoff sliders, branching paths).

The branch is pushed to remote: `origin/pivot-decision-game`

## Branch Status

- **Based on**: commit `db2dcc0` (before 10 upstream commits on master)
- **Master HEAD**: `e0079ce` (10 commits ahead — tutorials, component previews, game state sync fixes, error handling)
- **Needs rebase/merge onto current master before deploying**

## What Needs To Happen

### 1. Rebase onto master

The pivot branch was built on an older commit. Master has since gained:
- Tutorial components (`HowToPlay.tsx`, `CaseStudyBriefing.tsx`) — these reference old website-builder concepts and need rewriting for the decision game
- Game state sync improvements in `game-store.ts` (better `setRoom`/`updateTurn`/`updateTimeRemaining` that sync `room.gameState`)
- Additional `CaseStudy` fields on master's `types.ts`: `difficulty`, `learningObjectives`, `designTips`, `whatsBroken`, `successHints`, `funFact`
- Connection error handling in host page
- Component preview images (no longer needed — the components-registry was deleted)

```bash
git checkout pivot-decision-game
git rebase master
# Resolve conflicts (see section below)
```

### 2. Resolve Expected Merge Conflicts

These files were changed on both branches and will conflict:

| File | What to do |
|------|------------|
| `packages/shared/src/types.ts` | Keep pivot's decision types. Add master's new `CaseStudy` fields (`difficulty`, `learningObjectives`, `designTips`, `whatsBroken`, `successHints`, `funFact`) to the pivot's `CaseStudy` interface |
| `packages/shared/src/case-studies.ts` | Keep pivot's 3 product case studies (Melodify, GreenPlate, ParkWise). Add values for the new fields (`difficulty`, `learningObjectives`, etc.) to each case study |
| `apps/web/lib/game-store.ts` | Keep pivot's `recordDecision` action. Adopt master's improved state sync pattern (syncing `room.gameState` in `setRoom`, `setGameState`, `updateTurn`, `updateTimeRemaining`) |
| `apps/web/app/game/[roomCode]/page.tsx` | Keep pivot's layout (ScenarioHeader + ScenarioView + TeamSidebar). No DnD. |
| `apps/web/app/host/page.tsx` | Keep pivot's product-focused case study selection. Adopt master's timeout/error handling patterns |
| `apps/web/app/lobby/[roomCode]/page.tsx` | Minor — keep pivot's changes |
| `apps/web/components/game/TurnIndicator.tsx` | Keep pivot's "ROUND X/Y" and "SUBMIT ROUND" text |
| `apps/web/components/game/TeamSidebar.tsx` | Keep pivot's version (removed slot assignments, kept members/criteria/scores). Add back the "MISSION" section from master if desired |
| `apps/web/components/game/BrainstormPanel.tsx` | Keep pivot's hint text. Adopt master's collapse button fix if present |

### 3. Update Tutorial Components for Decision Game

Master added these tutorial components that reference old website-builder concepts:

- **`apps/web/components/tutorial/HowToPlay.tsx`** — Currently describes dragging components onto websites. Rewrite to explain: choosing design decisions, using the tradeoff slider, understanding branching paths, team chat strategy
- **`apps/web/components/tutorial/CaseStudyBriefing.tsx`** — Currently references `businessName`, `brokenSections`, `designTips`. Update to use `productName`, `persona`, `decisions`, and the new CaseStudy fields

### 4. Add New CaseStudy Fields to Pivot Data

The pivot's `CaseStudy` interface needs these fields added (from master):

```typescript
interface CaseStudy {
  // ... existing pivot fields ...
  difficulty: "beginner" | "intermediate" | "advanced";
  learningObjectives: string[];
  designTips: string[];
  whatsBroken: string[];      // repurpose: common pitfalls for each scenario
  successHints: string[];
  funFact: string;
}
```

Then populate these for each of the 3 case studies (Melodify, GreenPlate, ParkWise).

### 5. Deploy

After merge is clean and builds pass:

```bash
# Build shared package first
npx tsc --project packages/shared/tsconfig.json

# Verify web builds
cd apps/web && npx next build

# Push to master for Vercel auto-deploy
git checkout master
git merge pivot-decision-game
git push origin master

# Deploy server via tunnel
bash deploy-server.sh
```

## What Changed (Summary)

**32 files changed**, 1,624 insertions, 3,134 deletions.

### Deleted
- `packages/shared/src/components-registry.ts` — 1,366 lines of Tailwind component definitions
- `apps/web/components/game/Canvas.tsx` — website preview with drop zones
- `apps/web/components/game/ComponentPalette.tsx` — draggable component browser
- `apps/web/components/game/SectionSlot.tsx` — individual drop targets
- `apps/web/components/voting/VoteCard.tsx` — replaced with inline voting
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` removed from package.json

### Created
- `apps/web/components/game/ScenarioView.tsx` — main decision area (replaces Canvas)
- `apps/web/components/game/MultipleChoiceDecision.tsx` — click-to-select card grid
- `apps/web/components/game/TradeoffSlider.tsx` — styled range slider with gradient
- `apps/web/components/game/BranchingPath.tsx` — branch selection + follow-up decisions
- `apps/web/components/game/ScenarioHeader.tsx` — product info, persona card, progress tracker
- `apps/web/components/game/DecisionSummary.tsx` — progress bar for decisions made

### Rewritten
- `packages/shared/src/types.ts` — decision types replace website/component types
- `packages/shared/src/events.ts` — `decision:submit`/`decision:recorded` replace `turn:place`/`canvas:updated`
- `packages/shared/src/case-studies.ts` — 3 product case studies (Melodify, GreenPlate, ParkWise) with personas and decision trees
- `apps/server/src/turns.ts` — decision submission + round-based advancement
- `apps/server/src/game-state.ts` — decision state helpers
- `apps/server/src/voting.ts` — best decision awards replace best section awards
- `apps/server/src/db.ts` — added `decisions` table
- `apps/web/lib/game-store.ts` — `recordDecision` replaces `updateCanvas`
- `apps/web/app/game/[roomCode]/page.tsx` — 3-column layout, no DnD
- `apps/web/app/host/page.tsx` — product-focused case study selection
- `apps/web/app/vote/[roomCode]/page.tsx` — inline star voting
- `apps/web/app/results/[roomCode]/page.tsx` — decision awards
- `apps/web/app/page.tsx` — updated landing copy

### Updated (minor text changes)
- `apps/web/components/game/TurnIndicator.tsx` — "ROUND" instead of "TURN"
- `apps/web/components/game/TeamSidebar.tsx` — removed slot assignments
- `apps/web/components/game/BrainstormPanel.tsx` — updated hint text

## New Game Layout

```
┌──────────────────────────────────────────────────────┐
│  TurnIndicator (ROUND N/M, timer, active player)     │
├───────────────┬──────────────────────┬───────────────┤
│ ScenarioHeader│  ScenarioView        │  TeamSidebar  │
│ - Product info│  - Story context     │  - Members    │
│ - Persona card│  - Decision inputs   │  - Criteria   │
│ - Progress    │    (MC / Slider /    │  - Scores     │
│ - Criteria    │     Branching)       │               │
├───────────────┴──────────────────────┴───────────────┤
│  BrainstormPanel (team chat)                         │
└──────────────────────────────────────────────────────┘
```

## Socket Events (New)

| Event | Direction | Payload |
|-------|-----------|---------|
| `decision:submit` | client→server | `{ decisionPointId, choiceId?, sliderValue?, branchId?, followUpChoiceId? }` |
| `decision:recorded` | server→client | `{ teamId, decisionPointId, decision: { type, choiceId?, sliderValue?, branchId?, followUpChoiceId? } }` |

Removed: `turn:place`, `turn:remove`, `canvas:updated`
Kept: `turn:submit`, `turn:tick`, `turn:changed`, all brainstorm/voting events
