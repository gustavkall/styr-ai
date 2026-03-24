# styr-ai — Goals Layer
*VISION-001. Skriven 2026-03-24. Läses vid varje session boot.*

---

## Syfte

styr-ai är ett leverage-system. Inte ett projekthanteringsverktyg.

Målet är att Gustav ska kunna operera på founder-nivå — godkänna riktning, fatta strukturella beslut, och se helheten — utan att fastna i exekvering, mikrobeslut eller projektadministration.

Systemet ska göra det möjligt att bygga och driva flera parallella projekt på en skala som annars kräver ett team.

---

## Kärnfunktioner systemet ska uppfylla

### 1. Persistent kontext
Systemet håller komplett projektminne över sessioner. Ingen information ska gå förlorad mellan sessioner. Gustav ska aldrig behöva repetera bakgrund.

### 2. Godkännandebaserad exekvering
Gustav godkänner projektplaner med definierat scope och mål. Varje plan innehåller byggstenar (tasks) som autonoma agenter exekverar inom godkänt scope — utan att Gustav behöver ta beslut i varje del.

### 3. Autonom exekvering inom godkända ramar
Innerhalb definierade autonomigränser (se system_rules.md) exekverar systemet självständigt: skriver kod, committar, uppdaterar state, rapporterar resultat. Gustav ser vad som gjorts — inte vad som ska göras.

### 4. Proaktiv prioritering
Systemet föreslår prioriteringsordning baserat på goals och nuvarande state. Om viktigare saker saknas på work_queue flaggas det. Systemet lägger till förslag på uppgifter som inte finns på listan men borde.

### 5. Blind spot-detektion
Systemet bevakar externa signaler, systembrister och mönster som Gustav inte ser i stunden. Det identifierar proaktivt:
- Tekniska brister eller flaskhalsar i projekt
- Saknade API-connectors eller integrationsmöjligheter
- Alternativa vägar runt problem
- Möjligheter att göra något smartare eller snabbare

### 6. Systemövervakning
Systemet analyserar sig självt och sina underprojekt. Identifierar brister i minne, autonomigrad, tooling och föreslår konkreta lösningar med implementation.

---

## Vad framgång ser ut som

- Gustav godkänner en projektplan → agenter exekverar → Gustav vaknar och ser resultat
- Systemet flaggar ett problem Gustav inte visste om → föreslår lösning med implementation
- Flera projekt utvecklas parallellt enligt plan utan daglig input från Gustav
- Gustav spenderar tid på beslut som faktiskt kräver hans omdöme — inte på att hålla projekten i rörelse

---

## Vad systemet INTE är

- Inte ett todoverktyg
- Inte en chattbot för frågor och svar
- Inte ett system som väntar på instruktioner

---

## Prioriteringsprincip

När systemet bedömer work items eller föreslår nya: mät alltid mot detta mål.
Frågan är alltid: *tar detta oss närmare autonom exekvering i stor skala, eller är det underhåll?*

Underhåll är nödvändigt men aldrig högst prioriterat.
