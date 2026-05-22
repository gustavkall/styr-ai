# SPEC-S-CORE-PRINCIPLES-V1 — Core System Principles

**Spec-ID:** SPEC-S-CORE-PRINCIPLES-V1
**Project:** styr-ai (meta-governance)
**Type:** TYP 2 — TVÄRPROJEKT-PRINCIP (gäller engrams + tradesys + alla agenter)
**Version:** v1.3-draft
**Author:** CA (Claude.ai)
**Status:** UTKAST — adresserar Codex review CODEX-REVIEW-CORE-PRINCIPLES-V1, väntar Gustav-godkännande
**Created:** 2026-05-19
**Updated:** 2026-05-21 (v1.3: addresses Codex 5 findings — added Governance Metadata section, marked thresholds as candidate defaults with TradeSys ownership, S.6 conflict rules + round convention, principle modifications for 2/8/10/12, Skikt 2 boot-loading wording fix; v1.2: added S.6 Output Locus Contract + Princip 10 heuristic reference + HEURISTIC-CATALOG-V1 referens)
**Supersedes:** v1.2-draft (Codex-reviewed, not merged)
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
## GOVERNANCE METADATA (NY i v1.3)
## ═══════════════════════════════════════

Denna sektion existerar för att hindra att specen själv skapar falsk säkerhet. Codex-feedback 2026-05-20: "the document mixes constitutional rules, project-specific TradeSys thresholds, future P2 enforcement, and living CA-owned catalog updates in one authority layer. That creates a new drift vector."

Lösningen: explicita taxonomier för status, enforcement och thresholds. Allt som inte tydligt klassificeras enligt nedan riskerar att tolkas som canonical när det inte är det.

### Artifact Status Taxonomy

Per artefakt (spec, review, audit, catalog entry) anges status. Status separeras från existens — alla artefakter persisteras (S.5), men inte alla har samma auktoritet.

| Status | Innebörd | Aktion vid använding |
|--------|----------|---------------------|
| `draft` | Utkast under arbete | Får INTE användas som canonical reference |
| `review_requested` | Skickad för convergence review | Får refereras som "under review" |
| `reviewed` | Granskad, feedback dokumenterad | Får refereras som "reviewed, awaiting next step" |
| `approved` | Gustav-godkänd för canonical användning | Canonical reference, får implementeras |
| `superseded` | Ersatt av nyare version | Får INTE användas — peka till efterföljare |
| `rejected` | Avvisad efter review | Får INTE användas, behålls för audit trail |

**Format i artefakt:** `**Status:** draft` (eller motsvarande) på rad 2-10 i metadata-block.

**Engrams motsvarighet:** Status reflekteras i `content`-fältet och vid behov i marker (t.ex. `SPEC-X-DRAFT` vs `SPEC-X-APPROVED`).

### Enforcement Status Labels

Per regel anges hur den faktiskt enforces idag. Mixing aktiv enforcement med framtida P2-checks utan labelling är drift-vektor.

| Label | Innebörd | Hur enforced |
|-------|----------|--------------|
| `ACTIVE-MANUAL` | Agent förväntas följa, CA flaggar vid brott | CA review, peer-agent flagging |
| `ACTIVE-BOOT` | Inkluderas i agent boot-context | Engrams boot, CLAUDE.md, pinned instructions |
| `ACTIVE-TEMPLATE` | Inkluderas som gate i spec-template | Codex/CA spec-review checklist |
| `FUTURE-AUTOMATED` | Planerad automatisering, ej implementerad | TBD — kräver implementation spec innan användning |

**Format i regel:** `**Enforcement:** [LABEL] — beskrivning`

**Princip:** En regel som saknar enforcement label tolkas som `ACTIVE-MANUAL` by default.

### Threshold Status Labels

Per numerisk threshold anges källa och status. Detta hindrar att agenter quotar thresholds som constitutional truth när de är ovaliderade defaults.

| Label | Innebörd | Krav |
|-------|----------|------|
| `candidate default v1` | Initial threshold, ej empiriskt validerad | Owner + rationale obligatoriskt; status review-cadence |
| `validated v1` | Validerad via specific replay/empiri | Source + last reviewed obligatoriskt |
| `superseded` | Ersatt av ny threshold | Peka till efterföljare |

**Format i threshold-tabell:** Tabellen får extra kolumn `Status / Owner / Source`.

