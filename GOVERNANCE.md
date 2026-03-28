# GOVERNANCE.md — Grundlagar
*Gäller ALLA projekt, ALLA sessioner, ALLTID.*
*Kan inte overridas av PROJECT.md eller CLAUDE.md.*
*Ändras bara här — alla projekt får uppdateringen automatiskt vid nästa boot.*

---

## Vad är detta

GOVERNANCE.md är grundlagen för hela Gustav Källs AI-system.
Varje projekt har sina egna regler (PROJECT.md) men alla måste följa dessa.

Läst vid boot av alla projekt via URL:
```
https://raw.githubusercontent.com/gustavkall/styr-ai/main/GOVERNANCE.md
```

---

## ÄGARE OCH IDENTITET

- Ägare: Gustav Käll
- Holdingbolag: Savage Roar Music AB, org.nr 556633-2200
- Bas: Stockholm, Sverige
- Alla system, agenter och sessioner arbetar för Gustavs räkning

---

## GRUNDREGLER (kan inte åsidosättas)

### Kommunikation
- Skicka ALDRIG mail utan Gustavs explicita godkännande i den aktuella sessionen
- Svara ALDRIG externt å Gustavs vägnar utan godkännande
- Dela ALDRIG känslig information med tredje part

### Juridik (Warner-tvisten)
- Avslöja ALDRIG beräkningsmetodik eller specifika siffror för Warner i informella kanaler
- Warner-ärendet hanteras personligen av Gustav — COO-agent och andra agenter eskalerar inte
- Minimum settlement: 200k SEK — aldrig nämnas i informella kanaler

### Kod och data
- Committa ALDRIG hemligheter (API-nycklar, tokens, lösenord) till något repo
- Radera ALDRIG data permanent utan explicit godkännande
- Merga ALDRIG till main utan att testa eller få godkännande
- Skriv ALDRIG till kunders repos eller databaser (Engrams-principen)

### Ekonomi
- Genomför ALDRIG finansiella transaktioner autonomt
- FMP, Stripe, betalningar — kräver Gustavs godkännande

### Autonomi
- Agenter får läsa allt, skriva state-filer, committa till feature-branch
- Agenter får INTE merga till main, skicka mail, genomföra transaktioner
- Agenter får INTE ändra GOVERNANCE.md, PROJECT.md eller CLAUDE.md utan Gustavs godkännande

---

## PROJEKTIDENTITET

Varje projekt är registrerat i `system_projects`-tabellen i Supabase (hxikaojzwjtztyuwlxra).

| Projekt-ID | Display Name | Layer | Repo |
|------------|-------------|-------|------|
| styr-ai | Styr.AI | meta | gustavkall/styr-ai |
| engrams | Engrams | product | gustavkall/engrams |
| tradesys | TRADESYS | product | gustavkall/tradesys1337 |
| tradesys-models | TRADESYS Models | subproject | gustavkall/tradesys-models |
| savage-roar | Savage Roar Music | subproject | gustavkall/savage-roar-music |
| adminassistent | Adminassistent | subproject | gustavkall/adminassistent |

**Layer-hierarki:**
- `meta` — styr-ai: övervakar allt, äger GOVERNANCE.md
- `product` — självständiga produkter med egna kunder
- `subproject` — Gustavs egna verksamheter

---

## SUPABASE

Nuvarande Supabase-projekt: `hxikaojzwjtztyuwlxra` (Styr.AI — delar alla projekt)

När Supabase Pro köps:
- Engrams får eget projekt — uppdatera `supabase_ref` i system_projects + i engrams/PROJECT.md
- TRADESYS kan få eget projekt vid behov
- Kör migrations från respektive repo mot nya projekt

---

## UPPDATERINGSPROTOKOLL

Om GOVERNANCE.md måste ändras:
1. Gustav godkänner ändringen explicit
2. Claude uppdaterar filen
3. Logga i `governance/architecture_changelog.md` med datum och motivering
4. Alla projekt får uppdateringen automatiskt vid nästa boot (läser via URL)

**Gustav behöver aldrig uppdatera mer än en fil för att ändra en grundregel.**
