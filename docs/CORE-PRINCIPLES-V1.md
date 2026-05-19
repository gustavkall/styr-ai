# SPEC-S-CORE-PRINCIPLES-V1 — Core System Principles

**Spec-ID:** SPEC-S-CORE-PRINCIPLES-V1
**Project:** styr-ai (meta-governance)
**Type:** TYP 2 — TVÄRPROJEKT-PRINCIP (gäller engrams + tradesys + alla agenter)
**Version:** v1.0-draft
**Author:** CA (Claude.ai)
**Status:** UTKAST — väntar Codex convergence review + Gustav-godkännande
**Created:** 2026-05-19
**Supersedes:** Inget (första versionen)
**Applies to:** Alla agenter (CA, CC-eng, CC-tdy, Codex, ChatGPT), alla projekt (engrams, tradesys, styr-ai, savage-roar, golf), alla pipelines, modeller, specer, deployments

---

## ═══════════════════════════════════════
## SCOPE & PURPOSE
## ═══════════════════════════════════════

Detta är Gustavs operativa konstitution för agent-baserat utvecklingsarbete. 12 principer i 4 kluster som tillsammans definierar:

- Vad som räknas som sanning (TRUTH)
- Vad som krävs som bevis (EVIDENCE)
- Vad som måste vara synligt (VISIBILITY)
- Hur disciplin upprätthålls (DISCIPLINE)

**Detta dokument ersätter inte:**
- Specifika SPEC-T-*-specer (de implementerar principerna)
- Pinnade behavioral rules per projekt (de detaljerar principerna)
- Gustavs explicita instruktioner i session (de overrider principerna när motivat)

**Detta dokument ersätter:**
- Ad hoc-resonemang om "är detta rätt approach?"
- Diskussion om "men i förra projektet gjorde vi X"
- Subjektiv bedömning av om en agent följer canonical praxis

**Rationale:** Utan en skriven konstitution glider canonical praxis över tid. 12 principer = lätt att läsa vid varje session start, lätt att referera i specer, lätt att flagga brott mot.

---

## ═══════════════════════════════════════
## KLUSTER A — TRUTH
## ═══════════════════════════════════════

### Princip 1: Single Canonical Source of Truth

**Statement:**
För varje subsystem och varje kritisk entitet finns exakt en auktoritativ runtime-sanning. Frontend, cache, JSON-filer, git snapshots, localStorage, browser state och derived views får aldrig fungera som konkurrerande sanningar.

**Canonical owners per entitet:**

| Entitet | Canonical owner | Anti-pattern |
|---------|----------------|--------------|
| Signals | `signal_evaluations` (Supabase) | Browser-computed P(win) |
| Alerts | `alert_events` (Supabase) | live_cache ephemeral state |
| Trades | `agent_trades_v2` (Supabase) | Git commit history alone |
| Regimes | `regime_snapshots` (Supabase) | git `REGIME.json` dual-read |
| Model versions | `model_versions` (Supabase) | Filnamn i `data/` |
| Replay runs | `replay_runs` + `replay_trades` | CSV-export alone |
| Experiment results | `experiments` table | Free text i `notes` |
| Agent decisions | `agent_trades_v2.model_lineage` | stdout-logg |
| Exits | `dynamic_exit_shadow_decisions` | Browser-computed P(drop) |
| Memories (Engrams) | `memories` table (Engrams Supabase) | Lokala anteckningar |

**Rationale:**
Konkurrerande sanningar driftar oundvikligen. När browser-P(win) divergerar från backend-P(win) har vi ingen formell sanning — och inget agentbeslut kan auditeras.

**Enforcement:**
- Frontend som beräknar canonical state är ett P0-bugg-tillstånd
- Spec som introducerar ny entitet måste deklarera canonical owner
- Drift mellan canonical och derived view → automatic alert (P2-deliverable)

**Exceptions:**
- Cache och derived views är OK om de explicit deklareras som sekundära
- Git snapshots/exports OK som backup/fallback men aldrig som primär källa
- LLM-output får cachas i minne under en session men inte persisteras som sanning utan validering

---

## ═══════════════════════════════════════
## KLUSTER B — EVIDENCE
## ═══════════════════════════════════════

### Princip 2: Empirical Evidence Required for Edge Claims

