/**
 * COO Agent
 * PAT_TOKEN krävs för att läsa från underprojekt.
 */

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const PAT_TOKEN = process.env.PAT_TOKEN;

const SUBPROJECTS = [
  { owner: 'gustavkall', repo: 'savage-roar-music' },
  { owner: 'gustavkall', repo: 'tradesys1337' },
  { owner: 'gustavkall', repo: 'adminassistent' },
];

const STYRAIS_FILES = ['project_memory/goals.md', 'governance/system_rules.md', 'governance/approvals.md', 'project_memory/cross_project_learnings.md', 'state/work_queue.md', 'state/autonomous_report.md', 'state/market_regime_latest.md', 'state/top_gainers_latest.md', 'state/memory_integrity_report.md'];
const SUBPROJECT_FILES = ['project_memory/project_context.md', 'state/session_handoff.md', 'state/work_queue.md'];
const TRADESYS_EXTRA = ['state/market_regime.md', 'state/top_gainers_report.md'];

function getToken(repo) { return repo === 'styr-ai' ? GITHUB_TOKEN : PAT_TOKEN; }

async function fetchFile(owner, repo, filePath) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const res = await fetch(url, { headers: { Authorization: `token ${getToken(repo)}`, Accept: 'application/vnd.github.v3.raw' } });
  if (!res.ok) return null;
  return res.text();
}

async function fetchFileSha(owner, repo, filePath) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const res = await fetch(url, { headers: { Authorization: `token ${getToken(repo)}`, Accept: 'application/vnd.github.v3+json' } });
  if (!res.ok) return null;
  return (await res.json()).sha || null;
}

async function writeFileToGitHub(owner, repo, filePath, content, message) {
  const token = getToken(repo);
  const sha = await fetchFileSha(owner, repo, filePath);
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const body = { message, content: Buffer.from(content).toString('base64'), branch: 'main' };
  if (sha) body.sha = sha;
  const res = await fetch(url, { method: 'PUT', headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`writeFile failed ${filePath}: ${await res.text()}`);
  console.log(`Written: ${filePath}`);
}

function extractExistingApprovals(content) {
  if (!content) return new Set();
  const ids = new Set();
  for (const m of content.matchAll(/^(?:APPROVE|REJECT|PENDING):\s*([A-Z]+-\d+)/gm)) ids.add(m[1]);
  return ids;
}

async function callClaude(system, user) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 4000, system, messages: [{ role: 'user', content: user }] }),
  });
  if (!res.ok) throw new Error(`Claude API error: ${await res.text()}`);
  return (await res.json()).content?.[0]?.text || '';
}

function stripFences(raw) { return raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim(); }

