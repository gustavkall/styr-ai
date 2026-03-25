/**
 * Memory Integrity Agent
 * Körs varje söndag 04:00 CET via GitHub Actions
 * PAT_TOKEN krävs för att läsa/skriva till underprojekt.
 */

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const PAT_TOKEN = process.env.PAT_TOKEN;

const PROJECTS = [
  { owner: 'gustavkall', repo: 'styr-ai' },
  { owner: 'gustavkall', repo: 'savage-roar-music' },
  { owner: 'gustavkall', repo: 'tradesys1337' },
  { owner: 'gustavkall', repo: 'adminassistent' },
];

const REQUIRED_FILES = ['state/session_handoff.md', 'state/work_queue.md', 'project_memory/project_context.md', 'CLAUDE.md'];
const STYRAIS_REQUIRED = ['project_memory/goals.md', 'governance/system_rules.md', 'governance/approvals.md', 'governance/architecture_changelog.md', 'project_memory/cross_project_learnings.md'];

function getToken(repo) { return repo === 'styr-ai' ? GITHUB_TOKEN : PAT_TOKEN; }

async function checkFile(owner, repo, filePath) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const res = await fetch(url, { headers: { Authorization: `token ${getToken(repo)}`, Accept: 'application/vnd.github.v3+json' } });
  if (!res.ok) return { exists: false, size: 0 };
  const data = await res.json();
  return { exists: true, size: data.size };
}

async function getLastCommitDate(owner, repo, filePath) {
  const url = `https://api.github.com/repos/${owner}/${repo}/commits?path=${filePath}&per_page=1`;
  const res = await fetch(url, { headers: { Authorization: `token ${getToken(repo)}`, Accept: 'application/vnd.github.v3+json' } });
  if (!res.ok) return null;
  const data = await res.json();
  return data[0]?.commit?.committer?.date || null;
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
  if (!res.ok) throw new Error(`writeFile failed: ${await res.text()}`);
  console.log(`Written: ${filePath}`);
}

async function callClaude(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || '';
}

async function main() {
  console.log('Memory Integrity Agent starting...');
  const timestamp = new Date().toISOString();
  const now = new Date();
  const issues = [];
  const projectReports = [];

  for (const { owner, repo } of PROJECTS) {
    const projectIssues = [];
    const required = repo === 'styr-ai' ? [...REQUIRED_FILES, ...STYRAIS_REQUIRED] : REQUIRED_FILES;
    for (const file of required) {
      const { exists, size } = await checkFile(owner, repo, file);
      if (!exists) projectIssues.push({ severity: 'HIGH', issue: `Saknad fil: ${file}`, action: `Skapa ${file}` });
      else if (size < 50) projectIssues.push({ severity: 'MEDIUM', issue: `Tom fil: ${file} (${size} bytes)`, action: `Fyll i ${file}` });
    }
    const lastUpdate = await getLastCommitDate(owner, repo, 'state/session_handoff.md');
    if (lastUpdate) {
      const daysSince = (now - new Date(lastUpdate)) / (1000 * 60 * 60 * 24);
      if (daysSince > 14) projectIssues.push({ severity: 'MEDIUM', issue: `session_handoff.md ej uppdaterad på ${Math.round(daysSince)} dagar`, action: 'Kör session close' });
    }
    projectReports.push({ repo, issues: projectIssues });
    issues.push(...projectIssues.map(i => ({ ...i, project: repo })));
    console.log(`${repo}: ${projectIssues.length} issues`);
  }

  const highCount = issues.filter(i => i.severity === 'HIGH').length;
  const medCount = issues.filter(i => i.severity === 'MEDIUM').length;

  let analysis = '';
  if (highCount > 0) {
    analysis = await callClaude(`Analysera dessa minnesläckor och ge prioriterade åtgärder (max 150 ord, svenska):\n${JSON.stringify(issues.filter(i => i.severity === 'HIGH'), null, 2)}`);
  }

  const lines = [`# Memory Integrity Report`, `*${timestamp}*`, '', `## Sammanfattning`, `- HIGH: ${highCount}`, `- MEDIUM: ${medCount}`, ''];
  if (analysis) { lines.push('## Analys'); lines.push(analysis); lines.push(''); }
  for (const pr of projectReports) {
    if (pr.issues.length === 0) lines.push(`## ✅ ${pr.repo} — inga issues`);
    else { lines.push(`## ⚠️ ${pr.repo}`); for (const i of pr.issues) { lines.push(`- **[${i.severity}]** ${i.issue}`); lines.push(`  → *${i.action}*`); } }
    lines.push('');
  }

  await writeFileToGitHub('gustavkall', 'styr-ai', 'state/memory_integrity_report.md', lines.join('\n'), `agent: memory integrity ${timestamp.split('T')[0]}`);
  console.log(`Memory Integrity Agent complete. ${highCount} HIGH, ${medCount} MEDIUM.`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