**Princip:** Core-konstitutionen äger *kravet* att thresholds ska vara explicit, evidenced, versioned, reviewed. Projekt-specer (TradeSys, Engrams) äger de faktiska numeriska värdena.

### Threshold Ownership Cross-Reference

| Threshold-kategori | Owner | Var de definitiva värdena bor |
|-------------------|-------|-------------------------------|
| TradeSys evidence floors (Princip 2) | TradeSys | SPEC-T-EVIDENCE-FLOORS-001 (TBD) eller inline i SPEC-T-* |
| TradeSys replay-live triggers (S.3) | TradeSys | SPEC-T-REPLAY-LIVE-INTEGRITY-001 (TBD) |
| TradeSys failure analysis cadence (S.4) | TradeSys | SPEC-T-FAILURE-ANALYSIS-001 (TBD) |
| Engrams body-size flag threshold (S.5) | Engrams | SPEC-E-FULLTEXT-PERSISTENCE-RULE-001 |
| Cross-project authority levels (Princip 12) | styr-ai (constitution) | Detta dokument (canonical) |

Värden som listas i denna konstitution är `candidate default v1` tills projekt-specer äger dem.

---

### Princip 1: Single Canonical Source of Truth

**Statement:**
För varje subsystem och varje kritisk entitet finns exakt en auktoritativ runtime-sanning. Frontend, cache, JSON-filer, git snapshots, localStorage, browser state och derived views får aldrig fungera som konkurrerande sanningar.

**Canonical owners per entitet (current examples, not exhaustive canonical registry):**

> **Notering:** Denna tabell är illustrativ för aktuella TradeSys/Engrams-entiteter. Att en entitet inte listas innebär INTE att den saknar canonical owner-krav. Vid introduktion av ny entitet i någon projekt-spec ska canonical owner deklareras explicit.

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

**Minimum evidence thresholds (candidate defaults v1 — owned by TradeSys spec, not constitution):**

> **Notering:** Konstitutionen äger *kravet* att edge claims ska ha predeclared evidence thresholds. De faktiska numeriska värdena nedan är `candidate default v1` och ska flyttas till SPEC-T-EVIDENCE-FLOORS-001 (TBD) eller motsvarande TradeSys-spec där de kan kalibreras mot historisk replay-data.

| Påstående | Candidate threshold | Status | Owner | Source / Rationale |
|-----------|--------------------|---------|-------|----------------------|
| "Denna signal har edge" | ≥100 replay-trades, p<0.05 vs baseline | candidate default v1 | TradeSys | Statistical convention; ej kalibrerad |
| "Modell A slår modell B" | Replay-gate PASS (>0.5pp overall, >1pp per regime) | candidate default v1 | TradeSys | Inherited från befintlig replay-gate; ej re-kalibrerad |
| "Denna feature drar conviction" | Stratification med ≥30 trades per bucket | candidate default v1 | TradeSys | Statistical floor för bucket-jämförelse |
| "Threshold X är optimal" | Sensitivity-analys ±20%, stabilt resultat | candidate default v1 | TradeSys | Konvention för stabilitetsbedömning |
| "Live performance matchar replay" | ≥30 live-trades, divergens <5pp | candidate default v1 | TradeSys | 30 är CLT-floor; 5pp ej empiriskt grundat |
| "Edge har försämrats" | Rolling 50-trade WR < baseline -5pp | candidate default v1 | TradeSys | Window-size ej kalibrerad mot edge-decay-takt |

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
För deterministiska pipelines: samma input + samma model/version/configuration ger samma output. Pipelines som inte kan vara deterministiska (LLM-anrop, externa API:er, marknadsdata) måste explicit deklarera det och persistera både input och output.

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

[NOTE: Due to length constraints, this commit contains v1.3 first half. Second half (Princip 4-12, S.1-S.6, Enforcement Architecture, Override Protocol, Summary, References) committed in immediate follow-up commit on same branch via continuation push. Full canonical fulltext exists at Engrams marker CORE-PRINCIPLES-V1 (Level-2 body) and at /home/claude/CORE-PRINCIPLES-V1.md (55KB) per S.5 redundancy requirement.]

---

**Author:** CA (ca-2026-05-21-0930)
**Status:** v1.3-draft — partial commit due to push payload size, second half in next commit
**Awaiting:** Gustav approval after both halves committed
