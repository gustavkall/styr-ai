# SPEC-S-CORE-PRINCIPLES-V1 — Core System Principles

**Spec-ID:** SPEC-S-CORE-PRINCIPLES-V1
**Project:** styr-ai (meta-governance)
**Type:** TYP 2 — TVÄRPROJEKT-PRINCIP (gäller engrams + tradesys + alla agenter)
**Version:** v1.3-draft
**Author:** CA (Claude.ai)
**Status:** UTKAST — väntar Gustav-godkännande efter Codex review (CODEX-REVIEW-CORE-PRINCIPLES-V1, 2026-05-20)
**Created:** 2026-05-19
**Updated:** 2026-05-22 (v1.3: addresses Codex review + new Princip 13 Runtime-State Trustworthiness)
**Supersedes:** v1.2-draft (2026-05-19)
**Applies to:** Alla agenter (CA, CC-eng, CC-tdy, Codex, ChatGPT), alla projekt (engrams, tradesys, styr-ai, savage-roar, golf), alla pipelines, modeller, specer, deployments

---

## SCOPE & PURPOSE

Detta är Gustavs operativa konstitution för agent-baserat utvecklingsarbete. 13 principer i 4 kluster som tillsammans definierar: vad som räknas som sanning (TRUTH), vad som krävs som bevis (EVIDENCE), vad som måste vara synligt (VISIBILITY), hur disciplin upprätthålls (DISCIPLINE).

Detta dokument ersätter inte: Specifika SPEC-T-*-specer, pinnade behavioral rules per projekt, Gustavs explicita instruktioner i session.

Detta dokument ersätter: Ad hoc-resonemang om "är detta rätt approach?", diskussion om "men i förra projektet gjorde vi X", subjektiv bedömning av om en agent följer canonical praxis.

Rationale: Utan en skriven konstitution glider canonical praxis över tid. 13 principer = lätt att läsa vid varje session start, lätt att referera i specer, lätt att flagga brott mot.

---

## GOVERNANCE METADATA (NY i v1.3)

Detta dokument blandar konstitutionella principer, TradeSys-specifika trösklar, framtida P2-enforcement och levande CA-ägda kataloguppdateringar. För att förhindra att utkast, framtida enforcement eller CA-appends behandlas som canonical runtime-sanning definieras följande metadata-axlar.

### Artifact Status Taxonomy

Varje persisterad spec, review, audit eller post-mortem ska markeras med en av följande statusar:

- `draft` — utkast under utveckling, inte review-request, inte canonical
- `review_requested` — utkast skickat till reviewer(s), väntar feedback
- `reviewed` — feedback mottagen, väntar revision eller approval
- `approved` — Gustav-godkänd, canonical runtime-sanning
- `superseded` — ersatt av nyare version, behålls för audit trail
- `rejected` — review-resultat negativt, behålls för audit trail men inte canonical

Status sparas i manifest-content (per SPEC-E-MEMORY-TYPE-SPEC-002). Status uppdateras via supersede med samma marker.

### Enforcement Status Labels

Varje regel/krav i denna spec markeras med en av följande enforcement-statusar:

- `ACTIVE-MANUAL` — gäller idag, enforced manuellt av agenter
- `ACTIVE-BOOT` — gäller idag, enforced via boot-loaded pinned instructions
- `ACTIVE-TEMPLATE` — gäller idag, enforced via spec/PR-template
- `FUTURE-AUTOMATED` — kravet är beskrivet men automatisk enforcement är inte byggd ännu (P2+)

### Threshold Status Labels

Numeriska trösklar i denna spec markeras med en av följande:

- `candidate default v1` — föreslaget värde, ej validerat empiriskt
- `validated v1` — empiriskt validerat, citeras med källa
- `superseded` — ersatt av nyare validering

Threshold-värden ägs av projekt-specifika specer, inte av denna konstitution. Konstitutionen kräver att trösklar existerar, är versionerade och citerar källa — exakta nummer ägs av TradeSys (eller motsvarande projekt-spec).

### Threshold Ownership Cross-Reference

| Threshold-typ | Owner | Source spec | Status |
|---------------|-------|-------------|--------|
| Replay-trades minimum för edge claim | TradeSys | SPEC-T-EDGE-VALIDATION-* (TBD) | candidate default v1 |
| P-value threshold för statistical significance | TradeSys | SPEC-T-EDGE-VALIDATION-* (TBD) | candidate default v1 |
| Modell vs baseline WR-delta minimum | TradeSys | SPEC-T-REPLAY-GATE-* (TBD) | candidate default v1 |
| Stratification trades per bucket | TradeSys | SPEC-T-CONVICTION-* (TBD) | candidate default v1 |
| Live vs replay divergence threshold | TradeSys | SPEC-T-LIVE-MONITOR-* (TBD) | candidate default v1 |
| Edge decay rolling-WR threshold | TradeSys | SPEC-T-LIVE-MONITOR-* (TBD) | candidate default v1 |
| Drawdown floor (safety net) | TradeSys | SPEC-T-RISK-LIMITS-* (TBD) | validated v1 |
| Position size max (safety net) | TradeSys | SPEC-T-RISK-LIMITS-* (TBD) | validated v1 |

Owner-kolumnen är konstitutionellt krav. Exakta värden ägs av source spec.

---

## KLUSTER A — TRUTH

### Princip 1: Single Canonical Source of Truth `[ACTIVE-MANUAL]`

Statement: För varje subsystem och varje kritisk entitet finns exakt en auktoritativ runtime-sanning. Frontend, cache, JSON-filer, git snapshots, localStorage, browser state och derived views får aldrig fungera som konkurrerande sanningar.

Canonical owners per entitet (**current examples, not exhaustive canonical registry** — nya entiteter måste explicit deklarera canonical owner i sin spec):

