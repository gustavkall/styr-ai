/**
 * Market Regime Agent
 * Körs varje vardag 08:00 CET via GitHub Actions
 *
 * Hämtar SPY, VIX (via VIXY), HYG från Polygon
 * Bedömer marknadsregim: RISK-ON / NEUTRAL / RISK-OFF
 * Skriver till tradesys1337/state/market_regime.md
 * Gustav ser regimbedömning när han vaknar
 */

const POLYGON_KEY = process.env.POLYGON_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function fetchPolygon(ticker) {
  // Hämta senaste 5 dagars data
  const to = new Date().toISOString().split('T')[0];
  const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=desc&limit=5&apiKey=${POLYGON_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Polygon error ${ticker}: ${res.status}`);
  const data = await res.json();
  return data.results || [];
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
    throw new Error(`writeFile failed ${filePath}: ${err}`);
  }
  console.log(`Written: ${filePath}`);
}

function calcRegime(spy, vixy, hyg) {
  // VIXY kalibrering: VIXY ~15 = VIX ~20, VIXY ~20 = VIX ~25, VIXY ~25 = VIX ~30
  // Trösklar kalibrerade för VIXY (inte VIX)
  const vixyRiskOn = 14;   // VIXY < 14 ≈ VIX < 18 = RISK-ON
  const vixyRiskOff = 20;  // VIXY > 20 ≈ VIX > 25 = RISK-OFF
  const hygRiskOn = 80;    // HYG > 80 = credit ok
  const hygRiskOff = 78;   // HYG < 78 = credit stress

  // SPY trend: jämför senaste close mot 5d sedan
  const spyTrend = spy.length >= 2 ? (spy[0].c - spy[spy.length-1].c) / spy[spy.length-1].c * 100 : 0;

  const latestVixy = vixy[0]?.c;
  const latestHyg = hyg[0]?.c;
  const latestSpy = spy[0]?.c;

  let regime = 'NEUTRAL';
  let signals = [];

  if (latestVixy < vixyRiskOn && latestHyg > hygRiskOn && spyTrend > -1) {
    regime = 'RISK-ON';
  } else if (latestVixy > vixyRiskOff || latestHyg < hygRiskOff) {
    regime = 'RISK-OFF';
  }

  if (latestVixy < vixyRiskOn) signals.push(`VIXY ${latestVixy?.toFixed(2)} (låg = lugnt)`);
  else if (latestVixy > vixyRiskOff) signals.push(`VIXY ${latestVixy?.toFixed(2)} (hög = stress)`);
  else signals.push(`VIXY ${latestVixy?.toFixed(2)} (neutral)`);

  if (latestHyg > hygRiskOn) signals.push(`HYG ${latestHyg?.toFixed(2)} (credit ok)`);
  else if (latestHyg < hygRiskOff) signals.push(`HYG ${latestHyg?.toFixed(2)} (credit stress)`);
  else signals.push(`HYG ${latestHyg?.toFixed(2)} (neutral)`);

  signals.push(`SPY ${latestSpy?.toFixed(2)} (5d trend: ${spyTrend > 0 ? '+' : ''}${spyTrend.toFixed(1)}%)`);

  return { regime, signals, latestVixy, latestHyg, latestSpy, spyTrend };
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

  const { regime, signals, latestVixy, latestHyg, latestSpy, spyTrend } = calcRegime(spy, vixy, hyg);

  console.log(`Regime: ${regime}`);
  console.log(`Signals: ${signals.join(', ')}`);

  const regimeEmoji = regime === 'RISK-ON' ? '✅' : regime === 'RISK-OFF' ? '❌' : '⚠️';

  const content = `# Marknadsregim
*Uppdaterad: ${timestamp}*

## ${regimeEmoji} ${regime}

| Indikator | Värde | Signal |
|-----------|-------|--------|
| SPY | $${latestSpy?.toFixed(2)} | 5d trend ${spyTrend > 0 ? '+' : ''}${spyTrend.toFixed(1)}% |
| VIXY | $${latestVixy?.toFixed(2)} | ${latestVixy < 14 ? 'Låg volatilitet' : latestVixy > 20 ? 'Hög volatilitet' : 'Neutral'} |
| HYG | $${latestHyg?.toFixed(2)} | ${latestHyg > 80 ? 'Credit ok' : latestHyg < 78 ? 'Credit stress' : 'Neutral'} |

## Implikation för trading
${regime === 'RISK-ON' ? '- FPS och EMS-setups prioriteras\n- Full position-storlek ok\n- Leta aktier med stark RS vs SPY' : ''}
${regime === 'RISK-OFF' ? '- FPS Fear Premium-strategi prioriteras\n- Reducera position-storlek\n- Undvik nya entries utan stark fundamental katalysator' : ''}
${regime === 'NEUTRAL' ? '- Selektiv approach\n- Håll position-storlek reducerad\n- Vänta på klarare signal' : ''}

## VIXY-kalibrering (obs: VIXY ≠ VIX)
- VIXY < 14 ≈ VIX < 18 → RISK-ON
- VIXY 14–20 ≈ VIX 18–25 → NEUTRAL  
- VIXY > 20 ≈ VIX > 25 → RISK-OFF
`;

  // Skriv till tradesys1337
  await writeFileToGitHub('gustavkall', 'tradesys1337', 'state/market_regime.md', content,
    `agent: market regime ${regime} ${dateStr}`);

  // Skriv även summary till styr-ai för cross-project kontext
  const summary = `# Market Regime Summary\n*${timestamp}*\n\n**${regime}** | SPY $${latestSpy?.toFixed(2)} | VIXY $${latestVixy?.toFixed(2)} | HYG $${latestHyg?.toFixed(2)}`;
  await writeFileToGitHub('gustavkall', 'styr-ai', 'state/market_regime_latest.md', summary,
    `agent: market regime summary ${dateStr}`);

  console.log('Market Regime Agent complete.');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
