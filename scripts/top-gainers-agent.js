/**
 * Top Gainers Agent v2 — Post-mortem + Pre-move Analysis
 * Körs varje vardag 22:30 CET via GitHub Actions
 *
 * GITHUB_TOKEN har bara access till styr-ai-repot.
 * PAT_TOKEN krävs för att skriva till tradesys1337.
 */

const POLYGON_KEY = process.env.POLYGON_KEY;
const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const PAT_TOKEN = process.env.PAT_TOKEN;

const RATE_LIMIT_DELAY = 13000;
async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchBars(ticker, days = 25) {
  const to = new Date().toISOString().split('T')[0];
  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=${days}&apiKey=${POLYGON_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

async function fetchTopGainers() {
  const url = `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/gainers?apiKey=${POLYGON_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Gainers error: ${res.status}`);
  const data = await res.json();
  return (data.tickers || []).slice(0, 20);
}

async function fetchNews(ticker) {
  const url = `https://api.polygon.io/v2/reference/news?ticker=${ticker}&limit=5&apiKey=${POLYGON_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results || []).map(n => ({ date: n.published_utc?.split('T')[0], title: n.title }));
}

async function fetchMacroBars(days = 25) {
  const [spy, vixy, hyg] = await Promise.all([fetchBars('SPY', days), fetchBars('VIXY', days), fetchBars('HYG', days)]);
  const macro = {};
  for (const bar of spy) { const d = new Date(bar.t).toISOString().split('T')[0]; macro[d] = { spy: bar.c }; }
  for (const bar of vixy) { const d = new Date(bar.t).toISOString().split('T')[0]; if (macro[d]) macro[d].vixy = bar.c; }
  for (const bar of hyg) { const d = new Date(bar.t).toISOString().split('T')[0]; if (macro[d]) macro[d].hyg = bar.c; }
  return macro;
}

function getRegime(macro, date) {
  const m = macro[date];
  if (!m) return 'UNKNOWN';
  if (m.vixy < 14 && m.hyg > 80) return 'RISK-ON';
  if (m.vixy > 20 || m.hyg < 78) return 'RISK-OFF';
  return 'NEUTRAL';
}

async function fetchFundamentals(ticker) {
  if (!ALPHA_VANTAGE_KEY) return null;
  const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${ALPHA_VANTAGE_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  if (data['Note'] || data['Information']) return null;
  return { sector: data.Sector, industry: data.Industry, pe: data.PERatio, eps: data.EPS };
}

function calcEMA(closes, period) {
  if (closes.length < period) return null;
  const k = 2 / (period + 1);
  let ema = closes.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < closes.length; i++) ema = closes[i] * k + ema * (1 - k);
  return ema;
}

function calcRSI(closes, period = 14) {
  if (closes.length < period + 1) return null;
  let gains = 0, losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) gains += diff; else losses -= diff;
  }
  const rs = (gains / period) / (losses / period || 0.001);
  return 100 - 100 / (1 + rs);
}

function calcRelVol(volumes) {
  if (volumes.length < 2) return null;
  const avg = volumes.slice(0, -1).reduce((a, b) => a + b, 0) / (volumes.length - 1);
  return avg > 0 ? volumes[volumes.length - 1] / avg : null;
}

function scoreEntry(bars, daysBeforeMove = 1) {
  const barsToUse = bars.slice(0, bars.length - daysBeforeMove);
  if (barsToUse.length < 10) return null;
  const closes = barsToUse.map(b => b.c);
  const volumes = barsToUse.map(b => b.v);
  const latest = barsToUse[barsToUse.length - 1];
  let score = 0;
  const reasons = [];
  const ema10 = calcEMA(closes, 10);
  const ema20 = calcEMA(closes, 20);
  const rsi = calcRSI(closes);
  const relVol = calcRelVol(volumes);
  if (ema10 && ema20 && latest.c > ema10 && ema10 > ema20) { score++; reasons.push('+1 EMA bullish'); }
  else if (ema10 && latest.c < ema10) { score--; reasons.push('-1 under EMA10'); }
  if (rsi >= 35 && rsi <= 60) { score++; reasons.push(`+1 RSI ${rsi.toFixed(0)}`); }
  else if (rsi > 70) { score--; reasons.push(`-1 RSI överköpt`); }
  if (relVol > 1.5) { score++; reasons.push(`+1 RelVol ${relVol.toFixed(1)}x`); }
  return { score, reasons, rsi: rsi?.toFixed(1), relVol: relVol?.toFixed(2), daysBeforeMove };
}

async function fetchFileSha(owner, repo, filePath, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const res = await fetch(url, { headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' } });
  if (!res.ok) return null;
  return (await res.json()).sha || null;
}

async function writeFileToGitHub(owner, repo, filePath, content, message) {
  const token = (repo !== 'styr-ai') ? PAT_TOKEN : GITHUB_TOKEN;
  const sha = await fetchFileSha(owner, repo, filePath, token);
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const body = { message, content: Buffer.from(content).toString('base64'), branch: 'main' };
  if (sha) body.sha = sha;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`writeFile failed ${filePath}: ${await res.text()}`);
  console.log(`Written: ${filePath}`);
}

async function fetchFile(owner, repo, filePath) {
  const token = (repo !== 'styr-ai') ? PAT_TOKEN : GITHUB_TOKEN;
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const res = await fetch(url, { headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3.raw' } });
  if (!res.ok) return null;
  return res.text();
}

async function callClaude(prompt, maxTokens = 2000) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || '';
}

function extractWatchlist(content) {
  if (!content) return new Set();
  const stopWords = new Set(['THE','AND','FOR','VIA','API','ETF','USD','CET','UTC','SPY','VIX','HYG','SPX','IWM','QQQ','ATR','EMA','RSI','ADX','REL','VOL','BUY','SELL','WAIT','HOLD','HIGH','LOW','MAX','MIN','AVG','FPS','EMS','STS']);
  const tickers = new Set();
  for (const m of content.matchAll(/\b([A-Z]{2,5})\b/g)) {
    if (!stopWords.has(m[1])) tickers.add(m[1]);
  }
  return tickers;
}

async function main() {
  console.log('Top Gainers Agent v2 starting...');
  const timestamp = new Date().toISOString();
  const dateStr = timestamp.split('T')[0];

  const [tradesysHandoff, tradesysWQ] = await Promise.all([
    fetchFile('gustavkall', 'tradesys1337', 'state/session_handoff.md'),
    fetchFile('gustavkall', 'tradesys1337', 'state/work_queue.md'),
  ]);
  const watchlist = new Set([...extractWatchlist(tradesysHandoff), ...extractWatchlist(tradesysWQ)]);
  console.log(`Watchlist size: ${watchlist.size}`);

  const macroBars = await fetchMacroBars(25);
  const todayRegime = getRegime(macroBars, dateStr);
  const macroToday = macroBars[dateStr] || {};
  console.log(`Today regime: ${todayRegime} | SPY: ${macroToday.spy} | VIXY: ${macroToday.vixy} | HYG: ${macroToday.hyg}`);

  await sleep(RATE_LIMIT_DELAY);
  let gainers = [];
  try { gainers = await fetchTopGainers(); console.log(`Gainers: ${gainers.length}`); }
  catch (err) { console.error('Gainers fetch failed:', err.message); }

  const significant = gainers.filter(g => (g.todaysChangePerc || 0) >= 3).slice(0, 8);
  const analyses = [];

  for (const gainer of significant) {
    const ticker = gainer.ticker;
    const changePct = (gainer.todaysChangePerc || 0).toFixed(1);
    const onWatchlist = watchlist.has(ticker);
    console.log(`\nAnalysing ${ticker} +${changePct}%...`);
    await sleep(RATE_LIMIT_DELAY);
    const bars = await fetchBars(ticker, 25);
    if (bars.length < 10) { console.log(`${ticker}: insufficient data, skipping`); continue; }
    const preScores = [1, 3, 5].map(d => scoreEntry(bars, d)).filter(Boolean);
    await sleep(RATE_LIMIT_DELAY);
    const news = await fetchNews(ticker);
    let fundamentals = null;
    if (onWatchlist || preScores.some(s => s.score >= 2)) {
      await sleep(15000);
      fundamentals = await fetchFundamentals(ticker);
    }
    const dayBeforeDate = bars.length > 1 ? new Date(bars[bars.length - 2].t).toISOString().split('T')[0] : null;
    const regimeBeforeMove = dayBeforeDate ? getRegime(macroBars, dayBeforeDate) : 'UNKNOWN';
    analyses.push({ ticker, changePct, onWatchlist, preScores, news, fundamentals, todayRegime, regimeBeforeMove, macroToday });
    console.log(`${ticker}: pre-scores ${preScores.map(s => `${s.daysBeforeMove}d:${s.score}`).join(', ')}`);
  }

  // Claude-analys
  const missed = analyses.filter(a => a.preScores.some(s => s.score >= 2) || a.onWatchlist);
  let claudeAnalysis = '';
  if (missed.length > 0) {
    const prompt = `Du är TRADESYS trading-analytiker. Analysera dessa missade möjligheter och förklara kort per ticker vad som visade förvarning 1-3 dagar före.\n\n${JSON.stringify(missed.map(a => ({ ticker: a.ticker, gain: `+${a.changePct}%`, regimeBeforeMove: a.regimeBeforeMove, preScores: a.preScores.map(s => ({ d: s.daysBeforeMove, score: s.score, reasons: s.reasons })), news: a.news?.slice(0, 2), sector: a.fundamentals?.sector })), null, 2)}\n\nMax 300 ord. Svenska.`;
    claudeAnalysis = await callClaude(prompt);
  }

  // Spara case-filer
  for (const a of analyses) {
    if (a.preScores.length === 0) continue;
    const caseContent = [`# Case: ${a.ticker} ${dateStr}`, `**Gain:** +${a.changePct}%`, `**På watchlist:** ${a.onWatchlist}`, `**Regime före:** ${a.regimeBeforeMove}`, '', '## Pre-move scores', ...a.preScores.map(s => `- **${s.daysBeforeMove}d före:** Score ${s.score} | ${s.reasons.join(', ')}`), '', '## Nyheter', ...a.news.map(n => `- ${n.date}: ${n.title}`), '', `*Auto-genererad ${timestamp}*`].join('\n');
    try {
      await writeFileToGitHub('gustavkall', 'tradesys1337', `project_memory/score_cases/${a.ticker}_${dateStr}_auto.md`, caseContent, `agent: case ${a.ticker} ${dateStr}`);
    } catch (err) { console.error(`Case write failed ${a.ticker}:`, err.message); }
    await sleep(1000);
  }

  // Rapport
  const lines = [`# Top Gainers Rapport — ${dateStr}`, `*${timestamp}*`, '', `## Regime idag: ${todayRegime} | SPY $${macroToday.spy?.toFixed(2)} | VIXY $${macroToday.vixy?.toFixed(2)} | HYG $${macroToday.hyg?.toFixed(2)}`, '', `${significant.length} gainers analyserade. ${missed.length} med pre-score ≥2 eller på watchlist.`, ''];
  for (const a of analyses) {
    const best = a.preScores.reduce((b, s) => s.score > (b?.score || -99) ? s : b, null);
    lines.push(`## ${a.ticker} +${a.changePct}% ${a.onWatchlist ? '(watchlist)' : ''}`);
    lines.push(`Regime före: ${a.regimeBeforeMove} | Best pre-score: ${best?.score || 'n/a'} (${best?.daysBeforeMove || '?'}d före)`);
    if (a.news[0]) lines.push(`Nyhet: ${a.news[0].title}`);
    lines.push('');
  }
  if (claudeAnalysis) { lines.push('## Claude-analys'); lines.push(claudeAnalysis); }

  await writeFileToGitHub('gustavkall', 'tradesys1337', 'state/top_gainers_report.md', lines.join('\n'), `agent: top gainers ${dateStr}`);
  await writeFileToGitHub('gustavkall', 'styr-ai', 'state/top_gainers_latest.md', `# Top Gainers Summary\n*${timestamp}*\n\nRegime: ${todayRegime} | ${significant.length} gainers | ${analyses.length} cases sparade`, `agent: top gainers summary ${dateStr}`);

  console.log('Top Gainers Agent v2 complete.');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