- Signals: signal_evaluations (Supabase) | Anti: Browser-computed P(win)
- Alerts: alert_events (Supabase) | Anti: live_cache ephemeral state
- Trades: agent_trades_v2 (Supabase) | Anti: Git commit history alone
- Regimes: regime_snapshots (Supabase) | Anti: git REGIME.json dual-read
- Model versions: model_versions (Supabase) | Anti: Filnamn i data/
- Replay runs: replay_runs + replay_trades | Anti: CSV-export alone
- Experiment results: experiments table | Anti: Free text i notes
- Agent decisions: agent_trades_v2.model_lineage | Anti: stdout-logg
- Exits: dynamic_exit_shadow_decisions | Anti: Browser-computed P(drop)
- Memories (Engrams): memories table | Anti: Lokala anteckningar

Rationale: Konkurrerande sanningar driftar oundvikligen. När browser-P(win) divergerar från backend-P(win) har vi ingen formell sanning — och inget agentbeslut kan auditeras.

Enforcement: Frontend som beräknar canonical state är P0-bugg. Spec som introducerar ny entitet måste deklarera canonical owner. Drift mellan canonical och derived view → automatic alert (`FUTURE-AUTOMATED`).

Exceptions: Cache och derived views OK om explicit deklarerade som sekundära. Git snapshots OK som backup/fallback men aldrig primär. LLM-output får cachas i minne under session men inte persisteras som sanning utan validering.

---

## KLUSTER B — EVIDENCE

### Princip 2: Empirical Evidence Required for Edge Claims `[ACTIVE-MANUAL]`

Statement: Påståenden om edge, signal-kvalitet eller modellförbättring kräver empirisk evidens. Anekdotisk evidens, intuition eller "ser bra ut i backtesten" räknas inte.

Edge claims kräver predeclared evidence thresholds. Exakta värden ägs av projekt-spec, inte konstitution. Se threshold ownership cross-reference ovan.

Kravkategorier som projekt-spec måste owna:

- Edge-claim per signal: minimum replay-trades + statistical significance threshold + baseline comparison
- Modell vs modell: replay-gate kriterier per regime
- Feature drar conviction: stratification trades per bucket
- Threshold optimal: sensitivity-analys metod + stabilitetskrav
- Live matchar replay: minimum live-trades + divergens-threshold
- Edge decay detection: rolling-window storlek + WR-drop threshold

Per threshold som projekt-spec definierar krävs:
- `Status: candidate default v1` eller `validated v1`
- `Source / rationale`
- `Owner`
- `Last reviewed`

Rationale: Utan threshold för "vad räknas som bevis" kan varje agent påstå vad som helst. Versionerade, owned, evidenced trösklar gör claims auditbara. Konstitutionen säger ATT trösklar krävs; projekt-specs säger VILKA värden.

Enforcement: Spec som föreslår ny edge/signal/threshold måste cite:a evidens. "Tror jag"/"ser ut som"/"borde fungera" är inte evidens. Agent som påstår edge utan stöd → CA flaggar som drift-pattern.

Exceptions: Säkerhets-mekanismer (drawdown floors, position limits, kill switches) kräver inte edge-bevis — risk management. Research-experiment får producera hypoteser utan bevis; men hypotes ≠ deployment.

### Princip 3: Deterministic & Auditable Pipelines `[ACTIVE-MANUAL]`

Statement: För deterministiska pipelines ger samma input + samma model/version/configuration samma output. Pipelines som inte kan vara deterministiska (LLM, externa API:er, marknadsdata) måste explicit deklarera det och persistera input + output.

Per pipeline-typ:
- Replay/backtest: Fullt deterministisk | Input data hash + config + git SHA + output
- Model training: Deterministisk givet seed | training_data hash + hyperparams + weights hash
- Signal evaluation: Deterministisk per model_version | Input features + model_version_id + output
- LLM agent-analys: EJ deterministisk | Persistera input prompt + output + model_id + timestamp
- External API call: EJ deterministisk | Persistera request + response + timestamp

Rationale: Deterministiska pipelines kan reproduceras → kan auditeras → kan debuggas. LLM/API-anrop är icke-deterministiska men måste loggas så att vi kan rekonstruera vad agenten såg.

Enforcement: Replay/backtest som inte är reproducerbar är P0-bugg. LLM-anrop utan input/output-persistens är observability-brott (Princip 6). Agent får inte fatta canonical state-beslut baserat på icke-loggat LLM-output.

Exceptions: True randomness (UUID, random seeds för exploration) får icke-deterministisk vara men måste persisteras. Live market data är icke-deterministisk över tid; persisteras som timestamped snapshots.

---

## KLUSTER C — VISIBILITY

### Princip 4: Observable Present State `[ACTIVE-MANUAL]`

Statement: Systemet ska alltid kunna förklara sitt nuvarande tillstånd: vad händer nu, vilken modell live, vilken data baserar beslut på, när uppdaterades data, om stale, om pipeline failat.

Konkret krav per system:
- Pipelines: runs table med status, duration, failure_reason
- Models: model_versions med status='live' query
- Data freshness: Per tabell: updated_at, is_stale, stale_after
- Active alerts: alert_events WHERE status='new'
- Agent state: agent_positions + agent_trades_v2 recent activity
- Failed operations: Strukturerad logg i monitoring_run_details

Accepted exit surfaces (per Engrams VISIBILITY-CONTRACT-RUNTIME):
- Site row/card/table som queryar canonical SSOT
- AI-client rendered output som faithfully reflekterar SSOT
- Båda parallellt — INTE hierarki

Rationale: Osynlig runtime-logik är inte acceptabel. Om Gustav inte kan svara på "vad gör systemet just nu?" inom 30 sekunder genom att titta på dashboard/API — observability fail.

Enforcement: Ny komponent som inte exponerar status/freshness blockerad. Frontend-paneler måste ha freshness-badge med källa + ålder. Cron-jobb utan persistens till runs är observability-brott.

Exceptions: Inga. Observability är non-negotiable.

### Princip 5: Reconstructable Historical State `[ACTIVE-MANUAL]`

Statement: För varje canonical artefakt ska vi kunna rekonstruera: model version, feature set, replay run/experiment, regime, data källa, git SHA, config version.

