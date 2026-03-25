/**
 * Market Regime Agent
 * Körs varje vardag 08:00 CET via GitHub Actions
 *
 * GITHUB_TOKEN har bara access till styr-ai-repot.
 * PAT_TOKEN krävs för att skriva till tradesys1337.
 */

const POLYGON_KEY = process.env.POLYGON_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;       // styr-ai (eget repo)
const PAT_TOKEN = process.env.PAT_TOKEN;             // cross-repo write access

async function fetchPolygon(ticker) {
  const to = new Date().toISOString().split('T')[0];
  const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=desc&limit=5&apiKey=${POLYGON_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Polygon error ${ticker}: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

async function fetchFileSha(owner, repo, filePath, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const res = await fetch(url, {
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.sha || null;
}

async function writeFileToGitHub(owner, repo, filePath, content, message) {
  // Använd PAT_TOKEN för cross-repo, GITHUB_TOKEN för eget repo
  const token = (owner === 'gustavkall' && repo !== 'styr-ai') ? PAT_TOKEN : GITHUB_TOKEN;
  const sha = await fetchFileSha(owner, repo, filePath, token);
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const body = { message, content: Buffer.from(content).toString('base64'), branch: 'main' };
  if (sha) body.sha = sha;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`writeFile failed ${filePath}: ${err}`);
  }
  console.log(`Written: ${filePath}`);
}

function calcRegime(spy, vixy, hyg) {
  const vixyRiskOn = 14;
  const vixyRiskOff = 20;
  const hygRiskOn = 80;
  const hygRiskOff = 78;
  const spyTrend = spy.length >= 2 ? (spy[0].c - spy[spy.length-1].c) / spy[spy.length-1].c * 100 : 0;
  const latestVixy = vixy[0]?.c;
  const latestHyg = hyg[0]?.c;
  const latestSpy = spy[0]?.c;
  let regime = 'NEUTRAL';
  if (latestVixy < vixyRiskOn && latestHyg > hygRiskOn && spyTrend > -1) regime = 'RISK-ON';
  else if (latestVixy > vixyRiskOff || latestHyg < hygRiskOff) regime = 'RISK-OFF';
  return { regime, latestVixy, latestHyg, latestSpy, spyTrend };
}

async function main() {
  console.log('Market Regime Agent starting...');
  const timestamp = new Date().toISOString();
  const dateStr = timestamp.split('T')[0];

  const [spy, vixy, hyg] = await Promise.all([
    fetchPolygon('SPY'),
    fetchPolygon('VIXY'),
    fetchPolygon('HYG'),
  ]);

  const { regime, latestVixy, latestHyg, latestSpy, spyTrend } = calcRegime(spy, vixy, hyg);
  console.log(`Regime: ${regime} | SPY: ${latestSpy} | VIXY: ${latestVixy} | HYG: ${latestHyg}`);

  const regimeEmoji = regime === 'RISK-ON' ? '✅' : regime === 'RISK-OFF' ? '❌' : '⚠️';

  const content = `# Marknadsregim\n*Uppdaterad: ${timestamp}*\n\n## ${regimeEmoji} ${regime}\n\n| Indikator | Värde | Signal |\n|-----------|-------|--------|\n| SPY | $${latestSpy?.toFixed(2)} | 5d trend ${spyTrend > 0 ? '+' : ''}${spyTrend.toFixed(1)}% |\n| VIXY | $${latestVixy?.toFixed(2)} | ${latestVixy < 14 ? 'Låg volatilitet' : latestVixy > 20 ? 'Hög volatilitet' : 'Neutral'} |\n| HYG | $${latestHyg?.toFixed(2)} | ${latestHyg > 80 ? 'Credit ok' : latestHyg < 78 ? 'Credit stress' : 'Neutral'} |\n\n## Implikation för trading\n${regime === 'RISK-ON' ? '- FPS och EMS-setups prioriteras\n- Full position-storlek ok' : ''}${regime === 'RISK-OFF' ? '- FPS Fear Premium-strategi prioriteras\n- Reducera position-storlek' : ''}${regime === 'NEUTRAL' ? '- Selektiv approach\n- Håll position-storlek reducerad' : ''}\n\n## VIXY-kalibrering\n- VIXY < 14 ≈ VIX < 18 → RISK-ON\n- VIXY 14–20 ≈ VIX 18–25 → NEUTRAL\n- VIXY > 20 ≈ VIX > 25 → RISK-OFF\n`;

  await writeFileToGitHub('gustavkall', 'tradesys1337', 'state/market_regime.md', content,
    `agent: market regime ${regime} ${dateStr}`);

  const summary = `# Market Regime Summary\n*${timestamp}*\n\n**${regime}** | SPY $${latestSpy?.toFixed(2)} | VIXY $${latestVixy?.toFixed(2)} | HYG $${latestHyg?.toFixed(2)}`;
  await writeFileToGitHub('gustavkall', 'styr-ai', 'state/market_regime_latest.md', summary,
    `agent: market regime summary ${dateStr}`);

  console.log('Market Regime Agent complete.');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