**Statement:**
Påståenden om edge, signal-kvalitet eller modellförbättring kräver empirisk evidens. Anekdotisk evidens, intuition eller "ser bra ut i backtesten" räknas inte.

**Minimum evidence thresholds:**

| Påstående | Krav |
|-----------|------|
| "Denna signal har edge" | ≥100 replay-trades med p<0.05 vs baseline |
| "Modell A slår modell B" | Replay-gate PASS (>0.5pp overall, >1pp per regime) |
| "Denna feature drar conviction" | Stratification med ≥30 trades per bucket |
| "Threshold X är optimal" | Sensitivity-analys ±20%, stabilt resultat |
| "Live performance matchar replay" | ≥30 live-trades, divergens <5pp |
| "Edge har försämrats" | Rolling 50-trade WR < baseline -5pp |

**Rationale:**
Utan threshold för "vad räknas som bevis" kan varje agent påstå vad som helst. Konkreta tröskelvärden gör claims auditbara.

**Enforcement:**
- Spec som föreslår ny edge/signal/threshold måste cite:a evidens
- "Tror jag" / "ser ut som" / "borde fungera" är inte evidens
- Agent som påstår edge utan stöd → CA flaggar som drift-pattern

**Exceptions:**
- Säkerhets-mekanismer (drawdown floors, position limits, kill switches) kräver inte edge-bevis — de motiveras av risk management
- Research-experiment får producera hypoteser utan bevis; men hypotes ≠ deployment

---

### Princip 3: Deterministic & Auditable Pipelines

**Statement:**
Samma input + samma model/version/configuration ger samma output. Pipelines som inte kan vara deterministiska (LLM-anrop, externa API:er, marknadsdata) måste explicit deklarera det och persistera både input och output.

**Per pipeline-typ:**

| Pipeline | Determinism-krav | Persistens-krav |
|----------|-----------------|----------------|
| Replay/backtest | Fullt deterministisk | Input data hash + config + git SHA + output |
| Model training | Deterministisk gd seed | training_data hash + hyperparams + weights hash |
| Signal evaluation | Deterministisk per model_version | Input features + model_version_id + output |
| LLM agent-analys | EJ deterministisk | Persistera input prompt + output + model_id + timestamp |
| External API call | EJ deterministisk | Persistera request + response + timestamp |

**Rationale:**
Deterministiska pipelines kan reproduceras → kan auditeras → kan debuggas. LLM/API-anrop är icke-deterministiska men måste loggas så att vi kan rekonstruera *vad agenten såg* när den fattade ett beslut.

**Enforcement:**
- Replay/backtest som inte är reproducerbar är ett P0-bugg
- LLM-anrop utan input/output-persistens är ett observability-brott (Princip 6)
- Agent får inte fatta canonical state-beslut baserat på icke-loggat LLM-output

**Exceptions:**
- True randomness (UUID, random seeds för exploration) får icke-deterministisk vara men måste persisteras
- Live market data är icke-deterministisk över tid; persisteras som timestamped snapshots

---

## ═══════════════════════════════════════
## KLUSTER C — VISIBILITY
## ═══════════════════════════════════════

### Princip 4: Observable Present State

**Statement:**
Systemet ska alltid kunna förklara sitt nuvarande tillstånd:
- Vad händer just nu (pågående pipelines, öppna positioner)
- Vilken modell/version som används live
- Vilken data systemet baserar beslut på
- När data senast uppdaterades
- Om data är stale
- Om någon pipeline har failat

**Konkret krav per system:**

| System | Måste exponera |
|--------|----------------|
| Pipelines | `runs` table med status, duration, failure_reason |
| Models | `model_versions` med `status='live'` query |
| Data freshness | Per tabell: `updated_at`, `is_stale`, `stale_after` |
| Active alerts | `alert_events` WHERE status='new' |
| Agent state | `agent_positions` + `agent_trades_v2` recent activity |
| Failed operations | Strukturerad logg i `monitoring_run_details` |

**Rationale:**
Osynlig runtime-logik är inte acceptabel. Om Gustav inte kan svara på "vad gör systemet just nu?" inom 30 sekunder genom att titta på dashboard/API — observability fail.

