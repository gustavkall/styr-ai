/**
 * Top Gainers / Missed Opportunities Agent
 * Körs varje vardag 22:30 CET via GitHub Actions
 *
 * 1. Hämtar dagens top gainers från Polygon (>5% gain, vol >1.5x)
 * 2. Filtrerar mot TRADESYS watchlist
 * 3. Kör ENTRY-score på varje gainer (10 dagars historik)
 * 4. Identifierar: på watchlist (missad signal?) vs ej på watchlist (missad ticker?)
 * 5. Skriver rapport: "Du missade dessa idag — här är varför enligt modellen"
 */

const POLYGON_KEY = process.env.POLYGON_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function fetchPolygonBars(ticker, days = 15) {
  const to = new Date().toISOString().split('T')[0];
  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=desc&limit=${days}&apiKey=${POLYGON_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

async function fetchTopGainers() {
  // Polygon Snapshot — alla tickers med störst uppgång idag
  const url = `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/gainers?apiKey=${POLYGON_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Polygon gainers error: ${res.status}`);
  const data = await res.json();
  return (data.tickers || []).slice(0, 20); // Top 20
}

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
}

// Förenklad ENTRY-score utan TV-indikatorer
// Beräknar EMA + RSI + trend från rå OHLCV-data
function calcEMA(prices, period) {
  const k = 2 / (period + 1);
  let ema = prices[prices.length - period];
  for (let i = prices.length - period + 1; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }
  return ema;
}

function calcRSI(closes, period = 14) {
  if (closes.length < period + 1) return null;
  let gains = 0, losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) gains += diff;
    else losses -= diff;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function calcRelVol(volumes) {
  if (volumes.length < 2) return null;
  const avgVol = volumes.slice(1).reduce((a, b) => a + b, 0) / (volumes.length - 1);
  return avgVol > 0 ? volumes[0] / avgVol : null;
}

