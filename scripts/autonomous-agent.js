/**
 * styr-ai Autonomous Agent — VISION-005
 *
 * Per körning:
 * 1. Läser state från alla projekt-repos
 * 2. Skriver uppdaterad global_status.md
 * 3. Identifierar + lägger till saknade work items baserat på goals.md
 * 4. Exekverar nästa READY-item i work_queue om autonomt tillåtet
 * 5. Skriver autonomous_report.md
 *
 * Rapport hämtas manuellt via Claude när Gustav vill ha den.
 */

const fs = require('fs');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const PROJECTS = [
  { owner: 'gustavkall', repo: 'styr-ai' },
  { owner: 'gustavkall', repo: 'savage-roar-music' },
  { owner: 'gustavkall', repo: 'tradesys1337' },
  { owner: 'gustavkall', repo: 'min-analytiker' },
  { owner: 'gustavkall', repo: 'adminassistent' },
];

async function fetchFile(owner, repo, filePath) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3.raw',
    },
  });
  if (!res.ok) return null;
  return res.text();
}

async function readAllProjectState() {
  const states = {};
  for (const p of PROJECTS) {
    const handoff = await fetchFile(p.owner, p.repo, 'state/session_handoff.md');
    const queue = await fetchFile(p.owner, p.repo, 'state/work_queue.md');
    states[p.repo] = { handoff, queue };
  }
  const goals = await fetchFile('gustavkall', 'styr-ai', 'project_memory/goals.md');
  const rules = await fetchFile('gustavkall', 'styr-ai', 'governance/system_rules.md');
  return { states, goals, rules };
}

async function runClaudeAgent(systemPrompt, userPrompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${err}`);
  }
  const data = await res.json();
  console.log('Anthropic response:', JSON.stringify(data).slice(0, 500));
  return data.content?.[0]?.text || '';
}

function stripJsonFences(raw) {
  // Ta bort ```json ... ``` eller ``` ... ``` wrappers
  return raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
}

async function main() {
  console.log('styr-ai autonomous agent starting...');
  const { states, goals, rules } = await readAllProjectState();

  const systemPrompt = `Du är styr-ai, ett autonomt agentsystem för projekthantering.

Ditt syfte:
${goals}

Dina autonomigränser:
${rules}

Du opererar ALLTID inom autonomigränserna. Du eskalerar när du är osäker.
Du skriver alltid på svenska. Du är koncis och direkt.`;

  const stateBlob = Object.entries(states)
    .map(([repo, s]) => `## ${repo}\n### session_handoff\n${s.handoff || '(ej tillgänglig)'}\n### work_queue\n${s.queue || '(ej tillgänglig)'}`)
    .join('\n\n---\n\n');

  const userPrompt = `Här är aktuell state för alla projekt:\n\n${stateBlob}\n\nUtför följande i ordning och returnera resultatet som ett JSON-objekt med dessa nycklar:\n\n1. "global_status": Uppdaterad global_status.md i markdown-format. Tabell med projekt, status, blockers, nästa steg.\n2. "work_queue_additions": Array med nya work items som saknas baserat på goals.md. Format: [{id, title, priority, description}]. Tom array om inget saknas.\n3. "autonomous_action": Beskriv om det finns ett READY-item i styr-ai work_queue som systemet får exekvera autonomt enligt system_rules.md. Om ja: vad är åtgärden och resultatet. Om nej: null.\n4. "report": Rapport till Gustav. Max 300 ord. Vad gjordes, vad blockerar, vad systemet ser som Gustav kanske inte ser, nästa prioritering.\n\nReturnera ENDAST giltigt JSON utan kodblock eller inledning. Börja direkt med { och avsluta med }.`;

  console.log('Calling Claude...');
  const raw = await runClaudeAgent(systemPrompt, userPrompt);
  console.log('Raw response length:', raw.length);

  const cleaned = stripJsonFences(raw);

  let result;
  try {
    result = JSON.parse(cleaned);
  } catch (e) {
    console.error('JSON parse failed. Raw:', raw.slice(0, 1000));
    fs.writeFileSync(
      'state/autonomous_report.md',
      `# styr-ai Autonomous Report\n*${new Date().toISOString()}*\n\n## Parse failed\n\n\`\`\`\n${raw.slice(0, 3000)}\n\`\`\``
    );
    process.exit(0);
  }

  if (result.global_status) {
    fs.writeFileSync('state/global_status.md', result.global_status);
    console.log('global_status.md updated');
  }

  const timestamp = new Date().toISOString();
  const reportLines = [
    `# styr-ai Autonomous Report`,
    `*${timestamp}*`,
    '',
    '## Rapport',
    result.report || '(ingen rapport genererad)',
    '',
  ];

  if (result.work_queue_additions?.length > 0) {
    reportLines.push('## Föreslagna work items');
    for (const item of result.work_queue_additions) {
      reportLines.push(`- **${item.id}** [${item.priority}]: ${item.title} — ${item.description}`);
    }
    reportLines.push('');
  }

  if (result.autonomous_action) {
    reportLines.push('## Autonom åtgärd');
    reportLines.push(result.autonomous_action);
    reportLines.push('');
  }

  const reportContent = reportLines.join('\n');
  fs.writeFileSync('state/autonomous_report.md', reportContent);
  console.log('autonomous_report.md written');
  console.log('Agent run complete.');
}

main().catch((err) => {
  console.error('Agent fatal error:', err);
  fs.writeFileSync(
    'state/autonomous_report.md',
    `# styr-ai Autonomous Report\n*${new Date().toISOString()}*\n\n## Fatal error\n\n${err.message}\n\n${err.stack}`
  );
  process.exit(1);
});