**Enforcement:**
- Ny komponent som inte exponerar status/freshness är blockerad
- Frontend-paneler måste ha freshness-badge med källa + ålder
- Cron-jobb utan persistens till `runs` är observability-brott

**Exceptions:**
- Inga. Observability är non-negotiable.

---

### Princip 5: Reconstructable Historical State

**Statement:**
För varje canonical artefakt (trade, signal, decision, model-output) ska vi kunna rekonstruera:
- Vilken model version producerade det
- Vilken feature set användes
- Vilken replay run/experiment hör det till
- Vilket regime gällde
- Vilken data källa
- Vilken git SHA
- Vilken config version

**Per artefakt-typ:**

| Artefakt | Lineage-krav |
|----------|--------------|
| Trade (live) | model_version_id FK + features_snapshot + git_sha + config_version |
| Signal | model_version_id FK + features JSONB + regime |
| Replay trade | replay_run_id FK + model versions + git_sha |
| Alert | rule_id FK + trigger_value + regime + related_catalysts |
| Memory (Engrams) | session_id + project + type + timestamp |

**Rationale:**
Utan lineage kan vi inte svara "varför slog v17 v16?" eller "vilken feature driver edge?" Utan svar på den frågan kan vi inte förbättra systemet.

**Enforcement:**
- Trade utan model_version_id FK är ett P0-bug
- Signal utan features_snapshot är ett P0-bug
- Replay-run utan git SHA + config_hash är ett P0-bug

**Exceptions:**
- Pre-existing rows från före lineage-arkitektur är OK retroaktivt
- Backfill av historisk lineage är inte krävd (men bra om möjligt)

---

### Princip 6: Event & Signal Persistence

**Statement:**
Alla beslutsrelevanta signaler, alerts, decisions och trades persisteras strukturerat och är historiskt sökbara. Ephemeral data (browser-state, in-memory queues, console logs) får inte vara enda källa till någon canonical signal.

**Per typ:**

| Typ | Persistens |
|-----|------------|
| Signal evaluations | `signal_evaluations` (Princip 1 canonical owner) |
| Alerts | `alert_events` med lifecycle (new/acknowledged/dismissed/acted_on) |
| Trades | `agent_trades_v2` med full lineage |
| Rejection decisions | `signal_candidates_v2` (LOG_SIGNAL_CANDIDATES=true) |
| Configuration changes | git commit + audit log |
| Self-correction events | strukturerad logg (idag saknas — P2-deliverable) |

**Rationale:**
"Varför köpte inte systemet NVDA igår?" måste vara svarbart. Om rejection-pathen är ephemeral kan vi inte mäta precision/recall.

**Enforcement:**
- LOG_SIGNAL_CANDIDATES=true ska vara default (P0)
- Self-correction adjustments ska loggas till audit-tabell (P2)
- stdout-only loggar för canonical beslut är otillräckligt

**Exceptions:**
- UI-state (vilken tab är aktiv) får vara ephemeral
- Tillfälliga beräkningar i scripts som producerar persistent output är OK

---

## ═══════════════════════════════════════
## KLUSTER D — DISCIPLINE
## ═══════════════════════════════════════

### Princip 7: Research ≠ Runtime

**Statement:**
Research, experimentation och replay får aldrig implicit modifiera live runtime-state. Experiment måste isoleras från canonical runtime tills de explicit validerats och promoteras genom deployment-gate.

**Konkret separation:**

| Layer | Tillåtet | Förbjudet |
|-------|----------|-----------|
| Research | Producera nya modeller, features, thresholds | Direct deployment till live |
| Replay/backtest | Skriva till `replay_runs`, `replay_trades` | Skriva till `agent_trades_v2`, `model_versions` (status='live') |
| Validation | Replay-gate, holdout test | Self-promotion av modell |
| Deployment | Explicit gate PASS + Gustav-godkännande | Implicit promotion |

**Rationale:**
Utan separation kan ett experiment som "ser bra ut" smita in i live utan validering. Det är hur retail-trading-system blåser upp.

**Enforcement:**
- Model deployment kräver replay-gate PASS i CI
- `model_versions.status='live'` får bara sättas efter explicit Gustav-approval
- Research-skript får inte ha skriv-access till `agent_trades_v2`

**Exceptions:**
- Shadow mode: research-output får testas live i shadow utan execution (befintlig praxis OK)

