# styr-ai — Architecture

## Overview
*Describe the system architecture here as it evolves.*

## Persistence Stack
- **Supabase** — sessions, decisions, learnings (queryable, cross-session)
- **Vercel API** — `/api/state` returns full system state as JSON
- **GitHub repo** — state/, project_memory/ files (version-controlled)
- **Claude auto-memory** — `~/.claude/projects/.../memory/` (user, feedback, project, reference)
- **localStorage** — runtime app state (if applicable)

## Data Flow
```
Session Start:
  GET /api/state → Supabase → JSON (sessions + decisions + learnings)
  + GitHub raw files (rules, work_queue, architecture, decisions)

Session End:
  Update state/ + project_memory/ files
  Save to Supabase (sbSaveSession)
  git commit + push
```