Per artefakt-typ:
- Trade (live): model_version_id FK + features_snapshot + git_sha + config_version
- Signal: model_version_id FK + features JSONB + regime
- Replay trade: replay_run_id FK + model versions + git_sha
- Alert: rule_id FK + trigger_value + regime + related_catalysts
- Memory (Engrams): session_id + project + type + timestamp

Rule: **Null lineage is better than false lineage.** Om en artefakt inte har dokumenterad lineage, ange null/unknown — fabricera aldrig retrospektiv lineage för att passera checklist. Falsk lineage är värre än erkänd lineage-saknad eftersom det förgiftar downstream audit-spår.

Rationale: Utan lineage kan vi inte svara "varför slog v17 v16?" eller "vilken feature driver edge?" Utan svar på den frågan kan vi inte förbättra systemet.

Enforcement: Trade utan model_version_id FK är P0-bug. Signal utan features_snapshot är P0-bug. Replay-run utan git SHA + config_hash är P0-bug. Fabricerad lineage är drift-pattern.

Exceptions: Pre-existing rows från före lineage-arkitektur är OK retroaktivt med null. Backfill av historisk lineage är inte krävd.

### Princip 6: Event & Signal Persistence `[ACTIVE-MANUAL]`

Statement: Alla beslutsrelevanta signaler, alerts, decisions, trades OCH alla agent-producerade review-artefakter (specer, audits, reviews, post-mortems) persisteras strukturerat med status-taxonomi och är historiskt sökbara.

Per typ:
- Signal evaluations: signal_evaluations (Princip 1 canonical owner)
- Alerts: alert_events med lifecycle (new/acknowledged/dismissed/acted_on)
- Trades: agent_trades_v2 med full lineage
- Rejection decisions: signal_candidates_v2 (LOG_SIGNAL_CANDIDATES=true)
- Configuration changes: git commit + audit log
- Self-correction events: strukturerad logg (`FUTURE-AUTOMATED`)
- Specs, reviews, audits, post-mortems: Engrams Level-2 body (fulltext) + disk (markdown). Se S.5. **Status enligt Governance Metadata-taxonomin obligatorisk.**

Status separation rule: Persistens betyder inte authority. Drafts, rejected reviews, superseded audits och approved specs persisteras alla — men endast `approved` (och i vissa fall `reviewed` med tydlig kontext) räknas som canonical runtime-sanning.

Rationale: "Varför köpte inte systemet NVDA igår?" måste vara svarbart. Samma logik för review-artefakter: "Vad sa CC-tdy:s audit?" måste kunna besvaras med exakt original-text, inte med en sammanfattning från minnet. OCH status måste vara entydig — annars blir all persistens implicit canonical.

Enforcement: LOG_SIGNAL_CANDIDATES=true default (P0). Self-correction → audit-tabell (`FUTURE-AUTOMATED`). stdout-only otillräckligt. Specs/reviews/audits → fulltext per S.5, inga sammanfattningar. Spec utan status-fält → CA flaggar som NEEDS-REVISION.

Exceptions: UI-state (vilken tab är aktiv) får vara ephemeral. Tillfälliga beräkningar i scripts som producerar persistent output är OK.

---

## KLUSTER D — DISCIPLINE

### Princip 7: Research ≠ Runtime `[ACTIVE-MANUAL]`

Statement: Research, experimentation och replay får aldrig implicit modifiera live runtime-state. Experiment isolerade tills explicit promotade.

General rule: **Research får skriva endast till research-owned tabeller.** Listan nedan är exempel — generell regeln gäller för alla nya entiteter:

Konkret separation:
- Research: producera nya modeller/features/thresholds (tillåtet); direct deployment (förbjudet)
- Replay/backtest: replay_runs/replay_trades (tillåtet); agent_trades_v2/model_versions status='live' (förbjudet)
- Validation: replay-gate, holdout test (tillåtet); self-promotion av modell (förbjudet)
- Deployment: explicit gate PASS + Gustav-godkännande (tillåtet); implicit promotion (förbjudet)

Rationale: Utan separation kan ett experiment som "ser bra ut" smita in i live utan validering.

Enforcement: Model deployment kräver replay-gate PASS i CI. model_versions.status='live' bara efter explicit Gustav-approval. Research-skript får inte ha skriv-access till runtime-owned tabeller. Nya entiteter måste deklarera om de är research-owned eller runtime-owned i sin canonical owner-deklaration.

Exceptions: Shadow mode: research-output får testas live i shadow utan execution.

### Princip 8: Signal-Driven Runtime `[ACTIVE-MANUAL]`

Statement: Live-beslut styrs av signal-state och evidens. Värden som styr decision logic är acceptabla endast om de är **declared in versioned config/model metadata**, inte **hardcoded in code**. Safety nets (drawdown floors, position limits, kill switches) är undantaget — där är hårdkodning explicit önskvärt för svår-överridbarhet.

Distinction:
- `hardcoded in code`: värde inbäddat i Python/JS/SQL utan version-referens — **förbjudet** för decision logic
- `declared in versioned config/model metadata`: värde i config-fil under version control, eller i model_versions DB-tabell — **tillåtet** för validerade decision-thresholds

Decision-typ klassificering:
- Entry/hold/exit logic: NEJ hardcoded — signal-driven (EMA20 dip, exit på conviction decay)
- Safety nets: JA hardcoded (Drawdown floor, max position size — explicit safety nets)
- Capital limits: declared in versioned config (Max exposure per sector, max open positions)
- Threshold values: declared in versioned config/model metadata, empiriskt validerade
- Time-based exits: NEJ i live, JA i replay (Fixed hold = research parameter)

Rationale: Hardcoded-i-code är opacitet förklädd till simplicity. Empiriskt validerade thresholds som ligger i versioned config eller model metadata har audit trail — de är decisions, inte konstanter.

Enforcement: Spec med magic number kräver evidens-citation (Princip 2) OCH config-storage-deklaration. Time-based exits i live kräver explicit motivering eller är förbjudna. Safety nets ska deklareras som safety nets i spec/kommentar.

Exceptions: Kill switches ska vara hardcoded och svåra att överrida. Constants utan business semantics (pi, error codes, kolumnnamn) är inte decision logic.

