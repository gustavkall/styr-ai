/**
 * COO Agent — Chief Operating Officer
 * Körs 06:00 CET varje vardag via GitHub Actions
 *
 * Orchestrerar alla specialistagenter:
 * 1. Läser output från market-regime, top-gainers, memory-integrity
 * 2. Läser state från alla underprojekt
 * 3. Bedömer mot goals.md och varje projekts project_context.md
 * 4. Skriver daglig briefing: state/daily_briefing.md
 * 5. Eskalerar beslut som kräver Gustav till governance/approvals.md
 *
 * Gustav läser daily_briefing.md på morgonen — en fil, allt han behöver veta.
 */

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const SUBPROJECTS = [
  { owner: 'gustavkall', repo: 'savage-roar-music' },
  { owner: 'gustavkall', repo: 'tradesys1337' },
  { owner: 'gustavkall', repo: 'adminassistent' },
];

// Filer att läsa från styr-ai
const STYRAIS_FILES = [
  'project_memory/goals.md',
  'governance/system_rules.md',
  'governance/approvals.md',
  'project_memory/cross_project_learnings.md',
  'state/work_queue.md',
  // Specialistagenters rapporter
  'state/autonomous_report.md',
  'state/market_regime_latest.md',
  'state/top_gainers_latest.md',
  'state/memory_integrity_report.md',
];

// Filer att läsa från varje underprojekt
const SUBPROJECT_FILES = [
  'project_memory/project_context.md',
  'state/session_handoff.md',
  'state/work_queue.md',
];

// Extra filer från tradesys
const TRADESYS_EXTRA = [
  'state/market_regime.md',
  'state/top_gainers_report.md',
];

async function fetchFile(owner, repo, filePath) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const res = await fetch(url, {
    headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3.raw' },
  });
  if (!res.ok) return null;
  return res.text();
}

async function fetchFileSha(owner, repo, filePath) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const res = await fetch(url, {
    headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' },
  });
  if (!res.ok) return null;
  return (await res.json()).sha || null;
}

async function writeFileToGitHub(owner, repo, filePath, content, message) {
  const sha = await fetchFileSha(owner, repo, filePath);
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const body = { message, content: Buffer.from(content).toString('base64'), branch: 'main' };
  if (sha) body.sha = sha;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`writeFile failed ${filePath}: ${await res.text()}`);
  console.log(`Written: ${filePath}`);
}

