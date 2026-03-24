/**
 * styr-ai Autonomous Agent — VISION-005 + VISION-002
 *
 * Per körning:
 * 1. Läser djup state från alla projekt-repos inkl. project_context.md
 * 2. Analyserar gaps mot varje projekts egna mål + styr-ai goals.md
 * 3. Skriver uppdaterad global_status.md
 * 4. Lägger till saknade work items i styr-ai work_queue
 * 5. Skriver autonomous_report.md
 */

const fs = require('fs');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const SUBPROJECTS = [
  { owner: 'gustavkall', repo: 'savage-roar-music' },
  { owner: 'gustavkall', repo: 'tradesys1337' },
  { owner: 'gustavkall', repo: 'min-analytiker' },
  { owner: 'gustavkall', repo: 'adminassistent' },
];

// project_context.md är primärkälla — definierar projektets syfte och mål
const SUBPROJECT_FILES = [
  'project_memory/project_context.md',  // PRIMÄR — syfte, mål, vad styr-ai ska bevaka
  'state/session_handoff.md',
  'state/work_queue.md',
  'project_memory/decisions.md',
  'CLAUDE.md',
];

const STYRAIS_FILES = [
  'state/work_queue.md',
  'project_memory/goals.md',
  'governance/system_rules.md',
  'project_memory/cross_project_learnings.md',
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

async function fetchFileSha(owner, repo, filePath) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.sha || null;
}

async function writeFile(owner, repo, filePath, content, message) {
  const sha = await fetchFileSha(owner, repo, filePath);
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const body = {
    message,
    content: Buffer.from(content).toString('base64'),
    branch: 'main',
  };
  if (sha) body.sha = sha;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`writeFile failed ${filePath}: ${err}`);
    return false;
  }
  return true;
}

async function readAllState() {
  const styrAi = {};
  for (const f of STYRAIS_FILES) {
    const key = f.split('/').pop().replace('.md', '').replace(/-/g, '_');
    styrAi[key] = await fetchFile('gustavkall', 'styr-ai', f);
  }

  const subprojects = {};
  for (const p of SUBPROJECTS) {
    subprojects[p.repo] = {};
    for (const f of SUBPROJECT_FILES) {
      const key = f.split('/').pop().replace('.md', '').replace(/-/g, '_');
      subprojects[p.repo][key] = await fetchFile(p.owner, p.repo, f);
    }
  }

  return { styrAi, subprojects };
}

async function callClaude(system, user) {
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
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.content?.[0]?.text || '';
}

function stripFences(raw) {
  return raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
}

