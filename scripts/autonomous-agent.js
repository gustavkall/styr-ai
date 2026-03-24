/**
 * styr-ai Autonomous Agent — VISION-005 + VISION-002
 *
 * Per körning:
 * 1. Läser djup state från alla projekt-repos (handoff, queue, decisions, context, CLAUDE.md)
 * 2. Analyserar gaps mot goals.md (analyze-gaps / VISION-002)
 * 3. Skriver uppdaterad global_status.md
 * 4. Lägger till saknade work items i styr-ai work_queue
 * 5. Skriver autonomous_report.md
 *
 * Rapport hämtas via Claude on demand.
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

// Filer att läsa per underprojekt
const SUBPROJECT_FILES = [
  'state/session_handoff.md',
  'state/work_queue.md',
  'project_memory/decisions.md',
  'project_memory/context_import.md',
  'CLAUDE.md',
];

// Filer att läsa från styr-ai själv
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
  // Läs styr-ai egna filer
  const styrAi = {};
  for (const f of STYRAIS_FILES) {
    const key = f.split('/').pop().replace('.md', '');
    styrAi[key] = await fetchFile('gustavkall', 'styr-ai', f);
  }

  // Läs underprojekt med djup kontext
  const subprojects = {};
  for (const p of SUBPROJECTS) {
    subprojects[p.repo] = {};
    for (const f of SUBPROJECT_FILES) {
      const key = f.split('/').pop().replace('.md', '');
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
  console.log('styr-ai autonomous agent starting (VISION-005 + VISION-002)...');

  const { styrAi, subprojects } = await readAllState();

  const systemPrompt = `Du är styr-ai — ett autonomt meta-system som hanterar och övervakar alla Gustavs projekt.

Du sitter OVANFÖR alla underprojekt. Du ser helheten de enskilda projekten inte ser.

Ditt syfte:
${styrAi['goals'] || '(ej tillgänglig)'}

Dina autonomigränser:
${styrAi['system_rules'] || '(ej tillgänglig)'}

Aggregerade insikter från tidigare sessioner:
${styrAi['cross_project_learnings'] || '(ej tillgänglig)'}

Du opererar ALLTID inom autonomigränserna.
Du skriver alltid på svenska. Du är koncis, analytisk och direkt.
Du tänker som en erfaren grundare och investerare — inte som en projektledare.`;

  // Bygg djupt state-blob för alla underprojekt
  const subprojectBlob = Object.entries(subprojects).map(([repo, files]) => {
    const sections = Object.entries(files)
      .filter(([, v]) => v)
      .map(([k, v]) => `### ${k}\n${v}`)
      .join('\n\n');
    return `## PROJEKT: ${repo}\n${sections || '(inga filer tillgängliga)'}`;
  }).join('\n\n---\n\n');

  const styrAiWorkQueue = styrAi['work_queue'] || '(ej tillgänglig)';

  const userPrompt = `Här är fullständig state för alla underprojekt:

${subprojectBlob}

---

styr-ai nuvarande work_queue:
${styrAiWorkQueue}

---

Du är styr-ai. Analysera helheten och returnera ett JSON-objekt med exakt dessa nycklar:

1. "global_status": Markdown-tabell med alla projekt — status, blockers, nästa steg. Inkludera cross-project observationer.

2. "gap_analysis": Array med gap du identifierar — saker som SAKNAS, BLOCKERAR eller RISKERAR projektens framgång baserat på goals.md. Varje gap: {project, gap, severity: "HIGH"|"MEDIUM"|"LOW", suggested_action}.

3. "work_queue_additions": Array med konkreta nya work items för styr-ai work_queue baserat på gap-analysen. Format: [{id, title, priority: "MAX"|"HIGH"|"MEDIUM"|"LOW", description, project}]. Lägg bara till saker som faktiskt saknas på listan.

4. "cross_project_insights": Array med insikter som KORSAR projektgränserna — mönster, synergier, risker som påverkar flera projekt. Max 5 insikter.

5. "autonomous_action": null eller beskrivning av vad agenten faktiskt exekverade denna körning inom autonomigränserna.

6. "report": Rapport till Gustav. Max 400 ord. Skriv som en analytiker/grundare — inte som en projektledare. Vad ser systemet som Gustav kanske inte ser? Vad är det viktigaste att agera på nu?

Returnera ENDAST giltigt JSON. Börja direkt med { och avsluta med }.`;

  console.log('Calling Claude with deep state analysis...');
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

  // Skriv global_status.md
  if (result.global_status) {
    fs.writeFileSync('state/global_status.md', result.global_status);
    console.log('global_status.md updated');
  }

  // Uppdatera work_queue med nya items om det finns
  if (result.work_queue_additions?.length > 0) {
    const additions = result.work_queue_additions
      .map(item => `### ${item.id} — ${item.title}\n**Priority:** ${item.priority}\n**Project:** ${item.project || 'styr-ai'}\n**Description:** ${item.description}`)
      .join('\n\n');

    const currentQueue = styrAi['work_queue'] || '';
    const updatedQueue = currentQueue.replace(
      '## ACTIVE\n*(nothing active)*',
      `## ACTIVE\n*(nothing active)*`
    ) + `\n\n<!-- Auto-added by agent ${new Date().toISOString()} -->\n${additions}`;

    await writeFile('gustavkall', 'styr-ai', 'state/work_queue.md', updatedQueue,
      `agent: add ${result.work_queue_additions.length} work items from gap analysis`);
    console.log(`Added ${result.work_queue_additions.length} work items to queue`);
  }

  // Bygg rapport
  const timestamp = new Date().toISOString();
  const reportLines = [
    `# styr-ai Autonomous Report`,
    `*${timestamp}*`,
    '',
    '## Rapport',
    result.report || '',
    '',
  ];

  if (result.gap_analysis?.length > 0) {
    reportLines.push('## Gap-analys');
    for (const g of result.gap_analysis) {
      reportLines.push(`- **[${g.severity}] ${g.project}**: ${g.gap} → ${g.suggested_action}`);
    }
    reportLines.push('');
  }

  if (result.cross_project_insights?.length > 0) {
    reportLines.push('## Cross-project insikter');
    for (const i of result.cross_project_insights) {
      reportLines.push(`- ${i}`);
    }
    reportLines.push('');
  }

  if (result.work_queue_additions?.length > 0) {
    reportLines.push('## Tillagda work items');
    for (const item of result.work_queue_additions) {
      reportLines.push(`- **${item.id}** [${item.priority}] ${item.project || ''}: ${item.title}`);
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
  console.error('Fatal:', err);
  fs.writeFileSync(
    'state/autonomous_report.md',
    `# styr-ai Autonomous Report\n*${new Date().toISOString()}*\n\n## Fatal error\n\n${err.message}\n\n${err.stack}`
  );
  process.exit(1);
});