---

### Princip 8: Signal-Driven Runtime

**Statement:**
Live-beslut styrs av signal-state och evidens. Hårdkodade värden är acceptabla endast som safety nets (drawdown floors, position limits, kill switches) — aldrig som primär decision logic.

**Decision-typ klassificering:**

| Typ | Får vara hårdkodad? | Exempel |
|-----|---------------------|---------|
| Entry/hold/exit logic | NEJ — signal-driven | EMA20 dip detection, exit på conviction decay |
| Safety nets | JA — hårdkodad | Drawdown floor -8%, max position 5% |
| Capital limits | JA — config | Max exposure per sector, max open positions |
| Threshold values | NEJ — empiriskt validerade | RVOL threshold, conviction threshold |
| Time-based exits | NEJ i live — JA i replay | Fixed 10d hold = research parameter, inte live regel |

**Rationale:**
Hårdkodning är opacitet förklädd till simplicity. Empiriskt validerade thresholds som ligger i config + spec är inte hårdkodning — de är decisions med audit trail.

**Enforcement:**
- Spec som introducerar magic number kräver evidens-citation (Princip 2)
- Time-based exits i live kräver explicit motivering eller är förbjudna
- Safety nets ska deklareras som safety nets i kommentar/spec

**Exceptions:**
- Kill switches ska vara hårdkodade och svåra att överrida — det är poängen

---

### Princip 9: Simplicity Test Before Complexity

**Statement:**
Ny komplexitet kräver tre saker:
1. En mätbar förbättring som specifik metric
2. En revertplan
3. Ett scenario där den enklare lösningen explicit testats och misslyckats

"Cool quant architecture" är inte ett mål. Långsiktig systemintegritet är.

**Komplexitets-test (innan implementation):**

| Fråga | Krav |
|-------|------|
| Vad är den specifika metric förbättringen? | "WR +Xpp" eller "latency -Xs" — inte "bättre" |
| Vad är den enklare lösningen? | Måste vara namngiven |
| Varför fungerar inte den enklare? | Måste vara empiriskt visat eller motiverat |
| Hur reverterar vi om det blir sämre? | Konkret rollback-plan |
| Vad kostar underhåll på 6 månaders sikt? | Estimat krävs |

**Rationale:**
Komplexitet är skuld. Varje ny komponent ska underhållas, monitoras, debugas. Default ska vara att inte lägga till.

**Enforcement:**
- Spec som introducerar nytt subsystem måste ha "Simplicity Test"-sektion
- CA-EXHAUSTIVE-ENUMERATION är ett känt drift-pattern — agenter ska aktivt motverka det
- Composite confidence-formler, meta-models, multi-layer cache är default suspekta tills bevisade

**Exceptions:**
- Foundation work (canonical state, observability) får vara "komplex" — det är fundament
- Refactoring som minskar komplexitet behöver inte motiveras

---

### Princip 10: Human-Aware Confidence

**Statement:**
Systemet är explicit med när det vet och när det inte vet. Det får inte ge falsk precision. Confidence ska kommuniceras med uncertainty bands eller kategoriska nivåer (HIGH/MEDIUM/LOW/UNKNOWN).

**Per output-typ:**

| Output | Krav |
|--------|------|
| P(win) score | Med regime-confidence och analog-confidence som kontext |
| Recommendation (ENTRY/EXIT/HOLD/WATCH/AVOID) | Med confidence-level + driving factors |
| Modell-prediction | Med model_version + OOS WR för regime |
| Alert severity | Inte bara "HIGH" — också uncertainty + recommended action |
| Agent rejection | Med rejection reason + threshold-context |

**Rationale:**
"P(win) = 0.65" utan kontext är falsk precision. "P(win) = 0.65, regime=BULL där modellen har 49% OOS WR" är ärlig kommunikation.

**Enforcement:**
- UI som visar P(win) utan regime-confidence är blockerad
- Recommendations utan reasoning är blockerade
- Agent som claimar "stark signal" utan kvantifiering flaggas

**Exceptions:**
- Inga. Falsk precision är inte ett designval.

---

### Princip 11: Architecture Before Velocity