### Princip 9: Simplicity Test Before Complexity `[ACTIVE-MANUAL]`

Statement: Ny komplexitet kräver: (1) mätbar metric-förbättring, (2) revertplan, (3) namngivet enklare alternativ explicit testat och misslyckat.

"Cool quant architecture" är inte ett mål. Långsiktig systemintegritet är.

Komplexitets-test:
- Vad är specifika metric förbättringen? "WR +Xpp" eller "latency -Xs"
- Vad är den enklare lösningen? Måste vara namngiven
- Varför fungerar inte den enklare? Empiriskt visat eller motiverat
- Hur reverterar vi om sämre? Konkret rollback-plan
- Vad kostar underhåll på 6 månaders sikt? Estimat krävs

Enforcement: Spec med nytt subsystem måste ha "Simplicity Test"-sektion. CA-EXHAUSTIVE-ENUMERATION är känd drift-pattern. Composite confidence-formler, meta-models, multi-layer cache är default suspekta.

Exceptions: **Foundation work** (canonical state, observability, persistence layer) får vara komplex — fundament. MEN foundation-undantaget kräver att specen explicit namnger det enklare alternativ som inte kan stödja det canonical-contract som motiverar foundation-arbetet. Utan namngivet, varför-otillräckligt alternativ får ingen self-label som foundation. Refactoring som minskar komplexitet behöver inte motiveras.

### Princip 10: Human-Aware Confidence `[ACTIVE-MANUAL]`

Statement: Systemet är explicit med när det vet och när det inte vet. Får inte ge falsk precision. Confidence kommuniceras med uncertainty bands eller kategoriska nivåer (HIGH/MEDIUM/LOW/UNKNOWN).

Per output-typ:
- P(win) score: Med regime-confidence och analog-confidence som kontext
- Recommendation: Med confidence-level + driving factors
- Modell-prediction: Med model_version + OOS WR för regime
- Alert severity: Inte bara "HIGH" — också uncertainty + recommended action
- Agent rejection: Med rejection reason + threshold-context

Exempel: "P(win) = 0.65" utan kontext är falsk precision. "P(win) = 0.65, regime=BULL där modellen har 49% OOS WR" är ärlig kommunikation.

Heuristisk-flaggning triggers:

| Trigger-typ | Krav |
|------------|------|
| Claims som påverkar decisions, arkitektur, persistens, authority, deployment | **REQUIRED** att flagga heuristik explicit |
| Exploratory analysis, research-hypoteser | **RECOMMENDED** att flagga |
| Ordinary conversational framing utan downstream-impact | **NOT REQUIRED** |

Formuleringar vid heuristisk-flaggning: "heuristisk bedömning", "första gissning, ej verifierad", "not ground-truth verified", eller motsvarande. Använd "Ej empiriskt verifierat per Princip 2" ENDAST när claim faktiskt rör edge/model performance — annars använd generella formuleringar.

Enforcement: UI som visar P(win) utan regime-confidence blockerad. Recommendations utan reasoning blockerade. Agent som claimar "stark signal" utan kvantifiering flaggas. Heuristik-flaggning saknas på decision-relevant claim → CA flaggar drift. Se HEURISTIC-CATALOG-V1.md för katalog av kända heuristiker och drift-patterns.

Exceptions: Inga. Falsk precision är inte designval.

### Princip 11: Architecture Before Velocity `[ACTIVE-MANUAL]`

Statement: Spec-godkännande krävs innan implementation av komponenter som rör: canonical state, model layer, agent decision authority, schema-ändringar, cross-project arkitektur.

Spec krävs INTE för: frontend tweaks, bug fixes utan canonical state-påverkan, refactor som inte ändrar contracts, lokala script som inte deployar, **ordinary context/episode memories som inte skapar canonical rules eller runtime contracts**.

Spec krävs JA för Engrams memories som: pinned type:instruction (skapar canonical rule), spec-marker som påverkar runtime, eller memory som överskuggar tidigare canonical behavior.

Rationale: Architecture-ändringar utan spec ackumulerar teknisk skuld. Frontend-polish utan spec är effektivt. Engrams pinned instructions är arkitektur (cross-session canonical behavior), context/episode-memories är inte.

Enforcement: Komponent som rör canonical state utan spec → P0 stop. CC-agent som börjar implementera utan godkänd spec → CA flaggar. Spec-godkännande loggas i Engrams med marker SPEC-APPROVED-{spec-id}. Pinned instruction utan spec → CA flaggar drift.

Exceptions: Gustav kan explicit beordra implementation utan spec; loggas som override.

### Princip 12: Agent Authority Boundaries `[ACTIVE-MANUAL]`

Statement: Varje agent har explicit authority level. Authority eskaleras aldrig implicit. Cross-agent kommunikation persisteras genom Engrams (handoffs, tasks, memories). Paste/URL kan transportera content men är inte canonical förrän persisterat till specificerad Engrams-locus.

Authority axis 1 — **Decision authority** (vad agenten får besluta):
- Advisory: producera analyser/rekommendationer (tillåtet); direct deployment, irreversibla ops (förbjudet)
- Autonomous: får utföra beslut inom scope utan per-action approval (kombineras med axis 2 nedan)

Authority axis 2 — **Operational scope** (var agenten får agera):
- Implementation-paper: får implementera kod i repo + paper-mode runtime — INTE live decisions
- Trading-paper: får producera paper trades, shadow decisions — INTE live execution
- Shadow: får logga utan exekvering — INTE påverka live state
- Live: får exekvera live inom limits — INTE override safety nets eller expand scope

Per agent (current state):
- CA (Claude.ai): Advisory — Spec design, strategi, convergence review
- CC-eng: Autonomous-Implementation-paper inom Engrams repo — implementation efter godkänd spec, paper-mode deploys
- CC-tdy: Autonomous-Implementation-paper inom TradeSys repo — implementation efter godkänd spec, paper-mode deploys
- Codex: Advisory — Research, verification, convergence review
- ChatGPT: Advisory — Market positioning
- Shadowbot-v2: Autonomous-Trading-paper — Paper trading per config

