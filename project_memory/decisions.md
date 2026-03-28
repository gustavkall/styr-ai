# styr-ai — Decision Log
*Cumulative log. Append-only.*

---

### 2026-03-24 — Goals layer definierad (VISION-001)
**Context:** styr-ai saknade ett explicit mål.
**Decision:** goals.md definierar systemets syfte som leverage-multiplikator.
**Why:** Utan tydligt mål optimeras systemet för fel saker.
**Impact:** Alla work items värderas mot goals.md.

### 2026-03-24 — Autonomigränser definierade (VISION-004)
**Context:** VISION-005 kräver tydliga ramar.
**Decision:** governance/system_rules.md — tre nivåer: autonomt, kräver godkännande, aldrig autonomt.
**Why:** Tydliga gränser är förutsättning för autonom exekvering.
**Impact:** VISION-005 kunde planeras och exekveras.

### 2026-03-26 — Warner-tvist hanteras personligen
**Context:** COO-agenten eskalerade Warner-deadline som systemuppgift.
**Decision:** Gustav hanterar personligen. Inte en systemuppgift.
**Why:** Juridiska förhandlingar kräver personlig bedömning.
**Impact:** COO ska inte eskalera WARNER-DEADLINE framöver.

### 2026-03-26 — MODEL-002 och MODEL-003 bekräftat byggda
**Context:** COO flaggade EMS/FPS/STS och EPS surprise som saknade.
**Decision:** Gustav bekräftar att båda är implementerade.
**Why:** State-filer reflekterade inte faktiskt läge.
**Impact:** Båda markerade completed. MODEL-004 är nästa steg.

### 2026-03-26 — styrAI-product arkitektur
**Context:** Behövde bestämma arkitektur för persistent memory-produkten.
**Decision:** MCP-server (Vercel) + Supabase PostgreSQL + pgvector + OpenAI embeddings. Managed hosting hos Gustav.
**Why:** MCP är rätt leveransmekanism. Managed ger zero friktion för kund. pgvector i Supabase eliminerar separat vektordatabas.
**Impact:** Fas 1 byggd och live samma dag. COGS <$1/mån per kund.

### 2026-03-26 — Separata repos för meta-system och produkt
**Context:** styr-ai repot används som meta-system med state-filer och agenter.
**Decision:** styrAI-product är separat repo — deployas på Vercel. styr-ai förblir internt.
**Why:** Separation of concerns. Produktkod ska inte blandas med state-filer.
**Impact:** Ren arkitektur. Vercel deployar styrAI-product, inte styr-ai.

### 2026-03-28 — Produktnamn: Engrams
**Context:** styrAI-product behövde ett produktnamn för publik lansering.
**Decision:** Engrams. Domän: engrams.app (180 kr/år, köpt 2026-03-28).
**Why:** Engram = etablerat vetenskapligt begrepp (minnesspår i hjärnan). Korrekt plural i litteraturen. .app-domän signalerar produkt. Starkare än alternativ (Axon, Mnemo, Exocortex).
**Impact:** Repo gustavkall/engrams skapad. Landningssida + waitlist live samma dag.

### 2026-03-28 — Engrams arkitektur: Database-only (default)
**Context:** Designfråga — ska kunder behöva ett eget GitHub-repo, eller ska allt leva i Engrams databas?
**Decision:** Database-only som default. Hybrid (repo + Engrams) som enterprise-option senare.
**Why:** Konsumenter vill inte hantera repos. De vill att AI:n minns. Repo-krav är onboarding-friktion. Database-only = kund betalar → får API-nyckel → klistrar in i Claude → klar. Engrams skriver ALDRIG till kundens repo eller databas.
**Impact:** Onboarding-plan designad. SQL-schema klart (accounts + projects + sessions + decisions). Stripe → webhook → API-nyckel → mail är hela flödet.

### 2026-03-28 — CC↔Claude.ai bidirektionellt sync
**Context:** CC och Claude.ai jobbade i separata silos utan delat minne.
**Decision:** state/active_context.md (Claude.ai skriver) + state/cc_session_log.md (CC skriver). Alias `sync` i CC.
**Why:** Varje CC-session startade blank. Beslut tagna i Claude.ai var osynliga för CC och vice versa.
**Impact:** CLAUDE.md uppdaterad i styr-ai + tradesys1337. Steg 0 i CC boot-protokoll.

### 2026-03-28 — Handoff och sync ska skriva till decisions + learnings
**Context:** Viktiga beslut och resonemang (t.ex. database-only-arkitekturen, marknadsanalysen) fångades inte i state-filer vid handoff.
**Decision:** Session handoff och sync ska ALLTID uppdatera decisions.md och cross_project_learnings.md om något substantiellt beslutats eller lärts under sessionen. Inte bara session_handoff.md och work_queue.md.
**Why:** Boot-protokollet läser decisions.md och learnings.md. Om de inte uppdateras tappar nästa session kritiskt resonemang.
**Impact:** CLAUDE.md uppdaterad med explicit instruktion. Gäller även CC via cc_session_log.md.
