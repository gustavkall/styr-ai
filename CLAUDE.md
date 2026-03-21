# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## What is styr-ai

styr-ai — built with claude-memory-scaffold

Live: https://styr-ai.vercel.app

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

### Step 2: Supplementary files (for rules, architecture, work queue)
Fetch these files from GitHub for context not in API:
1. https://raw.githubusercontent.com/gustavkall/styr-ai/main/governance/system_rules.md
2. https://raw.githubusercontent.com/gustavkall/styr-ai/main/state/work_queue.md
3. https://raw.githubusercontent.com/gustavkall/styr-ai/main/project_memory/architecture.md
4. https://raw.githubusercontent.com/gustavkall/styr-ai/main/project_memory/decisions.md

### Step 3: Determine next action
From API state + work queue: current system state, active/blocked work, and the exact next task.

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