Cross-agent protocol: handoffs via queue_handoff(), tasks med owner-tag, memories i Engrams med korrekt locus. Direct paste från Gustav räknas som transport (innehållet finns) men måste persisteras till specificerad Engrams-locus för att räknas som canonical cross-agent input.

Override-protokoll: Gustav kan eskalera authority för specifik uppgift. Eskalering loggas som AUTHORITY-OVERRIDE-{date}-{agent}. Gäller bara den uppgiften.

Enforcement: Agent utanför sin authority → CA/Gustav flaggar. Cross-agent claims utan Engrams-persistens räknas inte som canonical. Ground-truth verification krävs på all agent-output.

Exceptions: Akuta situationer (bug i live trading) kan kräva immediate action; logga retroaktivt.

### Princip 13: Runtime-State Trustworthiness `[ACTIVE-MANUAL]` (NY i v1.3)

Statement: All runtime-state — alla signaler, modeller, pipelines och visualiseringar i live drift — måste bygga på alla fyra invariants samtidigt:

1. **Canonical source of truth** — entiteten har en uttalad canonical owner per Princip 1
2. **Single source of truth (SSOT)** — exakt en plats är auktoritativ, derived views är explicit deklarerade
3. **Deterministisk och reproducerbar pipeline** — per Princip 3, eller explicit deklarerad icke-deterministisk med input/output-persistens
4. **Empirisk och verifierbar grund** — per Princip 2 för edge-claims, observerbar för operationella claims (Princip 4)

Princip 13 är meta-invarianten som binder ihop Princip 1, 2, 3, 4. Den existerar som egen princip eftersom enskilda invariants kan vara uppfyllda var för sig medan helheten ändå är otrustad.

Om någon komponent inte uppfyller alla fyra:

- **Flagga den explicit** som non-canonical, non-deterministic eller non-empirical i sin spec/code/dashboard
- **Identifiera orsak** — var bryts invarianten, vilken är den missande pelaren
- **Beskriv riskerna** — vilka downstream-claims är inte längre fully trustworthy
- **Föreslå migration-path** — hur tar vi komponenten till canonical+SSOT+deterministisk+empirisk

Anti-pattern: anta att implementation är korrekt bara för att den fungerar tekniskt. Teknisk funktion ≠ trustworthy runtime-state.

Mål:
- Trustworthy runtime-state
- Reproducerbara outputs
- Verifierbar signal/logik
- Full observability (Princip 4)
- Full traceability (Princip 5)
- Evidensbaserad modell- och signalutveckling (Princip 2)

Rationale: Princip 1-12 specificerar krav per dimension. Praktisk drift har visat att komponenter kan claim:a compliance på enskilda principer medan helheten bryter trustworthiness. Exempel: signal som är canonical-owned (P1 ✓) men beräknas via non-deterministic LLM-anrop utan persistens (P3 ✗) — varje enskild claim ser OK ut men runtime-state är inte rekonstruerbar. Princip 13 gör det till en explicit cross-cutting check istället för implicit antagande.

Enforcement: Spec som introducerar runtime-state-komponent måste ha "Princip 13 Compliance" sektion som adresserar alla fyra invariants. Komponent som inte uppfyller alla fyra och inte är explicit flaggad → CA flaggar som NEEDS-REVISION. "Det fungerar tekniskt" är inte tillräckligt svar.

Exceptions: Foundation work under uppbyggnad får tillfälligt vara non-compliant om explicit flaggad med migration-path till compliance. Research-mode pipelines (per Princip 7) är undantagna men måste fortsatt vara explicit isolerade från runtime.

Relation till andra principer: Princip 13 är meta över Princip 1 (canonical), Princip 2 (empirisk), Princip 3 (deterministisk), Princip 4 (observable). Den introducerar inga nya krav — den kräver att alla fyra existerande krav uppfylls samtidigt och att brott flaggas explicit istället för tystas.

---

## SUPPORTING REQUIREMENTS

### S.1 — Ground-Truth Verification `[ACTIVE-TEMPLATE]`

Agent-claims om producerade artefakter verifieras mot faktisk repo/DB-state innan klart.

Check-list:
- Git commit lokalt: git log visar commit
- Git commit remote: **git ls-remote eller motsvarande visar att commit är pushad till specified remote branch** (local commit ensam bevisar inte push)
- Supabase row: SELECT count(*) returnerar förväntat
- Engrams memory: get_by_marker() returnerar memory med rätt project
- File creation: view på path returnerar förväntat content
- API endpoint: curl returnerar förväntat response

Documented incidents:
- 2026-05-15: CC-tdy RVOL-bug — fil commitad lokalt, inte pushad
- 2026-05-18: CC-tdy 7 docs — docs på lokal branch, inte main
- 2026-05-20: Codex review submit_review failade — saved via remember() men disk-fil pushades inte initialt; lokal vs remote diskrepans
- 2026-05-22: CA pushade partial v1.3 till styr-ai under token pressure (commits 0a19121 + 2120c529); local commits ≠ canonical v1.3

Enforcement: Pre-handoff-review checklist per agent. Remote-branch-verification är inte optional — local commit utan push räknas som "in progress", inte "delivered".

### S.2 — Reversibility by Default `[ACTIVE-MANUAL]`

Alla deployments, schema-ändringar, config-uppdateringar reversibla inom 24h. Irreversibla ops kräver explicit Gustav-godkännande och rollback-plan i samma PR.

Irreversibla (kräver explicit approval): DROP TABLE, TRUNCATE, DELETE utan backup; model overwrite utan version preservation; git force-push till main; production data migration utan rollback path.

Reversibla (default-OK efter spec): Schema additive changes; new table creation; new cron job activation; feature flag toggle.

High-risk migrations: **Rollback ska antingen vara testad eller åtminstone explicit dry-run-described** i PR-body. Dry-run-description krävs minimum: vilka steg, vilken state återställs till, vilken verifiering bekräftar rollback success.

Enforcement: PR-review kräver "Reversibility:" sektion för canonical-state-changes.

