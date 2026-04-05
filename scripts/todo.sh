#!/bin/bash
# todo.sh — Global todo-lista från styr_global_todo i Supabase
# Kör: bash scripts/todo.sh
# Eller lägg alias i .zshrc: alias todo='bash ~/styr-ai/scripts/todo.sh'

SUPABASE_URL="https://crsonxfrylkpgrddovhu.supabase.co"
SUPABASE_KEY="${SUPABASE_ANON_KEY:-}"

# Fallback: använd gh CLI om ingen nyckel
if [ -z "$SUPABASE_KEY" ]; then
  # Hämta via Supabase REST API med service key från miljövariabel
  echo "Sätt SUPABASE_ANON_KEY i din .zshrc för att använda todo.sh"
  exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  STYR-AI GLOBAL TODO                       ║"
echo "╚════════════════════════════════════════════════════════╝"
echo "$(date '+%Y-%m-%d %H:%M')"
echo ""

# Hämta alla öppna items
RESPONSE=$(curl -s \
  "$SUPABASE_URL/rest/v1/styr_global_todo?status=neq.done&order=priority.asc.nullslast,project.asc" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "Content-Type: application/json")

if [ -z "$RESPONSE" ] || [ "$RESPONSE" = "[]" ]; then
  echo "Inga öppna items."
  exit 0
fi

# Formatera med python3
echo "$RESPONSE" | python3 -c "
import json, sys

data = json.load(sys.stdin)

# Status-symboler
def status_icon(s):
    icons = {
        'todo': '○',
        'in_progress': '◔',
        'blocked': '⚠️',
        'deprioritized': '□'
    }
    return icons.get(s, '○')

# Färgkoder
RESET = '\033[0m'
BOLD = '\033[1m'
GRAY = '\033[90m'
YELLOW = '\033[93m'
CYAN = '\033[96m'
GREEN = '\033[92m'
RED = '\033[91m'

project_colors = {
    'engrams': CYAN,
    'tradesys': YELLOW,
    'styr-ai': GREEN,
    'savage-roar': RED,
}

current_project = None
current_prio = None

for item in data:
    proj = item.get('project', '?')
    prio = item.get('priority')
    title = item.get('title', '')
    status = item.get('status', 'todo')
    notes = item.get('notes', '') or ''
    item_id = item.get('id', '')
    
    # Projekt-header
    if proj != current_project:
        current_project = proj
        color = project_colors.get(proj, RESET)
        print(f'')
        print(f'{color}{BOLD}  ▼ {proj.upper()}{RESET}')
        print(f'  {"-" * 50}')
        current_prio = None
    
    # Prio-header
    prio_label = f'P{prio}' if prio else 'P?'
    if prio != current_prio:
        current_prio = prio
    
    # Item-rad
    icon = status_icon(status)
    gray = GRAY if status == 'deprioritized' else RESET
    
    # Trunkera title om för lång
    display_title = title if len(title) <= 60 else title[:57] + '...'
    
    print(f'{gray}  {icon} [{prio_label}] {display_title}{RESET}')
    print(f'{GRAY}       ID: {item_id}{RESET}')
    
    # Visa action-hint från notes
    if notes and len(notes) > 0:
        hint = notes[:80] + '...' if len(notes) > 80 else notes
        print(f'{GRAY}       → {hint}{RESET}')
    print()
"

echo ""
# Done-räknare
DONE=$(curl -s \
  "$SUPABASE_URL/rest/v1/styr_global_todo?status=eq.done&select=id" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" | python3 -c "import json,sys; print(len(json.load(sys.stdin)))")
OPEN=$(echo "$RESPONSE" | python3 -c "import json,sys; print(len(json.load(sys.stdin)))")
echo "  Öppna: $OPEN  |  Klara: $DONE"
echo ""
