# Architecture Changelog
*Loggas när systemet förändras strukturellt. Signalerar att CLAUDE.md kan behöva uppdateras.*
*Append-only. Nyast överst.*

---

## FORMAT
```
### YYYY-MM-DD — Förändring
**Vad:** Vad lades till / ändrades / togs bort
**Påverkar CLAUDE.md:** Ja/Nej — vilken sektion
**Åtgärd:** Uppdaterad / Väntar
```

---

### 2026-03-24 — CLAUDE.md uppdaterad till fullständigt tillstånd
**Vad:** CLAUDE.md reskriven med goals.md, project_context.md, autonomous agent, 6-modells-arkitektur, next_session_brief-protokoll, architecture_changelog
**Påverkar CLAUDE.md:** Hela dokumentet
**Åtgärd:** Uppdaterad ✅

### 2026-03-24 — Architecture changelog skapad
**Vad:** `governance/architecture_changelog.md` skapad. Ingår nu i boot-sekvensen och handoff-protokollet.
**Påverkar CLAUDE.md:** Boot protocol steg 7, Handoff steg 8, Repo-struktur
**Åtgärd:** Uppdaterad ✅

### 2026-03-24 — next_session_brief-protokoll
**Vad:** `project_memory/next_session_brief.md` används nu för att ge CC specifika instruktioner per session. Läses vid boot, raderas när den följts.
**Påverkar CLAUDE.md:** Boot protocol, Handoff protocol
**Åtgärd:** Uppdaterad ✅

### 2026-03-24 — Autonomous agent live (VISION-005)
**Vad:** `scripts/autonomous-agent.js` + `.github/workflows/autonomous-agent.yml` skapade. Agenten triggar på push till main, läser alla projekt, skriver rapport.
**Påverkar CLAUDE.md:** Ny sektion: Autonomous Agent
**Åtgärd:** Uppdaterad ✅

### 2026-03-24 — project_context.md per underprojekt
**Vad:** Alla underprojekt fick `project_memory/project_context.md` med syfte, mål, vad styr-ai ska bevaka.
**Påverkar CLAUDE.md:** Boot protocol steg 2
**Åtgärd:** Uppdaterad ✅

### 2026-03-24 — goals.md + system_rules.md (VISION-001 + VISION-004)
**Vad:** `project_memory/goals.md` och `governance/system_rules.md` skapade.
**Påverkar CLAUDE.md:** Boot protocol, autonomigränser
**Åtgärd:** Uppdaterad ✅
