#!/bin/bash
# deploy.sh — Kör när Gustav skriver 'deploy' i CC Engrams-terminalen.
# Hittar protokollfil med GODKÄND status, visar Sektion 4, implementerar.

REPO_OWNER="gustavkall"
STYR_REPO="styr-ai"
DATE=$(date +%Y-%m-%d)

echo "=== DEPLOY ENGRAMS === $DATE"

# Steg 1: Uppdatera repo
git pull --rebase origin main 2>&1 | tail -2

# Steg 2: Hitta protokollfil med GODKÄND i engrams-sektionen
echo "Letar efter godkänd deployment..."
FILES=$(gh api repos/$REPO_OWNER/$STYR_REPO/contents/state \
  --jq '[.[] | select(.name | startswith("protocol_"))] | .[].name' 2>/dev/null || echo "")

PROTOCOL_NAME=""
for f in $FILES; do
  CONTENT=$(gh api repos/$REPO_OWNER/$STYR_REPO/contents/state/$f \
    --jq '.content' 2>/dev/null | base64 -d 2>/dev/null || echo "")
  if echo "$CONTENT" | grep -q "scope: engrams" && \
     echo "$CONTENT" | grep -qi "GODK.ND.*REDO\|REDO.*K.RAS"; then
    PROTOCOL_NAME=$f
    echo "$CONTENT" > /tmp/protocol_current.md
    echo "$PROTOCOL_NAME" > /tmp/protocol_name.txt
    echo "  HIT: $PROTOCOL_NAME"
    break
  fi
done

if [ -z "$PROTOCOL_NAME" ]; then
  echo "Ingen godkänd deployment hittades. Använd 'sync' för feedback-runda."
  exit 0
fi

# Steg 3: Visa Sektion 4
echo ""
echo "=== SEKTION 4 — DEPLOYMENT INSTRUKTIONER ==="
awk '/## SEKTION 4/,0' /tmp/protocol_current.md
echo ""
echo ">>> Läs instruktionerna ovan och implementera nu."
echo ">>> När klart: kör bash scripts/sync.sh för att logga och stänga."
