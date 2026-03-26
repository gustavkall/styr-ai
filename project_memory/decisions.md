# styr-ai — Decision Log
*Cumulative log of architectural and design decisions. Append-only.*

---

## FORMAT
```
### [DATE] — [DECISION TITLE]
**Context:** What prompted this decision?
**Decision:** What was decided?
**Why:** Why this approach over alternatives?
**Impact:** What changed as a result?
```

---

### 2026-03-24 — Goals layer definierad (VISION-001)
**Context:** styr-ai saknade ett explicit mål. Work items prioriterades utan referenspunkt.
**Decision:** goals.md definierar systemets syfte som leverage-multiplikator. Kärnfunktioner: persistent kontext, godkännandebaserad exekvering, autonom exekvering inom ramar, proaktiv prioritering, blind spot-detektion, systemövervakning.
**Why:** Utan ett tydligt mål optimeras systemet för fel saker. Goals layer är prerequisite för meningsfull prioritering och VISION-002/003.
**Impact:** Alla framtida work items värderas mot goals.md. Systemet kan flagga när prioriteringen avviker från målet.

### 2026-03-24 — Autonomigränser definierade (VISION-004)
**Context:** VISION-005 (autonom exekvering via GitHub Actions) kräver tydliga ramar för vad som är tillåtet autonomt.
**Decision:** governance/system_rules.md definierar tre nivåer: autonomt tillåtet, kräver godkännande, aldrig autonomt. Eskaleringsregel: osäkerhet = fråga, aldrig gissa.
**Why:** Tydliga gränser är en förutsättning för autonom exekvering, inte ett hinder. Utan dem är VISION-005 en risk.
**Impact:** VISION-005 kan nu planeras. Godkännandeprocessen för projekt-scope är definierad.

### 2026-03-26 — Warner-tvist hanteras personligen
**Context:** COO-agenten eskalerade Warner-deadline (22 maj) som systemuppgift.
**Decision:** Gustav hanterar Warner-tvisten personligen. Inte en systemuppgift.
**Why:** Juridiska förhandlingar kräver personlig bedömning och relation — inte automation.
**Impact:** Eskalering WARNER-DEADLINE tas bort från systemets scope. COO ska inte eskalera detta framåt.

### 2026-03-26 — MODEL-002 och MODEL-003 bekräftat byggda
**Context:** COO-agenten flaggade EMS/FPS/STS scanner-labels och EPS surprise som saknade (MISSING-EDGE).
**Decision:** Gustav bekräftar att MODEL-002 (scanner-labels) och MODEL-003 (EPS surprise) redan är implementerade.
**Why:** COO hade inaktuell information — state-filer reflekterade inte faktiskt läge.
**Impact:** Båda markerade som completed i work_queue. MODEL-004 (dashboard-integration) är nästa steg.