function scoreEntry(bars) {
  if (!bars || bars.length < 10) return { score: 0, reasons: ['otillräcklig data'] };

  // Bars är sorterade desc (senaste först)
  const closes = bars.map(b => b.c).reverse();
  const volumes = bars.map(b => b.v);

  const latest = bars[0];
  const score_reasons = [];
  let score = 0;

  // EMA-stack
  const ema10 = closes.length >= 10 ? calcEMA(closes, 10) : null;
  const ema20 = closes.length >= 20 ? calcEMA(closes, 20) : null;
  const ema50 = closes.length >= 50 ? calcEMA(closes, 50) : null;

  if (ema10 && ema20 && latest.c > ema10 && ema10 > ema20) {
    score++; score_reasons.push('+1 EMA bullish stack');
  } else if (ema10 && latest.c < ema10) {
    score--; score_reasons.push('-1 pris under EMA10');
  }

  // RSI
  const rsi = calcRSI(closes);
  if (rsi) {
    if (rsi >= 35 && rsi <= 65) { score++; score_reasons.push(`+1 RSI ${rsi.toFixed(0)} ok zon`); }
    else if (rsi > 70) { score--; score_reasons.push(`-1 RSI ${rsi.toFixed(0)} överköpt`); }
    else if (rsi < 30) { score--; score_reasons.push(`-1 RSI ${rsi.toFixed(0)} översåld`); }
  }

  // RelVol
  const relVol = calcRelVol(volumes);
  if (relVol) {
    if (relVol > 1.5) { score++; score_reasons.push(`+1 RelVol ${relVol.toFixed(1)}x`); }
    else if (relVol < 0.7) { score--; score_reasons.push(`-1 RelVol ${relVol.toFixed(1)}x (låg)`); }
  }

  // Dagens rörelse
  const todayChange = (latest.c - latest.o) / latest.o * 100;
  if (todayChange > 5) score_reasons.push(`Dagens uppgång: +${todayChange.toFixed(1)}%`);

  return { score, reasons: score_reasons, rsi: rsi?.toFixed(0), relVol: relVol?.toFixed(2), ema10: ema10?.toFixed(2) };
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

// Extrahera watchlist-tickers från TRADESYS session_handoff eller work_queue
function extractWatchlist(handoffContent) {
  if (!handoffContent) return new Set();
  // Matcha tickers som nämns i uppercase (3-5 bokstäver)
  const matches = handoffContent.matchAll(/\b([A-Z]{2,5})\b/g);
  const tickers = new Set();
  for (const m of matches) {
    if (m[1].length >= 2 && m[1].length <= 5 && !['THE', 'AND', 'FOR', 'VIA', 'API'].includes(m[1])) {
      tickers.add(m[1]);
    }
  }
  return tickers;
}

async function main() {
  console.log('Top Gainers Agent starting...');
  const timestamp = new Date().toISOString();
  const dateStr = timestamp.split('T')[0];

  // Hämta TRADESYS watchlist från state
  const tradesysHandoff = await fetchFile('gustavkall', 'tradesys1337', 'state/session_handoff.md');
  const watchlist = extractWatchlist(tradesysHandoff);
  console.log(`Watchlist tickers found: ${watchlist.size}`);

  // Hämta dagens top gainers
  let gainers;
  try {
    gainers = await fetchTopGainers();
    console.log(`Top gainers fetched: ${gainers.length}`);
  } catch (err) {
    console.error('Failed to fetch gainers:', err.message);
    gainers = [];
  }

  // Filtrera: min 3% gain, hämta bars för varje
  const significant = gainers.filter(g => {
    const change = g.todaysChangePerc || 0;
    return change >= 3;
  }).slice(0, 10);

  const results = [];

  for (const gainer of significant) {
    const ticker = gainer.ticker;
    const change = (gainer.todaysChangePerc || 0).toFixed(1);
    const onWatchlist = watchlist.has(ticker);

    // Hämta historik
    await new Promise(r => setTimeout(r, 12000)); // Rate limit: 5 req/min
    const bars = await fetchPolygonBars(ticker, 15);
    const { score, reasons, rsi, relVol } = scoreEntry(bars);

    results.push({ ticker, change, onWatchlist, score, reasons, rsi, relVol });
    console.log(`${ticker}: +${change}% | score ${score} | watchlist: ${onWatchlist}`);
  }

  // Sortera: missar först (hög score men inte handlad), sedan övriga
  const onWatchlistMissed = results.filter(r => r.onWatchlist && r.score >= 2);
  const notOnWatchlist = results.filter(r => !r.onWatchlist && r.score >= 2);
  const lowScore = results.filter(r => r.score < 2);

  // Claude-analys av missar
  let analysis = '';
  if (onWatchlistMissed.length > 0 || notOnWatchlist.length > 0) {
    const prompt = `Du är TRADESYS trading analyst. Analysera dessa missed opportunities:

På watchlist men missad signal:
${JSON.stringify(onWatchlistMissed, null, 2)}

Ej på watchlist men stark setup:
${JSON.stringify(notOnWatchlist, null, 2)}

För varje ticker: varför missade ENTRY-modellen det, och vad bör läggas till på watchlist?
Max 300 ord. Svenska.`;
    analysis = await callClaude(prompt);
  }

  // Bygg rapport
  const lines = [
    `# Top Gainers Rapport — ${dateStr}`,
    `*${timestamp}*`,
    '',
    `## Sammanfattning`,
    `- ${significant.length} significanta gainers (>3%) idag`,
    `- ${onWatchlistMissed.length} på watchlist med missad BUY-signal`,
    `- ${notOnWatchlist.length} ej på watchlist men stark setup`,
    '',
  ];

  if (onWatchlistMissed.length > 0) {
    lines.push('## På watchlist — missad signal');
    for (const r of onWatchlistMissed) {
      lines.push(`### ${r.ticker} +${r.change}% | Score: ${r.score}`);
      lines.push(`- RSI: ${r.rsi} | RelVol: ${r.relVol}x`);
      lines.push(`- Score reasons: ${r.reasons.join(', ')}`);
    }
    lines.push('');
  }

  if (notOnWatchlist.length > 0) {
    lines.push('## Ej på watchlist — bör läggas till?');
    for (const r of notOnWatchlist) {
      lines.push(`### ${r.ticker} +${r.change}% | Score: ${r.score}`);
      lines.push(`- RSI: ${r.rsi} | RelVol: ${r.relVol}x`);
      lines.push(`- Score reasons: ${r.reasons.join(', ')}`);
    }
    lines.push('');
  }

  if (analysis) {
    lines.push('## Analys');
    lines.push(analysis);
    lines.push('');
  }

  if (lowScore.length > 0) {
    lines.push('## Övriga gainers (låg score — momentum utan fundamental)');
    lines.push(lowScore.map(r => `${r.ticker} +${r.change}% (score ${r.score})`).join(', '));
    lines.push('');
  }

  const report = lines.join('\n');

  // Skriv till tradesys1337
  await writeFileToGitHub('gustavkall', 'tradesys1337', 'state/top_gainers_report.md',
    report, `agent: top gainers ${dateStr}`);

  // Skriv kopia till styr-ai
  await writeFileToGitHub('gustavkall', 'styr-ai', 'state/top_gainers_latest.md',
    `# Top Gainers Summary\n*${timestamp}*\n\n${significant.length} gainers analyserade. ${onWatchlistMissed.length} missade signals på watchlist. ${notOnWatchlist.length} nya kandidater identifierade.`,
    `agent: top gainers summary ${dateStr}`);

  console.log('Top Gainers Agent complete.');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