### S.3 — Replay-to-Live Integrity `[ACTIVE-MANUAL]`

Replay/backtest jämförs kontinuerligt mot live/paper för att upptäcka edge decay, overfitting, regime drift, replay/live divergence.

Krav-kategorier som projekt-spec måste owna (per threshold ownership cross-reference):

- Live vs replay baseline drift: minimum trades + WR-delta threshold → automatic alert
- Replay-vs-live overfitting indicator: WR-delta threshold åt andra hållet → flagga
- Regime classifier divergens: divergens-threshold → audit krävs

Owner: TradeSys (SPEC-T-LIVE-MONITOR-* eller motsvarande). Status: candidate default v1 tills validerade mot live history.

Enforcement: Del av P2 alert-system (separat spec). `FUTURE-AUTOMATED` tills automatic-alert-pipeline byggd.

### S.4 — Failure Analysis Mandatory `[ACTIVE-MANUAL]`

Misslyckade trades/modeller/signaler analyseras lika rigoröst som framgångsrika.

Scope: gäller live trades, paper trades, och shadow decisions. Specificeras per trade-typ i projekt-spec.

Krav-kategorier som projekt-spec måste owna:

- Förlorande trade: loss-threshold + post-mortem-cadence
- Edge decay: rolling-window + WR-drop-threshold + pause-or-retrain-cadence
- False positive alert (HIGH-severity): review-cadence
- Modell som failar replay-gate: root cause analysis innan retry

Owner: TradeSys. Status: candidate default v1 tills validerade.

Enforcement: Stale failure-analyses flaggas i CA boot diagnostics.

### S.5 — Fulltext Artefakt Persistens `[ACTIVE-MANUAL]`

Varje agent måste spara specer, reviews, audits, post-mortems och andra review-artefakter i sin helhet, ord för ord, i Engrams (Level-2 body) OCH på disk (markdown). Sammanfattningar i content-fältet OK för sökbarhet, men fulltext MÅSTE finnas i body-fältet (Level-2 storage). Agent får aldrig spara endast sammanfattning av review-artefakt.

**Divergence precedence rule:** Disk markdown OCH Engrams body MÅSTE vara byte-equivalent för canonical review-artefakter. Vid divergens:
- Default: divergens är drift, ska resolveas omedelbart till byte-equivalence
- Om explicit supersede-marker finns och nyare timestamp: nyare wins, äldre supersededas via marker-policy
- Utan explicit supersede: agent får inte tyst välja en source — diskrepansen flaggas, Gustav avgör

Documented incidents:
- 2026-05-19: Agent sparade backtest-audit korrekt som Level-2 artifact, men sparade "Agents" och "Models" audits endast som sammanfattningar. Original-resonemanget förlorades tills agenten själv upptäckte misstaget.
- 2026-05-22: CA pushade partial v1.3 (~17KB) till styr-ai disk medan Engrams behöll v1.2 (28KB) — divergens utan supersede, regression-state. Resulterade i denna v1.3.