**Statement:**
Spec-godkännande krävs innan implementation av komponenter som rör:
- Canonical state (Princip 1)
- Model layer (träning, deployment, versioning)
- Agent decision authority (Princip 12)
- Schema-ändringar (Supabase DDL)
- Cross-project arkitektur (Engrams ↔ TradeSys)

**Spec krävs INTE för:**
- Frontend tweaks (CSS, layout, visual polish)
- Bug fixes utan canonical state-påverkan
- Refactor som inte ändrar contracts
- Lokala script som inte deployar
- Engrams memories (inte specer)

**Rationale:**
Architecture-ändringar utan spec ackumulerar teknisk skuld. Frontend-polish utan spec är effektivt. Båda kan vara sant samtidigt.

**Enforcement:**
- Komponent som rör canonical state och saknar spec → P0 stop
- CC-agent som börjar implementera utan godkänd spec → CA flaggar
- Spec-godkännande loggas i Engrams med marker `SPEC-APPROVED-{spec-id}`

**Exceptions:**
- Gustav kan explicit beordra implementation utan spec; det loggas som override

---

### Princip 12: Agent Authority Boundaries

**Statement:**
Varje agent har en explicit definierad authority level. Authority eskaleras aldrig implicit. Cross-agent kommunikation går genom Engrams (handoffs, tasks, memories) — inte via paste eller URL.

**Authority levels:**

| Level | Får göra | Får inte göra |
|-------|---------|--------------|
| Advisory | Producera analyser, rekommendationer | Direct deployment, irreversibla ops |
| Autonomous-paper | Producera paper trades, shadow decisions | Live trading, schema changes |
| Autonomous-shadow | Loggning utan exekvering | Påverka live state |
| Autonomous-live | Live execution inom limits | Override safety nets, expand scope |

**Per agent (current state):**

| Agent | Authority | Scope |
|-------|-----------|-------|
| CA (Claude.ai) | Advisory | Spec design, strategi, convergence review |
| CC-eng (Claude Code Engrams) | Autonomous-paper inom Engrams repo | Implementation efter godkänd spec |
| CC-tdy (Claude Code TradeSys) | Autonomous-paper inom TradeSys repo | Implementation efter godkänd spec |
| Codex | Advisory | Research, verification, convergence review |
| ChatGPT | Advisory | Market positioning |
| Shadowbot-v2 | Autonomous-paper | Paper trading per config |

**Cross-agent protocol:**
- Handoffs: explicit `queue_handoff()` i Engrams med target agent
- Tasks: `create_task()` med owner-tag [CA]/[CC-eng]/[CC-tdy]/[Codex]
- Memories: alla agenter läser från Engrams vid session start
- Direct paste från Gustav räknas inte som agent-to-agent communication

**Override-protokoll:**
- Gustav kan eskalera en agents authority för en specifik uppgift
- Eskalering loggas i Engrams som `AUTHORITY-OVERRIDE-{date}-{agent}`
- Override gäller bara den explicit angivna uppgiften, inte permanent

**Rationale:**
Utan explicit authority glider scope. CC-tdy som börjar fatta strategiska beslut, CA som börjar implementera, Codex som claimar verification utan ground-truth — alla är drift-patterns.

**Enforcement:**
- Agent som agerar utanför sin authority → CA/Gustav flaggar
- Cross-agent claims utan Engrams handoff räknas inte
- Ground-truth verification krävs på all agent-output (se nedan)

**Exceptions:**
- Akuta situationer (bug i live trading) kan kräva immediate action; logga retroaktivt

---

## ═══════════════════════════════════════
## SUPPORTING REQUIREMENTS
## ═══════════════════════════════════════

### S.1 — Ground-Truth Verification

Detta är inte en princip i sig — det är en operativ krav som följer av Princip 12.

**Statement:**
Agent-claims om producerade artefakter ska verifieras mot faktisk repo/DB-state innan de räknas som klara.

**Check-list per artefakt-typ:**

| Artefakt | Verifierings-steg |
|----------|-------------------|
| Git commit | `git log` visar push till specified branch |
| Supabase row | `SELECT count(*) FROM table WHERE marker=...` returnerar förväntat |
| Engrams memory | `get_by_marker()` returnerar memory med rätt project |
| File creation | `view` på path returnerar förväntat content |
| API endpoint | `curl` returnerar förväntat response |

