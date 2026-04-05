#!/bin/bash
# todo.sh — Global todo-lista från styr_global_todo i Supabase
# Kör: todo

SUPABASE_URL="https://crsonxfrylkpgrddovhu.supabase.co"
SUPABASE_KEY="${SUPABASE_ANON_KEY:-}"

if [ -z "$SUPABASE_KEY" ]; then
  echo "Sätt SUPABASE_ANON_KEY i ~/.zshrc"
  exit 1
fi

python3 << PYEOF
import urllib.request, urllib.parse, json, sys, os

url = "https://crsonxfrylkpgrddovhu.supabase.co/rest/v1/styr_global_todo"
key = os.environ.get("SUPABASE_ANON_KEY", "")
params = urllib.parse.urlencode({
    "status": "neq.done",
    "order": "priority.asc.nullslast,project.asc"
})

req = urllib.request.Request(
    f"{url}?{params}",
    headers={
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json"
    }
)

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read())
except Exception as e:
    print(f"Fel: {e}")
    sys.exit(1)

RESET  = '\033[0m'
BOLD   = '\033[1m'
GRAY   = '\033[90m'
DIM    = '\033[2m'
YELLOW = '\033[93m'
CYAN   = '\033[96m'
GREEN  = '\033[92m'
RED    = '\033[91m'

colors = {
    'engrams':     CYAN,
    'tradesys':    YELLOW,
    'styr-ai':     GREEN,
    'savage-roar': RED,
}

icons = {
    'todo':          '○',
    'in_progress':   '◑',
    'blocked':       '✗',
    'deprioritized': '·',
}

print()
print("╔══════════════════════════════════════════════════════════════╗")
print("║  STYR-AI GLOBAL TODO                                         ║")
print("╚══════════════════════════════════════════════════════════════╝")

import datetime
print(datetime.datetime.now().strftime("%Y-%m-%d %H:%M"))

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
        color = colors.get(proj, RESET)
        print(f"\n{color}{BOLD}  ▼ {proj.upper()}{RESET}")
        print(f"  {'─' * 60}")

    prio_label = f"P{prio}" if prio else "P?"
    icon = icons.get(status, '○')
    fade = GRAY if status == 'deprioritized' else ''

    t = title if len(title) <= 55 else title[:52] + '...'
    print(f"{fade}  {icon} [{prio_label}] {t}{RESET}")
    print(f"{GRAY}       {iid}{RESET}")

    if notes:
        hint = notes[:90] + '...' if len(notes) > 90 else notes
        print(f"{DIM}       → {hint}{RESET}")
    print()

# Räkna done
req2 = urllib.request.Request(
    f"{url}?status=eq.done&select=id",
    headers={"apikey": key, "Authorization": f"Bearer {key}"}
)
try:
    with urllib.request.urlopen(req2) as resp:
        done_count = len(json.loads(resp.read()))
except:
    done_count = "?"

print(f"  Öppna: {len(data)}  |  Klara: {done_count}")
print()
PYEOF
