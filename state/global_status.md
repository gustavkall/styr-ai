# GLOBAL STATUS — styr-ai
*Uppdaterad: 2026-03-23*

---

## SYSTEMÖVERSIKT

| Projekt | Repo | Status | Senaste session | Blockers |
|---------|------|--------|-----------------|----------|
| styr-ai | gustavkall/styr-ai | v1 scaffold, ej deployad | 2026-03-23 | Supabase setup, beslut om riktning |
| Savage Roar Music | gustavkall/savage-roar-music | v1 scaffold, ej deployad | 2026-03-23 | Supabase setup |
| TRADESYS | gustavkall/tradesys1337 | v37 LIVE ✅ | 2026-03-21 | Inga |
| Min Analytiker | gustavkall/min-analytiker | v1 scaffold, ej deployad | 2026-03-23 | Supabase setup |
| Adminassistent | gustavkall/adminassistent | v1 scaffold, ej deployad | 2026-03-23 | Supabase setup |

---

## PER PROJEKT

### styr-ai
- Meta-system för projekthantering
- VISION-001–005 definierade (goals layer → proaktiv prio → blind spot → autonomigränser → autonom execution)
- Affärsmodell: subscription, moat = ackumulerat minne + autonom execution
- Avvaktar Gustav-beslut om riktning innan build startar
- Nästa: VISION-001 goals layer + SETUP-001–003

### Savage Roar Music
- Scaffold skapad 2026-03-23
- Inga project-specifika items ännu — warner-tvist, Vali Miron etc ej dokumenterade i work_queue
- Nästa: SETUP-001–003, sedan fylla med faktiskt label-content

### TRADESYS
- Det enda fully deployed systemet
- Dashboard v37 live: https://tradesys1337.vercel.app
- Persistent memory ~93% (Supabase + auto-memory + repo)
- Senaste arbete: BUG-008/009, sidebar sort + RelVol, Supabase memory tables
- Regim vid senaste close: RISK-OFF (SPY 659.80, VIX ~28)
- Nästa: WQ-008 scanner-verifiering live, BASE-URL api.massive vs polygon

### Min Analytiker
- Scaffold skapad 2026-03-23
- Intradagsanalytiker som ska integreras med TRADESYS
- Ingen funktionalitet ännu
- Nästa: SETUP-001–003

### Adminassistent
- Scaffold skapad 2026-03-23
- Executive assistant för Savage Roar AB
- Ingen funktionalitet ännu
- Nästa: SETUP-001–003

---

## KRITISKA OPEN ITEMS (cross-project)

1. **Supabase setup** — 4 av 5 projekt väntar på detta. Borde batcha och lösa alla på en gång.
2. **styr-ai riktningsbeslut** — Gustav fattar beslut → fångar upp alla SETUP + VISION items
3. **TRADESYS BASE-URL** — api.massive.com vs api.polygon.io, oklarhet kvar
4. **Savage Roar content** — Warner-tvist, Vali Miron-arbete är odokumenterat i systemet

---

## SESSION DENNA GÅNG
- Ingen aktiv arbetsdata genererades
- Gustav gick direkt på global session close
- State läst från alla repos, global_status.md skriven
