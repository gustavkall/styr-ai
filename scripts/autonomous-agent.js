/**
 * styr-ai Autonomous Agent
 * PAT_TOKEN krävs för att läsa från underprojekt.
 */

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const PAT_TOKEN = process.env.PAT_TOKEN;

const SUBPROJECTS = [
  { owner: 'gustavkall', repo: 'savage-roar-music' },
  { owner: 'gustavkall', repo: 'tradesys1337' },
  { owner: 'gustavkall', repo: 'min-analytiker' },
  { owner: 'gustavkall', repo: 'adminassistent' },
];

const SUBPROJECT_FILES = ['project_memory/project_context.md', 'state/session_handoff.md', 'state/work_queue.md', 'project_memory/decisions.md', 'CLAUDE.md'];
const STYRAIS_FILES = ['state/work_queue.md', 'project_memory/goals.md', 'governance/system_rules.md', 'project_memory/cross_project_learnings.md', 'governance/approvals.md'];

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
  if (!res.ok) { console.error(`writeFile failed ${filePath}: ${await res.text()}`); return false; }
  console.log(`Written: ${filePath}`);
  return true;
}

function extractExistingIds(content) {
  if (!content) return new Set();
  const ids = new Set();
  for (const m of content.matchAll(/###\s+([A-Z]+-\d+)/g)) ids.add(m[1]);
  return ids;
}

function parseApprovals(content) {
  if (!content) return { approved: new Set(), rejected: new Set() };
  const approved = new Set(), rejected = new Set();
  for (const line of content.split('\n')) {
    const am = line.match(/^APPROVE:\s*([A-Z]+-\d+)/i);
    const rm = line.match(/^REJECT:\s*([A-Z]+-\d+)/i);
    if (am) approved.add(am[1].toUpperCase());
    if (rm) rejected.add(rm[1].toUpperCase());
  }
  return { approved, rejected };
}

async function callClaude(system, user) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 4000, system, messages: [{ role: 'user', content: user }] }),
  });
  if (!res.ok) throw new Error(`Claude API error: ${await res.text()}`);
  return (await res.json()).content?.[0]?.text || '';
}

function stripFences(raw) { return raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim(); }

async function main() {
  console.log('styr-ai autonomous agent starting...');
  const timestamp = new Date().toISOString();

  const styrAi = {};
  for (const f of STYRAIS_FILES) {
    styrAi[f.split('/').pop().replace('.md','').replace(/-/g,'_')] = await fetchFile('gustavkall', 'styr-ai', f);
  }

  const subprojects = {};
  for (const p of SUBPROJECTS) {
    subprojects[p.repo] = {};
    for (const f of SUBPROJECT_FILES) {
      subprojects[p.repo][f.split('/').pop().replace('.md','').replace(/-/g,'_')] = await fetchFile(p.owner, p.repo, f);
    }
  }

  const { approved, rejected } = parseApprovals(styrAi['approvals']);
  const existingIds = extractExistingIds(styrAi['work_queue']);

  const systemPrompt = `Du är styr-ai. Läs alla projekt mot deras egna mål i project_context.md. Svenska, koncis, analytisk.\n\nGoals:\n${styrAi['goals'] || ''}\n\nSystem rules:\n${styrAi['system_rules'] || ''}\n\nGodkända: ${[...approved].join(', ') || 'inga'} | Avvisade: ${[...rejected].join(', ') || 'inga'}`;

  const subprojectBlob = Object.entries(subprojects).map(([repo, files]) =>
    `## ${repo}\n${Object.entries(files).filter(([,v]) => v).map(([k,v]) => `### ${k}\n${v.slice(0,600)}`).join('\n\n')}`
  ).join('\n\n---\n\n');

  const userPrompt = `State:\n${subprojectBlob}\n\nWork queue:\n${styrAi['work_queue']?.slice(0,800) || ''}\n\nBefintliga IDs (lägg INTE till dessa): ${[...existingIds].join(', ') || 'inga'}\n\nReturnera JSON: {"global_status": str, "gap_analysis": [{project,gap,severity,suggested_action}], "work_queue_additions": [{id,title,priority,description,project}] (max 3, bara nya IDs), "cross_project_insights": [str], "approved_actions": str|null, "report": str (max 400 ord)}\n\nBara giltigt JSON.`;

  const raw = await callClaude(systemPrompt, userPrompt);
  let result;
  try { result = JSON.parse(stripFences(raw)); }
  catch (e) {
    await writeFileToGitHub('gustavkall', 'styr-ai', 'state/autonomous_report.md', `# Autonomous Report\n*${timestamp}*\n\n## Parse failed\n${raw.slice(0,2000)}`, `agent: parse failed`);
    process.exit(0);
  }

  if (result.global_status) await writeFileToGitHub('gustavkall', 'styr-ai', 'state/global_status.md', result.global_status, `agent: global status ${timestamp}`);

  if (result.work_queue_additions?.length > 0) {
    const newItems = result.work_queue_additions.filter(i => !existingIds.has(i.id));
    if (newItems.length > 0) {
      const additions = newItems.map(i => `### ${i.id} — ${i.title}\n**Priority:** ${i.priority}\n**Project:** ${i.project || 'styr-ai'}\n**Description:** ${i.description}`).join('\n\n');
      const currentQueue = await fetchFile('gustavkall', 'styr-ai', 'state/work_queue.md') || '';
      await writeFileToGitHub('gustavkall', 'styr-ai', 'state/work_queue.md', currentQueue + `\n\n<!-- Auto-added ${timestamp} -->\n\n${additions}`, `agent: add ${newItems.length} work items`);
    }
  }

  const lines = [`# styr-ai Autonomous Report`, `*${timestamp}*`, '', '## Rapport', result.report || '', ''];
  if (result.gap_analysis?.length > 0) { lines.push('## Gap-analys'); for (const g of result.gap_analysis) lines.push(`- **[${g.severity}] ${g.project}**: ${g.gap} → *${g.suggested_action}*`); lines.push(''); }
  if (result.cross_project_insights?.length > 0) { lines.push('## Cross-project'); for (const i of result.cross_project_insights) lines.push(`- ${i}`); lines.push(''); }

  await writeFileToGitHub('gustavkall', 'styr-ai', 'state/autonomous_report.md', lines.join('\n'), `agent: report ${timestamp}`);
  console.log('Autonomous agent complete.');
}

main().catch(async (err) => {
  console.error('Fatal:', err);
  await fetch('https://api.github.com/repos/gustavkall/styr-ai/contents/state/autonomous_report.md', {
    method: 'PUT',
    headers: { Authorization: `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'agent: fatal error', content: Buffer.from(`# Autonomous Report\n\n## Fatal\n${err.message}`).toString('base64'), branch: 'main' }),
  }).catch(() => {});
  process.exit(1);
});
