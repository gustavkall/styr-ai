# Next Session Brief
*Följ dessa instruktioner exakt vid nästa sessionstart.*

---

## Fokus: Engrams onboarding-infrastruktur

Läs `project_memory/architecture/engrams_onboarding_plan.md` INNAN du föreslår något.
Implementationsordningen finns där. Följ den.

## Startpunkt

1. Kör SQL-schemat i Supabase (styr-ai projektet)
2. Fråga Gustav om han vill köra det själv eller om Claude ska generera migrations-filen
3. Bygg sedan api/stripe-webhook.js i engrams-repot

## Miljövariabler som saknas i Vercel (engrams)

Påminn Gustav att lägga till:
```
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
RESEND_API_KEY
```

## Övrigt att inte glömma

- Warner-frist 29 mars är IMORGON — fråga om det finns uppdateringar
- Agent 4 + 6 (SECTOR_HOT, SC_TREND) behöver omstart i CC
- Anna Garmen onboarding väntar på multi-project fix
