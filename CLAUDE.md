# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## What is styr-ai

Meta-system for persistent memory across all Gustav Kalls projekt. styr-ai ar "modern" — den overvakar, aggregerar learnings, och haller projektregistret uppdaterat. Alla underprojekt rapporterar hit.

### Underprojekt
| Projekt | Repo | Syfte |
|---------|------|-------|
| Savage Roar Music | gustavkall/savage-roar-music | Musiklabel, Warner-tvist, Vali Miron |
| TRADESYS | gustavkall/tradesys1337 | Trading dashboard |
| Min Analytiker | gustavkall/min-analytiker | Intradagsanalytiker, TradeSys |
| Adminassistent | gustavkall/adminassistent | Executive assistant, Savage Roar AB |

## Development Commands

```bash
# Local dev server
python3 -m http.server 8080

# Deploy: push to main → Vercel auto-deploys (~15s)

# Supabase setup (run once)
# 1. Create Supabase project
# 2. Run scripts/setup-supabase.sql in SQL Editor
# 3. Add SUPABASE_URL + SUPABASE_ANON_KEY to Vercel env vars
# 4. Run: source .env && node scripts/seed.js
```

## Session Boot Protocol (MANDATORY — do this automatically on session start)

### Step 1: Quick boot via API (primary)
Fetch the Vercel API endpoint for full system state in one call:
- `GET https://styr-ai.vercel.app/api/state`
This returns: last session summary, all active decisions, all learnings, and project metadata.

### Step 2: styr-ai egna filer
1. https://raw.githubusercontent.com/gustavkall/styr-ai/main/governance/system_rules.md
2. https://raw.githubusercontent.com/gustavkall/styr-ai/main/state/work_queue.md
3. https://raw.githubusercontent.com/gustavkall/styr-ai/main/project_memory/architecture.md
4. https://raw.githubusercontent.com/gustavkall/styr-ai/main/project_memory/decisions.md
5. https://raw.githubusercontent.com/gustavkall/styr-ai/main/project_memory/projects_registry.md
6. https://raw.githubusercontent.com/gustavkall/styr-ai/main/project_memory/cross_project_learnings.md

### Step 3: Las underprojektens state (for overblick)
For varje projekt i registret, las:
- `state/session_handoff.md` — senaste session
- `state/work_queue.md` — aktiva tasks
- `project_memory/learnings.md` — nya insikter

### Step 4: Aggregera och agera
1. Sammanfatta status over alla projekt
2. Identifiera cross-project patterns och learnings
3. Uppdatera `cross_project_learnings.md` om nya insikter hittats
4. Foreslana nasta steg baserat pa hela bilden

## Commit Conventions

```
feat:  new feature
fix:   bug fix
state: session handoff / state update
infra: deploy config, CI/CD
docs:  documentation
```

## Session Handoff Protocol (MANDATORY)

At the end of every session, **without being asked**, perform the following:

1. **Update `state/session_handoff.md`** — What was done, decisions & reasoning, next steps.
2. **Update `state/current_state.md`** — Date, version, system status.
3. **Update `state/work_queue.md`** — Mark completed, reprioritize.
4. **Update `project_memory/learnings.md`** — New insights or calibrations from this session.
5. **Update `project_memory/decisions.md`** — Decisions made with reasoning.
6. **Update `project_memory/cross_project_learnings.md`** — Nya cross-project insikter fran denna session.
7. **Update `project_memory/projects_registry.md`** — Om nya projekt skapats eller status andrats.
6. **Save session to Supabase** — Run node script to save session summary, changes, decisions, next_steps to Supabase `sessions` table. Also update any `decisions` rows.
7. **Commit and push state**:
   ```bash
   git add state/ project_memory/ && git commit -m "state: session handoff YYYY-MM-DD" && git push
   ```

This is not optional. Every session ends with a state handoff commit + Supabase save. No exceptions.

## Governance & Repo Structure

```
governance/system_rules.md     — Immutable rules (change only via decisions.md)
state/current_state.md         — Operational state, updated end-of-session
state/work_queue.md            — Prioritized tasks (max 1 ACTIVE)
state/session_handoff.md       — Last session context + next steps
project_memory/architecture.md — Stable architecture docs
project_memory/decisions.md    — Cumulative decision log
project_memory/learnings.md    — What was learned and why
api/state.js                   — Vercel serverless: GET /api/state → full state JSON
scripts/setup-supabase.sql     — SQL schema for persistent memory tables
scripts/seed.js                — Seeds Supabase from markdown files
```