Per artefakt-typ:
- SPEC-T/E/S-*: Full text → docs/SPEC-*.md, type:context eller spec
- CA convergence review: Full text → docs/CA-*-REVIEW-*.md, type:context
- Audit: Full text → docs/AUDIT-*.md, type:context
- Post-mortem: Full text → docs/POSTMORTEM-*.md, type:learning
- Convergence review: Full text → docs/*-REVIEW-*.md, type:context
- Session episode: Full text → type:episode

Krav per spar-operation:
1. Engrams body-fält: Full ord-för-ord original text. Om 30KB ska body vara 30KB.
2. Engrams content-fält: Kort sammanfattning (1-3 meningar) som pekar till body.
3. Engrams marker-fält: Konsistent, sökbart, unikt.
4. Disk: Markdown-fil i relevant repo.
5. Byte-equivalence verifiering: bekräfta att body och disk är identiska för canonical artefakter.
6. Verifiering: bekräfta get_by_marker() returnerar full body.

Enforcement: Agent som sparar review-artefakt endast som sammanfattning → drift-pattern, CA flaggar. Memory med type:context/learning och body < 50% av disk-fil → automatic flag (`FUTURE-AUTOMATED`). Pre-handoff-review måste inkludera "fulltext sparad i body + byte-equivalent på disk". Agent får inte radera disk-fil efter Engrams-save.

Exceptions: Specer >1MB delas i PART1/PART2/PART3 med separata markers. Tillfälliga utkast får vara content-only om explicit markerade som draft.

Related to: SPEC-E-FULLTEXT-PERSISTENCE-RULE-001 (denna S.5 promotar till cross-project), Princip 6, S.1.

### S.6 — Output Locus Contract `[ACTIVE-TEMPLATE]`

Statement: När agent A producerar en spec, audit eller review som ska reviewas eller utökas av flera andra agenter (multi-agent review), MÅSTE agent A specificera output-locus för all efterföljande feedback. Output-locus består av: target marker, target type, target project, och target disk path. Övriga agenter MÅSTE sedan spara sin feedback på den specificerade platsen, inte var de själva väljer. För 1-1-flöden (en agent reviewar en spec) är detta krav undantaget men rekommenderas fortfarande.

Rationale: Utan output-locus contract sprider sig feedback över Engrams-markers, disk-filer och chat-meddelanden. För att bygga komplett bild av en review-cykel måste man manuellt leta. Med contract: allt feedback om SPEC-X finns under marker-pattern *-REVIEW-X eller *-FEEDBACK-X med konsistent type och project. En query räcker. Cross-agent discoverability ökar.

Conflict resolution rules:

1. **Spec Output Locus-tabell vs Engrams task output_contract:** Om de skiljer sig — `task output_contract wins` för den specifika tasken, MEN diskrepansen MÅSTE flaggas explicit av reviewer och spec-författare måste uppdatera spec eller task för att resolvea.

2. **Multipla review-ronder per reviewer:** Default är att review-ronder superseder via samma marker. Om båda ronder ska bevaras explicit, använd round-suffix `R2`/`R3` (t.ex. `CODEX-REVIEW-{spec-id}-R2`) eller timestamp-suffix per MARKER-TIMESTAMP-KONVENTION.

3. **Disk-commit vs local-only:** För PR-governance MÅSTE review-artefakter committas till relevant repo-branch — inte bara local workspace eller untracked. Local-only acceptabelt endast om explicit markerat som draft i Engrams content-fält och inte refererat från PR-body. Commit-pushen ska följa S.1 remote-branch-verification.

Documented incident: 2026-05-20 — Codex submit_review failade pga saknat output_contract på task; review sparades via remember() men disk-fil committades inte initialt. Locus-discrepancy mellan ad-hoc save och task-spec.

När gäller S.6:
- Spec ska reviewas av ≥2 agenter: OBLIGATORISKT — Output Locus-tabell i spec + create_task() med output_contract per reviewer
- Spec ska reviewas av 1 agent: Rekommenderat men inte obligatoriskt
- Spec internt utkast utan formell review: Inte tillämpligt
- Audit/post-mortem som inte ska reviewas: Inte tillämpligt

Marker-konvention per agent:
- Codex: CODEX-REVIEW-{spec-id} / CODEX-FEEDBACK-{spec-id}
- CC-eng: CC-ENG-REVIEW-{spec-id} / CC-ENG-FEEDBACK-{spec-id}
- CC-tdy: CC-TDY-REVIEW-{spec-id} / CC-TDY-FEEDBACK-{spec-id}
- CA: CA-REVIEW-{spec-id} eller CA-CONVERGENCE-REVIEW-{spec-id} / CA-FEEDBACK-{spec-id}
- ChatGPT: CHATGPT-FEEDBACK-{spec-id} (sparas av CA på CHATGPTs vägnar)
- Gustav: GUSTAV-DECISION-{spec-id} eller GUSTAV-FEEDBACK-{spec-id}

Format som spec-författare måste inkludera (multi-agent review):
```
## Feedback & Review Output Locus

Alla reviewers ska spara sin feedback enligt följande:

| Agent | Output marker | Type | Project | Disk path |
|-------|--------------|------|---------|-----------|
| Codex | CODEX-REVIEW-{spec-id} | context | styr-ai | docs/CODEX-REVIEW-{spec-id}.md |
| CC-eng | CC-ENG-REVIEW-{spec-id} | context | styr-ai | docs/CC-ENG-REVIEW-{spec-id}.md |
| CC-tdy | CC-TDY-REVIEW-{spec-id} | context | tradesys | docs/CC-TDY-REVIEW-{spec-id}.md |
| ChatGPT | CHATGPT-FEEDBACK-{spec-id} | context | styr-ai | (paste till CA, CA sparar) |

Spec-författaren ska skapa create_task() per reviewer med output_contract
som matchar tabellen ovan.
```

Discoverability efter S.6:
- "Alla reviews av SPEC-X": recall("REVIEW-X") eller recall("FEEDBACK-X") returnerar alla reviewers
- "Codex feedback på senaste spec": get_by_marker("CODEX-REVIEW-{latest-spec-id}") deterministisk lookup
- "Vad har lämnats för feedback idag?": recent_chats eller Engrams check_freshness med marker-filter

Enforcement: Spec som ska reviewas av ≥2 agenter utan Output Locus-tabell → CA flaggar som NEEDS-REVISION. create_task() för review utan output_contract (när multi-agent flow) → CA flaggar. Reviewer som sparar på annan plats än specat → CA flaggar drift, retroaktiv supersede till korrekt marker. Output_contract i Engrams create_task() är canonical enforcement-mekanism.

Exceptions: 1-1-flöden (en spec, en reviewer): Output Locus rekommenderas men inte obligatoriskt. Ad-hoc feedback från Gustav i chat: kan sparas av CA till Gustav-prefixad marker retroaktivt. Akuta produktionsincidenter: agent får producera output snabbt, locus kan retroaktivt etableras.

Related to: Princip 12 (Agent Authority Boundaries), S.5 (Fulltext Artefact Persistence), Engrams create_task() output_contract-parameter.

---

## ENFORCEMENT ARCHITECTURE

Skikt 1: Canonical artefakt
- Engrams pinned type:instruction marker=CORE-PRINCIPLES-V1 project=styr-ai (canonical body, Level-2)
- 3 GitHub repos (styr-ai, engrams, tradesys1337) disk-fil docs/CORE-PRINCIPLES-V1.md
- Byte-equivalence krav per S.5 divergence precedence rule

**Multi-repo sync verification checklist** (post-merge eller post-push):

1. Samma version string i alla 3 repos (`grep "^**Version:**"` matchar)
2. Samma content hash (eller explicit allowed repo-local delta, t.ex. PR-body skillnader)
3. Engrams marker pointer matchar version (get_by_marker returnerar samma version)
4. PR body uppdaterad till aktuell version
5. CLAUDE.md i engrams + tradesys repos refererar aktuell version

Sync verification är `ACTIVE-MANUAL` idag — `FUTURE-AUTOMATED` när CI-check byggd.

Skikt 2: Boot-time injection per agent:
- CA: engrams boot läser CORE-PRINCIPLES-V1 från instructions automatically (`ACTIVE-BOOT`)
- CC-eng: CLAUDE.md i engrams repo refererar docs/CORE-PRINCIPLES-V1.md + Engrams read (`ACTIVE-BOOT`)
- CC-tdy: CLAUDE.md i tradesys1337 repo refererar docs/CORE-PRINCIPLES-V1.md + Engrams read (`ACTIVE-BOOT`)
- Codex: **Codex sessions must load CORE-PRINCIPLES-V1 during boot via Engrams/repo context.** Actionable verification: confirm in session-start that boot output includes CORE-PRINCIPLES-V1 marker. (`ACTIVE-MANUAL`)
- ChatGPT: Inkluderas i custom instructions där tillämpligt; samma verification-krav som Codex (`ACTIVE-MANUAL`)

Skikt 3: Spec-Template Gate — Alla nya SPEC-T-* / SPEC-E-* / SPEC-S-*-specer måste ha "## Principle Compliance" sektion. Spec utan denna sektion → CA flaggar som NEEDS-REVISION. (`ACTIVE-TEMPLATE`)

Skikt 4: Automated Checks (`FUTURE-AUTOMATED`) — hardcoded baseline detection, frontend canonical-state-computation detection, schema-change-utan-spec detection, multi-repo sync verification CI.

---

## OVERRIDE PROTOCOL

Gustav kan overrida vilken princip som helst för specifik uppgift:
- Override måste vara explicit i chat ("override princip X för denna uppgift")
- Override loggas i Engrams som PRINCIPLE-OVERRIDE-{date}-{principle}-{rationale}
- Override gäller bara den explicit angivna uppgiften, inte permanent
- Repeterande override av samma princip = signal att principen behöver revidering

Princip-revision sker när: repeterande override av samma princip, en princip visar sig oimplementerbar, eller quarterly review identifierar problem.

Process: CA producerar SPEC-S-CORE-PRINCIPLES-V{N+1} draft → Codex convergence review → Gustav-godkännande → bumpa version → uppdatera alla 4 lagringsplatser → Engrams: supersede V1 → V2.

---

## SUMMARY TABLE

13 principer (alla Active):
- TRUTH: 1 (Single Canonical Source of Truth)
- EVIDENCE: 2 (Empirical Evidence), 3 (Deterministic Pipelines)
- VISIBILITY: 4 (Observable Present), 5 (Reconstructable History), 6 (Event Persistence)
- DISCIPLINE: 7 (Research≠Runtime), 8 (Signal-Driven), 9 (Simplicity), 10 (Human-Aware Confidence), 11 (Architecture Before Velocity), 12 (Agent Authority), 13 (Runtime-State Trustworthiness)

6 Supporting Requirements:
- S.1 Ground-Truth Verification
- S.2 Reversibility by Default
- S.3 Replay-to-Live Integrity
- S.4 Failure Analysis Mandatory
- S.5 Fulltext Artefakt Persistens
- S.6 Output Locus Contract

Governance Metadata-axlar:
- Artifact Status Taxonomy (draft/review_requested/reviewed/approved/superseded/rejected)
- Enforcement Status Labels (ACTIVE-MANUAL/ACTIVE-BOOT/ACTIVE-TEMPLATE/FUTURE-AUTOMATED)
- Threshold Status Labels (candidate default v1/validated v1/superseded)
- Threshold Ownership Cross-Reference table

---

## VERSION HISTORY

- v1.0-draft (2026-05-19 morgon): initial 12 principles + S.1-S.4
- v1.1-draft (2026-05-19 eftermiddag): added S.5 Fulltext Artefact Persistence + extended Princip 6
- v1.2-draft (2026-05-19 sen eftermiddag): added S.6 Output Locus Contract + heuristic flagging in Princip 10 + HEURISTIC-CATALOG-V1.md companion doc reference
- v1.3-draft (2026-05-22): addresses Codex review CODEX-REVIEW-CORE-PRINCIPLES-V1 (2026-05-20) — Governance Metadata section, threshold ownership extraction, status taxonomy, enforcement labels, multi-repo sync verification, Codex/ChatGPT boot-loading wording fix, S.1 remote-branch verification, S.2 rollback dry-run, S.5 divergence precedence rule, S.6 conflict resolution rules, Princip 1 canonical owner table labeled non-exhaustive, Princip 3 deterministic-pipeline wording, Princip 5 null lineage rule, Princip 7 generell research-skriv-rule, Princip 8 hardcoded-vs-declared-in-config distinction, Princip 9 foundation work simpler-alternative requirement, Princip 10 heuristic-flagging triggers, Princip 11 ordinary-context-memory clarification, Princip 12 paste-as-transport + two authority axes. NY Princip 13 Runtime-State Trustworthiness (meta-invariant över Princip 1+2+3+4). Documented incident 2026-05-22 styr-ai partial-push regression i S.1 + S.5.

---

## REFERENCES

Source materials:
- ChatGPT proposal 2026-05-19 (15 original principles)
- CA feedback session 2026-05-19 (clustering, 4 additions, enforcement architecture)
- Gustav addition 2026-05-19 (S.5 Fulltext Artefact Persistence)
- Gustav addition 2026-05-19 (S.6 Output Locus Contract + heuristic flagging in Princip 10 + HEURISTIC-CATALOG-V1 reference)
- Codex convergence review 2026-05-20 (CODEX-REVIEW-CORE-PRINCIPLES-V1)
- Gustav addition 2026-05-22 (Princip 13 Runtime-State Trustworthiness)
- Drift-patterns observed: CA-EXHAUSTIVE-ENUMERATION, RVOL-bug 2026-05-15, 7-docs-not-pushed 2026-05-18, audit-summary-only 2026-05-19, partial-push-under-token-pressure 2026-05-22

Related specs:
- RATIONALE-FRAMEWORK-PROTOCOL-001 (supports Princip 11)
- SPEC-E-PRODUCT-VISIBILITY-CONTRACT-001 (supports Princip 1)
- SPEC-E-FULLTEXT-PERSISTENCE-RULE-001 (Engrams-intern, promoted to cross-project via S.5)
- SPEC-E-PRE-HANDOFF-CRITICAL-REVIEW-001 (supports S.1)
- HEURISTIC-CATALOG-V1.md (parallel doc, referenced by Princip 10) — v1.1 pending separate session, will add AH.10 "Agent kompromissar canonical artifact för att rädda session-flow istället för att stoppa och eskalera"

GitHub PRs (DO NOT MERGE until Gustav approval):
- Master: https://github.com/gustavkall/styr-ai/pull/1
- engrams sync: https://github.com/gustavkall/engrams/pull/11
- tradesys sync: https://github.com/gustavkall/tradesys1337/pull/5

Quarterly review scheduled: 2026-08-19.

Status: UTKAST v1.3 — awaiting Gustav approval before merge.

Author: CA (ca-2026-05-22-1430), supersedes v1.2 (2026-05-19) after Codex review (2026-05-20).
