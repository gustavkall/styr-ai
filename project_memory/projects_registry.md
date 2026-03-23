# Projektregister

*Uppdateras av styr-ai. Alla projekt som anvander persistent memory-systemet.*

---

## Aktiva projekt

### savage-roar-music
- **Repo:** gustavkall/savage-roar-music
- **Syfte:** Musiklabel, Warner-tvist, Vali Miron artist management
- **Skapad:** 2026-03-23
- **CC alias:** `savageroar`
- **Claude.ai projekt:** Savage Roar Music
- **Status:** Live, persistent memory verifierad

### tradesys1337
- **Repo:** gustavkall/tradesys1337
- **Syfte:** Trading dashboard, single-file HTML, scanners, regime
- **Skapad:** 2026-03 (ursprungligt)
- **CC alias:** `tradesys`
- **Claude.ai projekt:** TRADESYS
- **Status:** Live, v37 deployad

### min-analytiker
- **Repo:** gustavkall/min-analytiker
- **Syfte:** Intradagsanalytiker for TradeSys, pre-market analys, kandidatval
- **Skapad:** 2026-03-23
- **CC alias:** `minanalytiker`
- **Claude.ai projekt:** Min Analytiker
- **Status:** Live, persistent memory verifierad

### adminassistent
- **Repo:** gustavkall/adminassistent
- **Syfte:** Executive assistant, mail, kalender, Savage Roar AB operativt
- **Skapad:** 2026-03-23
- **CC alias:** `adminassistent`
- **Claude.ai projekt:** Adminassistent
- **Status:** Live, persistent memory verifierad (TEST-001 passed)

---

## Ny-projekt checklista

1. `source ~/.zshrc && new-project "projektnamn"`
2. Gor repot publikt (for Claude.ai access)
3. Skriv `project_memory/context_import.md` med historisk kontext
4. Uppdatera CLAUDE.md med projektbeskrivning
5. Skapa projekt i Claude.ai med persistent memory-instruktioner
6. Testa session boot + write-back
7. Registrera har i projects_registry.md
