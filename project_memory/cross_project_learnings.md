# Cross-Project Learnings
*Aggregerade insikter från alla underprojekt. Uppdateras av styr-ai vid session close.*

---

## Systeminsikter

### 2026-03-23 — Persistent memory setup
- GitHub MCP Connector måste INSTALLERAS (inte bara auktoriseras) för write-access
- Privata repos kräver installation via github.com/apps/anthropic-github-mcp-connector
- Alternativ: gör repos publika (inga hemligheter i state-filer)
- `tr '-' ''` i zsh ger tomt resultat — använd `tr -d '-'` istället
- Session boot-instruktioner i Claude.ai Project Instructions är tillräckligt för att driva read/write-cykeln

### 2026-03-24 — Agent-arkitektur
- push_files (tree API) blockeras av GitHub MCP — använd create_or_update_file istället
- .github/workflows/ kräver manuell commit via GitHub UI — GitHub-säkerhetsbegränsning
- Agent som triggar på push skapar loop (committar → triggar sig själv) — använd cron istället
- work_queue måste ha ID-deduplicering — annars appendar agenten samma items upprepade gånger
- approvals.md är rätt mönster för Gustav att godkänna autonoma actions

### 2026-03-24 — Model-kalibrering TRADESYS
- En enda score-modell löser fel problem — behövs 6 separata: ENTRY/PASS/SIZE/HOLD/ADD/EXIT
- VIXY ≠ VIX — contango-decay gör att VIXY ~15 ≈ VIX ~20
- VIX bör vara manuellt filter — "buy when others are fearful" kräver omdöme, inte automation
- Out-of-sample test avgör om modellförbättringar håller — inte samma dataset
- Model v2 51.2% training, 34.9% OOS — VIXY-bias förklarar skillnaden
- 241+ case-filer genererade, case-format etablerat för top-gainers-agenten

### 2026-03-24 — Projekt-governance
- CLAUDE.md glider efter när systemet växer — måste ingå i session handoff-protokollet
- architecture_changelog.md löser problämet med inaktuell CLAUDE.md
- project_context.md per underprojekt är kritisk för att agenten förstår projektens egna mål
- next_session_brief.md är rätt mönster för att ge CC specifika instruktioner per session

---

## Cross-project patterns

- **Tradesys regimbedömning** påverkar timing för Savage Roar releases (RISK-OFF = sämre streamingmånad)
- **Adminassistent** och **Savage Roar** delar operativ last — adminassistenten bör prioritera Warner-deadlines
- **Top gainers case-filer** byggs upp dagligen — ENTRY-v1 tränas mot dem när tillräckligt med data finns