**Documented incidents:**
- 2026-05-15: CC-tdy RVOL-bug claim — ground-truth visade fil var commitad lokalt men inte pushad
- 2026-05-18: CC-tdy 7 docs claim — initial check visade docs fanns på lokal branch, inte main

**Enforcement:** Inkluderas i pre-handoff-review checklist per agent.

---

### S.2 — Reversibility by Default

**Statement:**
Alla deployments, schema-ändringar och config-uppdateringar ska vara reversibla inom 24 timmar. Irreversibla operationer kräver explicit Gustav-godkännande och rollback-plan i samma PR.

**Irreversibla operationer (kräver explicit approval):**
- `DROP TABLE`, `TRUNCATE`, `DELETE` utan backup
- Model overwrite utan version preservation
- Git force-push till main
- Production data migration utan rollback path

**Reversibla operationer (default-OK efter spec):**
- Schema additive changes (ADD COLUMN)
- New table creation
- New cron job activation
- Feature flag toggle

**Enforcement:** PR-review kräver "Reversibility:" sektion för canonical-state-changes.

---

### S.3 — Replay-to-Live Integrity

**Statement:**
Replay/backtest jämförs kontinuerligt mot live/paper-resultat för att upptäcka edge decay, overfitting, regime drift eller replay/live divergence.

**Automatic triggers:**
- Live WR < replay baseline - 5pp över 50 trades → automatic alert
- Replay WR > live WR + 10pp → flagga som potentiell overfitting
- Regime classifier output divergerar > 20% från baseline → audit krävs

**Enforcement:** Del av P2 alert-system (separat spec).

---

### S.4 — Failure Analysis Mandatory

**Statement:**
Misslyckade trades, modeller och signaler analyseras lika rigoröst som framgångsrika.

**Krav:**
- Förlorande trade > 2% loss: post-mortem entry inom 7 dagar
- Edge decay > 5pp rolling 50-trade: pause-or-retrain-beslut inom 14 dagar
- False positive HIGH alert: review inom 24h
- Modell som failar replay-gate: root cause analysis innan retry

**Enforcement:** Stale failure-analyses flaggas i CA boot diagnostics.

---

## ═══════════════════════════════════════
## ENFORCEMENT ARCHITECTURE
## ═══════════════════════════════════════

### Skikt 1 — Canonical Artefakt

Detta dokument är canonical reference. Lagras:
- **Engrams:** type:instruction, marker=CORE-PRINCIPLES-V1, project=styr-ai, **pinned**
- **GitHub engrams repo:** `docs/CORE-PRINCIPLES-V1.md`
- **GitHub tradesys1337 repo:** `docs/CORE-PRINCIPLES-V1.md`
- **GitHub styr-ai repo:** `docs/CORE-PRINCIPLES-V1.md` (master copy)

Vid uppdatering: bumpa version (V1 → V2), uppdatera alla 4 platser samma session, supersede metadata i Engrams.

### Skikt 2 — Boot-Time Injection

**Per agent:**

| Agent | Boot mechanism |
|-------|---------------|
| CA | `engrams boot` läser CORE-PRINCIPLES-V1 från instructions automatically |
| CC-eng | `CLAUDE.md` i engrams repo refererar `docs/CORE-PRINCIPLES-V1.md` + Engrams read |
| CC-tdy | `CLAUDE.md` i tradesys1337 repo refererar `docs/CORE-PRINCIPLES-V1.md` + Engrams read |
| Codex | Inkluderas i system prompt vid varje session |
| ChatGPT | Inkluderas i custom instructions |

Detta är **passive enforcement** — agenten vet om principerna och kan referera dem.

### Skikt 3 — Spec-Template Gate

**Krav:** Alla nya SPEC-T-* / SPEC-E-* / SPEC-S-*-specer måste ha en `## Principle Compliance` sektion.

**Format:**

```markdown
## Principle Compliance

Denna spec interagerar med följande principer:

| Princip | Påverkan | Compliance |
|---------|----------|-----------|
| Princip 1 (Canonical SoT) | [Påverkar? Hur?] | [Compliant? Hur?] |
| Princip 5 (Lineage) | ... | ... |
| Princip 9 (Simplicity Test) | ... | ... |
| ... | | |

**Simplicity Test (om ny komplexitet):**
- Specifik metric förbättring: ...
- Enklare alternativ: ...
- Varför enklare inte räcker: ...
- Revertplan: ...

**Authority impact (om agent-scope ändras):**
- Affected agents: ...
- New authority level: ...
- Override required from Gustav: yes/no
```

