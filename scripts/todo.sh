#!/bin/bash
# todo.sh — Global todo-lista från styr_global_todo i Supabase
# Kör: todo (alias) eller bash ~/styr-ai/scripts/todo.sh

SUPABASE_URL="https://crsonxfrylkpgrddovhu.supabase.co"
SUPABASE_KEY="${SUPABASE_ANON_KEY:-}"

if [ -z "$SUPABASE_KEY" ]; then
  echo "Sätt SUPABASE_ANON_KEY i ~/.zshrc"
  exit 1
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  STYR-AI GLOBAL TODO                                         ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo "$(date '+%Y-%m-%d %H:%M')"
echo ""

RESPONSE=$(curl -s \
  "$SUPABASE_URL/rest/v1/styr_global_todo?status=neq.done&order=priority.asc.nullslast,project.asc" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "Content-Type: application/json")

if [ -z "$RESPONSE" ] || [ "$RESPONSE" = "[]" ]; then
  echo "Inga öppna items."
  exit 0
fi

echo "$RESPONSE" | python3 << 'PYEOF'
import json, sys

data = json.load(sys.stdin)

RESET  = '\033[0m'
BOLD   = '\033[1m'
GRAY   = '\033[90m'
YELLOW = '\033[93m'
CYAN   = '\033[96m'
GREEN  = '\033[92m'
RED    = '\033[91m'
DIM    = '\033[2m'

project_colors = {
    'engrams':     CYAN,
    'tradesys':    YELLOW,
    'styr-ai':     GREEN,
    'savage-roar': RED,
}

status_icons = {
    'todo':          '○',
    'in_progress':   '◑',
    'blocked':       '✗',
    'deprioritized': '·',
}

SEP = '─' * 62

current_project = None

for item in data:
    proj   = item.get('project', '?')
    prio   = item.get('priority')
    title  = item.get('title', '')
    status = item.get('status', 'todo')
    notes  = item.get('notes', '') or ''
    iid    = item.get('id', '')

    if proj != current_project:
        current_project = proj
        color = project_colors.get(proj, RESET)
        print(f'\n{color}{BOLD}  ▼ {proj.upper()}{RESET}')
        print(f'  {SEP}')

    prio_label = f'P{prio}' if prio else 'P?'
    icon = status_icons.get(status, '○')
    dim = GRAY if status == 'deprioritized' else ''

    display_title = title if len(title) <= 55 else title[:52] + '...'
    print(f'{dim}  {icon} [{prio_label}] {display_title}{RESET}')
    print(f'{GRAY}       {iid}{RESET}')

    if notes:
        hint = notes[:90] + '...' if len(notes) > 90 else notes
        print(f'{DIM}       → {hint}{RESET}')
    print()

PYEOF

DONE=$(curl -s \
  "$SUPABASE_URL/rest/v1/styr_global_todo?status=eq.done&select=id" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" | python3 -c "import json,sys; print(len(json.load(sys.stdin)))")
OPEN=$(echo "$RESPONSE" | python3 -c "import json,sys; print(len(json.load(sys.stdin)))")
echo "  Öppna: $OPEN  |  Klara: $DONE"
echo ""