async function callClaude(system, user, maxTokens = 4000) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });
  if (!res.ok) throw new Error(`Claude API error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content?.[0]?.text || '';
}

function stripFences(raw) {
  return raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
}

// Extrahera befintliga approvals för att undvika dubbletter
function extractExistingApprovals(content) {
  if (!content) return new Set();
  const ids = new Set();
  const matches = content.matchAll(/^(?:APPROVE|REJECT|PENDING):\s*([A-Z]+-\d+)/gm);
  for (const m of matches) ids.add(m[1]);
  return ids;
}

async function main() {
  console.log('COO Agent starting...');
  const timestamp = new Date().toISOString();
  const dateStr = timestamp.split('T')[0];
  const today = new Date();

  // --- LÄS ALL STATE ---

  // styr-ai egna filer
  const styrAi = {};
  for (const f of STYRAIS_FILES) {
    const key = f.split('/').pop().replace('.md', '').replace(/-/g, '_');
    styrAi[key] = await fetchFile('gustavkall', 'styr-ai', f);
    console.log(`styr-ai/${f}: ${styrAi[key] ? 'ok' : 'missing'}`);
  }

  // Underprojekt
  const subprojects = {};
  for (const p of SUBPROJECTS) {
    subprojects[p.repo] = {};
    const files = p.repo === 'tradesys1337'
      ? [...SUBPROJECT_FILES, ...TRADESYS_EXTRA]
      : SUBPROJECT_FILES;
    for (const f of files) {
      const key = f.split('/').pop().replace('.md', '').replace(/-/g, '_');
      subprojects[p.repo][key] = await fetchFile(p.owner, p.repo, f);
    }
  }

  // --- BYGG KONTEXT FÖR CLAUDE ---

  const systemPrompt = `Du är styr-ai COO — Chief Operating Officer.

Din roll: Du orchestrerar alla specialistagenter och har operativt ansvar för att alla projekt rör sig mot sina mål.
Du tänker som en erfaren COO på ett startup — fokus på execution, blockers och prioritering.
Du rapporterar direkt till Gustav (grundaren) som fattar strategiska beslut.

Dina mål:
${styrAi['goals'] || '(ej tillgänglig)'}

Autonomigränser:
${styrAi['system_rules'] || '(ej tillgänglig)'}

Cross-project learnings:
${styrAi['cross_project_learnings'] || '(ej tillgänglig)'}

Du skriver alltid på svenska. Koncis, direkt, faktabaserad.
Du presenterar problem med förslag på lösning — inte bara problem.
Du eskalerar BARA saker som faktiskt kräver Gustavs beslut.`;

  const subprojectBlob = Object.entries(subprojects).map(([repo, files]) => {
    const context = files['project_context'] ? `### Projektets mål\n${files['project_context']}\n` : '';
    const rest = Object.entries(files)
      .filter(([k, v]) => v && k !== 'project_context')
      .map(([k, v]) => `### ${k}\n${v.slice(0, 800)}`) // Truncate för token-budget
      .join('\n\n');
    return `## ${repo}\n${context}\n${rest}`;
  }).join('\n\n---\n\n');

  const agentReports = [
    styrAi['market_regime_latest'] ? `## Market Regime\n${styrAi['market_regime_latest']}` : '',
    styrAi['top_gainers_latest'] ? `## Top Gainers\n${styrAi['top_gainers_latest']}` : '',
    styrAi['memory_integrity_report'] ? `## Memory Integrity\n${styrAi['memory_integrity_report']?.slice(0, 600)}` : '',
    styrAi['autonomous_report'] ? `## Autonomous Agent\n${styrAi['autonomous_report']?.slice(0, 600)}` : '',
  ].filter(Boolean).join('\n\n');

  // Warner deadline countdown
  const warnerDeadline = new Date('2026-05-22');
  const daysToWarner = Math.ceil((warnerDeadline - today) / (1000 * 60 * 60 * 24));

  const userPrompt = `Idag är ${dateStr}. Här är fullständig operativ status.

## Specialistagenters rapporter (från igår/natten)
${agentReports || '(inga rapporter tillgängliga ännu)'}

---

## Projektstate
${subprojectBlob}

---

## styr-ai work_queue
${styrAi['work_queue']?.slice(0, 1000) || '(ej tillgänglig)'}

---

## Kritiska datum
- Warner cure period: ${daysToWarner} dagar kvar (22 maj 2026)

---

Som COO: analysera all denna information och returnera JSON med dessa nycklar:

1. "briefing": Gustavs dagliga briefing. Max 300 ord. Format:
   - 📊 Marknadsregim + trading-implikation (1 mening)
   - 🎵 Savage Roar status (1-2 meningar, bara om något hänt)
   - 📈 Trading: om top gainers rapporten finns — missade möjligheter
   - ⚠️ Vad kräver handling idag (max 3 punkter)
   - ✅ Vad systemet gjort autonomt sedan igår

2. "escalations": Array med saker som kräver Gustavs beslut. Format:
   [{id, title, urgency: "TODAY"|"THIS_WEEK"|"WHEN_CONVENIENT", context, suggested_action}]
   Eskalera BARA om det faktiskt kräver Gustavs beslut — inte saker systemet kan lösa självt.

3. "autonomous_completions": Vad COO-agenten faktiskt exekverade denna körning inom autonomigränserna, eller null.

4. "health_score": Systemets övergripande hälsa 1-10 baserat på om projekten rör sig mot sina mål.

Returnera ENDAST giltigt JSON. Börja med { och avsluta med }.`;

  console.log('Calling Claude COO...');
  const raw = await callClaude(systemPrompt, userPrompt);
  console.log('Response length:', raw.length);

  let result;
  try {
    result = JSON.parse(stripFences(raw));
  } catch (e) {
    console.error('Parse failed:', raw.slice(0, 500));
    await writeFileToGitHub('gustavkall', 'styr-ai', 'state/daily_briefing.md',
      `# Daily Briefing — ${dateStr}\n*${timestamp}*\n\n## Parse failed\n\n${raw.slice(0, 2000)}`,
      `coo: parse failed ${dateStr}`);
    process.exit(0);
  }

  // --- BYGG DAGLIG BRIEFING ---

  const healthBar = '█'.repeat(result.health_score || 0) + '░'.repeat(10 - (result.health_score || 0));

  const briefingLines = [
    `# 📋 Daily Briefing — ${dateStr}`,
    `*Genererad av COO-agent ${timestamp}*`,
    `*Systemhälsa: ${healthBar} ${result.health_score}/10*`,
    '',
    result.briefing || '',
    '',
  ];

  if (result.escalations?.length > 0) {
    briefingLines.push('---');
    briefingLines.push('## 🔴 Eskaleringar — kräver ditt beslut');
    for (const e of result.escalations) {
      const urgencyEmoji = e.urgency === 'TODAY' ? '🔴' : e.urgency === 'THIS_WEEK' ? '🟡' : '🟢';
      briefingLines.push(`### ${urgencyEmoji} ${e.title}`);
      briefingLines.push(e.context);
      briefingLines.push(`**Förslag:** ${e.suggested_action}`);
      briefingLines.push(`**Godkänn:** Lägg till \`APPROVE: ${e.id}\` i governance/approvals.md`);
      briefingLines.push('');
    }
  }

  if (result.autonomous_completions) {
    briefingLines.push('---');
    briefingLines.push('## ✅ Autonomt exekverat');
    briefingLines.push(typeof result.autonomous_completions === 'string'
      ? result.autonomous_completions
      : JSON.stringify(result.autonomous_completions));
    briefingLines.push('');
  }

  briefingLines.push('---');
  briefingLines.push(`*Nästa briefing: imorgon 06:00 CET*`);
  briefingLines.push(`*Rapporter: market_regime.md | top_gainers_report.md | autonomous_report.md*`);

  const briefingContent = briefingLines.join('\n');

  // Skriv briefing
  await writeFileToGitHub('gustavkall', 'styr-ai', 'state/daily_briefing.md',
    briefingContent, `coo: daily briefing ${dateStr}`);

  // Uppdatera approvals.md med nya eskaleringar om de inte redan finns
  if (result.escalations?.length > 0) {
    const currentApprovals = styrAi['approvals'] || '';
    const existingIds = extractExistingApprovals(currentApprovals);
    const newEscalations = result.escalations.filter(e => !existingIds.has(e.id));

    if (newEscalations.length > 0) {
      const escalationBlock = newEscalations
        .map(e => `PENDING: ${e.id}  # ${e.title} [${e.urgency}]`)
        .join('\n');
      const updatedApprovals = currentApprovals +
        `\n\n<!-- COO-agent ${dateStr} -->\n${escalationBlock}`;
      await writeFileToGitHub('gustavkall', 'styr-ai', 'governance/approvals.md',
        updatedApprovals, `coo: add ${newEscalations.length} escalations ${dateStr}`);
      console.log(`Added ${newEscalations.length} escalations to approvals.md`);
    }
  }

  console.log(`COO Agent complete. Health score: ${result.health_score}/10`);
  console.log(`Escalations: ${result.escalations?.length || 0}`);
}

main().catch(async (err) => {
  console.error('Fatal:', err);
  const timestamp = new Date().toISOString();
  await fetch(
    `https://api.github.com/repos/gustavkall/styr-ai/contents/state/daily_briefing.md`,
    {
      method: 'PUT',
      headers: { Authorization: `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `coo: fatal error ${timestamp}`,
        content: Buffer.from(`# Daily Briefing\n*${timestamp}*\n\n## Fatal error\n\n${err.message}`).toString('base64'),
        branch: 'main',
      }),
    }
  ).catch(() => {});
  process.exit(1);
});