**Enforcement:** Spec utan denna sektion → CA flaggar som NEEDS-REVISION oavsett innehåll.

### Skikt 4 — Automated Checks (P2+, future)

Lint-regler för repo:
- Hardcoded baseline detection (grep för specific patterns)
- Frontend canonical-state-computation detection
- Schema-change-utan-spec detection

Inte MVP. Spec separat när vi når P2.

---

## ═══════════════════════════════════════
## OVERRIDE & EXCEPTION PROTOCOL
## ═══════════════════════════════════════

### Gustav Override

Gustav kan overrida vilken princip som helst för en specifik uppgift.

**Krav:**
- Override måste vara explicit i chat ("override princip X för denna uppgift")
- Override loggas i Engrams som `PRINCIPLE-OVERRIDE-{date}-{principle}-{rationale}`
- Override gäller bara den explicit angivna uppgiften, inte permanent
- Repeterande override av samma princip = signal att principen behöver revidering

### Princip-revision

**När:**
- Repeterande override av samma princip
- En princip visar sig oimplementerbar
- Quarterly review identifierar problem

**Process:**
1. CA producerar SPEC-S-CORE-PRINCIPLES-V{N+1} draft
2. Codex convergence review
3. Gustav-godkännande
4. Bump version, uppdatera alla 4 lagringsplatser
5. Engrams: supersede V1 → V2

---

## ═══════════════════════════════════════
## SUMMARY TABLE
## ═══════════════════════════════════════

| # | Princip | Kluster | Status |
|---|---------|---------|--------|
| 1 | Single Canonical Source of Truth | TRUTH | Active |
| 2 | Empirical Evidence Required for Edge Claims | EVIDENCE | Active |
| 3 | Deterministic & Auditable Pipelines | EVIDENCE | Active |
| 4 | Observable Present State | VISIBILITY | Active |
| 5 | Reconstructable Historical State | VISIBILITY | Active |
| 6 | Event & Signal Persistence | VISIBILITY | Active |
| 7 | Research ≠ Runtime | DISCIPLINE | Active |
| 8 | Signal-Driven Runtime | DISCIPLINE | Active |
| 9 | Simplicity Test Before Complexity | DISCIPLINE | Active |
| 10 | Human-Aware Confidence | DISCIPLINE | Active |
| 11 | Architecture Before Velocity | DISCIPLINE | Active |
| 12 | Agent Authority Boundaries | DISCIPLINE | Active |

**Supporting Requirements:**
- S.1 Ground-Truth Verification
- S.2 Reversibility by Default
- S.3 Replay-to-Live Integrity
- S.4 Failure Analysis Mandatory

---

## ═══════════════════════════════════════
## REFERENCES
## ═══════════════════════════════════════

**Source materials:**
- ChatGPT proposal 2026-05-19 (15 original principles)
- CA feedback session 2026-05-19 (clustering, 4 additions, enforcement architecture)
- Drift-patterns observed: CA-EXHAUSTIVE-ENUMERATION, RVOL-bug 2026-05-15, 7-docs-not-pushed 2026-05-18

**Related specs:**
- RATIONALE-FRAMEWORK-PROTOCOL-001 (TYP-classification, supports Princip 11)
- SPEC-E-PRODUCT-VISIBILITY-CONTRACT-001 (supports Princip 1)
- SPEC-E-FULLTEXT-PERSISTENCE-RULE-001 (supports Princip 6)
- SPEC-E-PRE-HANDOFF-CRITICAL-REVIEW-001 (supports S.1)

**Pinned behavioral rules (per-project, complement these principles):**
- Engrams project: existing pinned rules
- TradeSys project: existing pinned rules
- Styr-ai project: this document

---

**Author:** CA (ca-2026-05-19-1015)
**Awaiting:** Codex convergence review + Gustav approval
**Next steps after approval:**
1. Push to all 3 GitHub repos
2. Update CLAUDE.md per repo with reference
3. Engrams pinned at type:instruction
4. Quarterly review scheduled 2026-08-19