async function main() {
  console.log('COO Agent starting...');
  const timestamp = new Date().toISOString();
  const dateStr = timestamp.split('T')[0];
  const today = new Date();

  const styrAi = {};
  for (const f of STYRAIS_FILES) {
    styrAi[f.split('/').pop().replace('.md','').replace(/-/g,'_')] = await fetchFile('gustavkall', 'styr-ai', f);
  }

  const subprojects = {};
  for (const p of SUBPROJECTS) {
    subprojects[p.repo] = {};
    const files = p.repo === 'tradesys1337' ? [...SUBPROJECT_FILES, ...TRADESYS_EXTRA] : SUBPROJECT_FILES;
    for (const f of files) {
      subprojects[p.repo][f.split('/').pop().replace('.md','').replace(/-/g,'_')] = await fetchFile(p.owner, p.repo, f);
    }
  }

  const systemPrompt = `Du är styr-ai COO. Du orchestrerar alla specialistagenter och rapporterar till Gustav. Testa varje projekt mot dess egna mål. Svenska, koncis, faktabaserad. Eskalera bara saker som kräver Gustavs beslut.\n\nGoals:\n${styrAi['goals'] || ''}\n\nSystem rules:\n${styrAi['system_rules'] || ''}`;

  const subprojectBlob = Object.entries(subprojects).map(([repo, files]) =>
    `## ${repo}\n${Object.entries(files).filter(([,v]) => v).map(([k,v]) => `### ${k}\n${v.slice(0,800)}`).join('\n\n')}`
  ).join('\n\n---\n\n');

  const warnerDeadline = new Date('2026-05-22');
  const daysToWarner = Math.ceil((warnerDeadline - today) / (1000 * 60 * 60 * 24));

  const agentReports = [styrAi['market_regime_latest'] && `## Market Regime\n${styrAi['market_regime_latest']}`, styrAi['top_gainers_latest'] && `## Top Gainers\n${styrAi['top_gainers_latest']}`, styrAi['autonomous_report'] && `## Autonomous\n${styrAi['autonomous_report']?.slice(0,400)}`].filter(Boolean).join('\n\n');

  const userPrompt = `Idag är ${dateStr}. Warner: ${daysToWarner} dagar kvar.\n\nAgent-rapporter:\n${agentReports || '(inga)'}\n\nProjektstate:\n${subprojectBlob}\n\nWork queue:\n${styrAi['work_queue']?.slice(0,600) || ''}\n\nReturnera JSON: {"briefing": str (max 300 ord, med emojis för sektioner), "escalations": [{id,title,urgency,context,suggested_action}], "autonomous_completions": str|null, "health_score": 1-10}\n\nBara giltigt JSON.`;

  const raw = await callClaude(systemPrompt, userPrompt);
  let result;
  try { result = JSON.parse(stripFences(raw)); }
  catch (e) {
    await writeFileToGitHub('gustavkall', 'styr-ai', 'state/daily_briefing.md', `# Daily Briefing — ${dateStr}\n*${timestamp}*\n\n## Parse failed\n${raw.slice(0,2000)}`, `coo: parse failed`);
    process.exit(0);
  }

  const healthBar = '█'.repeat(result.health_score || 0) + '░'.repeat(10 - (result.health_score || 0));
  const briefingLines = [`# 📋 Daily Briefing — ${dateStr}`, `*Genererad av COO-agent ${timestamp}*`, `*Systemhälsa: ${healthBar} ${result.health_score}/10*`, '', result.briefing || '', ''];

  if (result.escalations?.length > 0) {
    briefingLines.push('---', '## 🔴 Eskaleringar — kräver ditt beslut');
    for (const e of result.escalations) {
      const emoji = e.urgency === 'TODAY' ? '🔴' : e.urgency === 'THIS_WEEK' ? '🟡' : '🟢';
      briefingLines.push(`### ${emoji} ${e.title}`, e.context, `**Förslag:** ${e.suggested_action}`, `**Godkänn:** \`APPROVE: ${e.id}\` i governance/approvals.md`, '');
    }
  }
  briefingLines.push('---', `*Nästa briefing: imorgon 06:00 CET*`);

  await writeFileToGitHub('gustavkall', 'styr-ai', 'state/daily_briefing.md', briefingLines.join('\n'), `coo: daily briefing ${dateStr}`);

  if (result.escalations?.length > 0) {
    const existing = extractExistingApprovals(styrAi['approvals'] || '');
    const newOnes = result.escalations.filter(e => !existing.has(e.id));
    if (newOnes.length > 0) {
      const block = newOnes.map(e => `PENDING: ${e.id}  # ${e.title} [${e.urgency}]`).join('\n');
      const updated = (styrAi['approvals'] || '') + `\n\n<!-- COO-agent ${dateStr} -->\n${block}`;
      await writeFileToGitHub('gustavkall', 'styr-ai', 'governance/approvals.md', updated, `coo: ${newOnes.length} escalations ${dateStr}`);
    }
  }

  console.log(`COO Agent complete. Health: ${result.health_score}/10. Escalations: ${result.escalations?.length || 0}`);
}

main().catch(async (err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
