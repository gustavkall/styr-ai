/**
 * Memory Integrity Agent
 * Körs varje söndag 04:00 CET via GitHub Actions
 *
 * Kontrollerar persistent memory-hälsa för alla projekt:
 * - Saknade filer i boot-sekvensen
 * - Föråldrad session_handoff (ej uppdaterad på >7 dagar)
 * - Inkonsistenser mellan CLAUDE.md och faktiska filer i repot
 * - Tomma eller minimala state-filer
 * Skriver rapport + förslag på åtgärder
 */

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const PROJECTS = [
  { owner: 'gustavkall', repo: 'styr-ai' },
  { owner: 'gustavkall', repo: 'savage-roar-music' },
  { owner: 'gustavkall', repo: 'tradesys1337' },
  { owner: 'gustavkall', repo: 'min-analytiker' },
  { owner: 'gustavkall', repo: 'adminassistent' },
];

// Filer som SKA finnas i varje projekt för fullständig persistent memory
const REQUIRED_FILES = [
  'state/session_handoff.md',
  'state/work_queue.md',
  'project_memory/project_context.md',
  'CLAUDE.md',
];

// Extra filer som SKA finnas i styr-ai
const STYRAIS_REQUIRED = [
  'project_memory/goals.md',
  'governance/system_rules.md',
  'governance/approvals.md',
  'governance/architecture_changelog.md',
  'project_memory/cross_project_learnings.md',
];

async function checkFile(owner, repo, filePath) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const res = await fetch(url, {
    headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' },
  });
  if (!res.ok) return { exists: false, size: 0, lastModified: null };
  const data = await res.json();
  return { exists: true, size: data.size, sha: data.sha };
}

async function fetchFile(owner, repo, filePath) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const res = await fetch(url, {
    headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3.raw' },
  });
  if (!res.ok) return null;
  return res.text();
}

async function getLastCommitDate(owner, repo, filePath) {
  const url = `https://api.github.com/repos/${owner}/${repo}/commits?path=${filePath}&per_page=1`;
  const res = await fetch(url, {
    headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data[0]?.commit?.committer?.date || null;
}

async function fetchFileSha(owner, repo, filePath) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const res = await fetch(url, {
    headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.sha || null;
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
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`writeFile failed: ${err}`);
  }
  console.log(`Written: ${filePath}`);
}

async function callClaude(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    }),
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

  for (const project of PROJECTS) {
    const { owner, repo } = project;
    const projectIssues = [];
    const requiredFiles = repo === 'styr-ai'
      ? [...REQUIRED_FILES, ...STYRAIS_REQUIRED]
      : REQUIRED_FILES;

    // Kontrollera att obligatoriska filer finns
    for (const file of requiredFiles) {
      const { exists, size } = await checkFile(owner, repo, file);
      if (!exists) {
        projectIssues.push({ severity: 'HIGH', issue: `Saknad fil: ${file}`, action: `Skapa ${file}` });
      } else if (size < 50) {
        projectIssues.push({ severity: 'MEDIUM', issue: `Tom/minimal fil: ${file} (${size} bytes)`, action: `Fyll i ${file}` });
      }
    }

    // Kontrollera när session_handoff senast uppdaterades
    const lastUpdate = await getLastCommitDate(owner, repo, 'state/session_handoff.md');
    if (lastUpdate) {
      const daysSince = (now - new Date(lastUpdate)) / (1000 * 60 * 60 * 24);
      if (daysSince > 14) {
        projectIssues.push({
          severity: 'MEDIUM',
          issue: `session_handoff.md ej uppdaterad på ${Math.round(daysSince)} dagar`,
          action: 'Kör session boot + close för att uppdatera state'
        });
      }
    }

    // Läs CLAUDE.md och kontrollera att nämnda filer faktiskt finns
    const claudeMd = await fetchFile(owner, repo, 'CLAUDE.md');
    if (claudeMd) {
      const mentionedFiles = [...claudeMd.matchAll(/`([a-z_\/]+\.md)`/g)].map(m => m[1]);
      for (const f of mentionedFiles) {
        const { exists } = await checkFile(owner, repo, f);
        if (!exists && !f.includes('*')) {
          projectIssues.push({
            severity: 'LOW',
            issue: `CLAUDE.md nämner ${f} men filen finns inte`,
            action: `Skapa ${f} eller uppdatera CLAUDE.md`
          });
        }
      }
    }

    projectReports.push({ repo, issues: projectIssues, lastUpdate });
    issues.push(...projectIssues.map(i => ({ ...i, project: repo })));
    console.log(`${repo}: ${projectIssues.length} issues`);
  }

  // Bygg rapport med Claude-analys om det finns issues
  let analysis = '';
  if (issues.filter(i => i.severity === 'HIGH').length > 0) {
    const prompt = `Du är styr-ai memory integrity agent. Analysera dessa minnesläckor och ge konkreta prioriterade åtgärder:

${JSON.stringify(issues, null, 2)}

Skriv en kortfattad analys (max 200 ord) på svenska om vad som är mest kritiskt och varför.`;
    analysis = await callClaude(prompt);
  }

  // Bygg markdown-rapport
  const highCount = issues.filter(i => i.severity === 'HIGH').length;
  const medCount = issues.filter(i => i.severity === 'MEDIUM').length;
  const lowCount = issues.filter(i => i.severity === 'LOW').length;

  const lines = [
    `# Memory Integrity Report`,
    `*${timestamp}*`,
    '',
    `## Sammanfattning`,
    `- HIGH: ${highCount} issues`,
    `- MEDIUM: ${medCount} issues`,
    `- LOW: ${lowCount} issues`,
    '',
  ];

  if (analysis) {
    lines.push('## Analys');
    lines.push(analysis);
    lines.push('');
  }

  for (const pr of projectReports) {
    if (pr.issues.length === 0) {
      lines.push(`## ✅ ${pr.repo} — inga issues`);
    } else {
      lines.push(`## ⚠️ ${pr.repo}`);
      for (const issue of pr.issues) {
        lines.push(`- **[${issue.severity}]** ${issue.issue}`);
        lines.push(`  → *${issue.action}*`);
      }
    }
    lines.push('');
  }

  const report = lines.join('\n');
  await writeFileToGitHub('gustavkall', 'styr-ai', 'state/memory_integrity_report.md',
    report, `agent: memory integrity report ${timestamp.split('T')[0]}`);

  console.log(`Memory Integrity Agent complete. ${highCount} HIGH, ${medCount} MEDIUM, ${lowCount} LOW issues.`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