async function main() {
  console.log('styr-ai autonomous agent starting...');

  const { styrAi, subprojects } = await readAllState();

  const systemPrompt = `Du är styr-ai — ett autonomt meta-system som hanterar och övervakar alla Gustavs projekt.

Du sitter OVANFÖR alla underprojekt. Du ser helheten som de enskilda projekten inte ser.

VIKTIGT: Varje underprojekt har ett eget syfte och egna mål definierade i project_context.md.
Analysera alltid varje projekt utifrån DESS egna mål — inte ett generiskt projektmål.
Frågan per projekt är: "Rör sig det här projektet mot sitt specifika mål, och vad blockerar det?"

styr-ai:s övergripande syfte:
${styrAi['goals'] || '(ej tillgänglig)'}

Autonomigränser:
${styrAi['system_rules'] || '(ej tillgänglig)'}

Cross-project learnings:
${styrAi['cross_project_learnings'] || '(ej tillgänglig)'}

Du skriver alltid på svenska. Du är koncis, analytisk och direkt.
Du tänker som en erfaren grundare och investerare.`;

  const subprojectBlob = Object.entries(subprojects).map(([repo, files]) => {
    const context = files['project_context'] ? `### PROJEKTETS SYFTE OCH MÅL\n${files['project_context']}\n\n` : '';
    const rest = Object.entries(files)
      .filter(([k, v]) => v && k !== 'project_context')
      .map(([k, v]) => `### ${k}\n${v}`)
      .join('\n\n');
    return `## PROJEKT: ${repo}\n${context}${rest || '(inga övriga filer)'}`;
  }).join('\n\n---\n\n');

  const userPrompt = `Här är fullständig state för alla underprojekt. Varje projekt börjar med sitt syfte och mål (project_context):

${subprojectBlob}

---

styr-ai work_queue (nuläge):
${styrAi['work_queue'] || '(ej tillgänglig)'}

---

Analysera helheten och returnera JSON med exakt dessa nycklar:

1. "global_status": Markdown-tabell — projekt, status mot PROJEKTETS EGNA MÅL, blockers, nästa steg.

2. "gap_analysis": Array av gap per projekt — vad saknas, blockerar eller riskerar att projektet når SINA mål. Format: {project, gap, severity: "HIGH"|"MEDIUM"|"LOW", suggested_action}.

3. "work_queue_additions": Nya work items för styr-ai baserat på gap-analysen. Bara saker som faktiskt saknas. Format: [{id, title, priority: "MAX"|"HIGH"|"MEDIUM"|"LOW", description, project}].

4. "cross_project_insights": Max 5 insikter som KORSAR projektgränserna — synergier, konflikter, resursberoenden, timing.

5. "autonomous_action": Vad agenten faktiskt exekverade denna körning, eller null.

6. "report": Rapport till Gustav. Max 400 ord. Analytiker/grundarperspektiv. Vad ser systemet som Gustav inte ser? Vad kräver handling nu?

Returnera ENDAST giltigt JSON. Börja med { och avsluta med }.`;

  console.log('Calling Claude...');
  const raw = await callClaude(systemPrompt, userPrompt);
  console.log('Response length:', raw.length);

  let result;
  try {
    result = JSON.parse(stripFences(raw));
  } catch (e) {
    console.error('Parse failed:', raw.slice(0, 500));
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

  if (result.work_queue_additions?.length > 0) {
    const additions = result.work_queue_additions
      .map(item => `### ${item.id} — ${item.title}\n**Priority:** ${item.priority}\n**Project:** ${item.project || 'styr-ai'}\n**Description:** ${item.description}`)
      .join('\n\n');
    const currentQueue = styrAi['work_queue'] || '';
    const updatedQueue = currentQueue + `\n\n<!-- Auto-added by agent ${new Date().toISOString()} -->\n\n${additions}`;
    await writeFile('gustavkall', 'styr-ai', 'state/work_queue.md', updatedQueue,
      `agent: add ${result.work_queue_additions.length} work items from gap analysis`);
    console.log(`Added ${result.work_queue_additions.length} work items`);
  }

  const timestamp = new Date().toISOString();
  const lines = [
    `# styr-ai Autonomous Report`,
    `*${timestamp}*`, '',
    '## Rapport',
    result.report || '', '',
  ];

  if (result.gap_analysis?.length > 0) {
    lines.push('## Gap-analys per projekt');
    for (const g of result.gap_analysis) {
      lines.push(`- **[${g.severity}] ${g.project}**: ${g.gap} → *${g.suggested_action}*`);
    }
    lines.push('');
  }

  if (result.cross_project_insights?.length > 0) {
    lines.push('## Cross-project insikter');
    for (const i of result.cross_project_insights) {
      lines.push(`- ${i}`);
    }
    lines.push('');
  }

  if (result.work_queue_additions?.length > 0) {
    lines.push('## Tillagda work items');
    for (const item of result.work_queue_additions) {
      lines.push(`- **${item.id}** [${item.priority}] (${item.project || 'styr-ai'}): ${item.title}`);
    }
    lines.push('');
  }

  if (result.autonomous_action) {
    lines.push('## Autonom åtgärd');
    lines.push(result.autonomous_action);
    lines.push('');
  }

  fs.writeFileSync('state/autonomous_report.md', lines.join('\n'));
  console.log('Done.');
}

main().catch((err) => {
  console.error('Fatal:', err);
  fs.writeFileSync(
    'state/autonomous_report.md',
    `# styr-ai Autonomous Report\n*${new Date().toISOString()}*\n\n## Fatal error\n\n${err.message}\n\n${err.stack}`
  );
  process.exit(1);
});
