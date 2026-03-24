/**
 * Top Gainers Agent v2 — Post-mortem + Pre-move Analysis
 * Körs varje vardag 22:30 CET via GitHub Actions
 *
 * För varje top gainer (>3%):
 * 1. Hämtar 20 dagars OHLCV från Polygon (före och inklusive move-dagen)
 * 2. Beräknar alla tekniska indikatorer: EMA10/20/50/200, RSI, ADX, RelVol, Bollinger, ATR
 * 3. Hämtar marknadsregim för samma period: SPY, VIXY, HYG
 * 4. Hämtar nyheter via Polygon news API
 * 5. Hämtar fundamentals via Alpha Vantage
 * 6. Kör ENTRY-score 1-5 dagar INNAN move-dagen — hade modellen sett det?
 * 7. Claude-analys: varför missades det, vad var förvarningarna?
 * 8. Sparar case-fil för modell-träning
 *
 * Fas 2 (predictive): bevakar kandidater på watchlist och flaggar före move
 */

const POLYGON_KEY = process.env.POLYGON_KEY;
const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const RATE_LIMIT_DELAY = 13000; // 13s mellan Polygon-anrop (5 req/min)

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ——— POLYGON HELPERS ———

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
  const url = `https://api.polygon.io/v2/reference/news?ticker=${ticker}&limit=10&apiKey=${POLYGON_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results || []).map(n => ({
    date: n.published_utc?.split('T')[0],
    title: n.title,
    description: n.description?.slice(0, 200),
  }));
}

async function fetchMacroBars(days = 25) {
  // Hämtar SPY, VIXY, HYG för samma period
  const [spy, vixy, hyg] = await Promise.all([
    fetchBars('SPY', days),
    fetchBars('VIXY', days),
    fetchBars('HYG', days),
  ]);
  // Bygg en datumindexerad map
  const macro = {};
  for (const bar of spy) {
    const d = new Date(bar.t).toISOString().split('T')[0];
    macro[d] = { spy: bar.c, spyChange: bar.c - bar.o };
  }
  for (const bar of vixy) {
    const d = new Date(bar.t).toISOString().split('T')[0];
    if (macro[d]) macro[d].vixy = bar.c;
  }
  for (const bar of hyg) {
    const d = new Date(bar.t).toISOString().split('T')[0];
    if (macro[d]) macro[d].hyg = bar.c;
  }
  return macro;
}

function getRegimeForDate(macro, date) {
  const m = macro[date];
  if (!m) return 'UNKNOWN';
  // VIXY-kalibrering: <14=RISK-ON, >20=RISK-OFF
  if (m.vixy < 14 && m.hyg > 80) return 'RISK-ON';
  if (m.vixy > 20 || m.hyg < 78) return 'RISK-OFF';
  return 'NEUTRAL';
}

// ——— ALPHA VANTAGE ———

async function fetchFundamentals(ticker) {
  if (!ALPHA_VANTAGE_KEY) return null;
  const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${ALPHA_VANTAGE_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  if (data['Note'] || data['Information']) return null; // rate limit
  return {
    sector: data.Sector,
    industry: data.Industry,
    marketCap: data.MarketCapitalization,
    pe: data.PERatio,
    eps: data.EPS,
    revenueGrowth: data.QuarterlyRevenueGrowthYOY,
    earningsGrowth: data.QuarterlyEarningsGrowthYOY,
    analystTarget: data.AnalystTargetPrice,
    fiftyTwoWeekHigh: data['52WeekHigh'],
    fiftyTwoWeekLow: data['52WeekLow'],
    description: data.Description?.slice(0, 300),
  };
}

// ——— TEKNISKA INDIKATORER ———

function calcEMA(closes, period) {
  if (closes.length < period) return null;
  const k = 2 / (period + 1);
  let ema = closes.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < closes.length; i++) {
    ema = closes[i] * k + ema * (1 - k);
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
  const rs = (gains / period) / (losses / period || 0.001);
  return 100 - 100 / (1 + rs);
}

function calcADX(bars, period = 14) {
  if (bars.length < period + 1) return null;
  const trs = [], plusDMs = [], minusDMs = [];
  for (let i = 1; i < bars.length; i++) {
    const high = bars[i].h, low = bars[i].l, close = bars[i].c;
    const prevHigh = bars[i-1].h, prevLow = bars[i-1].l, prevClose = bars[i-1].c;
    const tr = Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose));
    const plusDM = high - prevHigh > prevLow - low ? Math.max(high - prevHigh, 0) : 0;
    const minusDM = prevLow - low > high - prevHigh ? Math.max(prevLow - low, 0) : 0;
    trs.push(tr); plusDMs.push(plusDM); minusDMs.push(minusDM);
  }
  const atr = trs.slice(-period).reduce((a, b) => a + b, 0) / period;
  const plusDI = 100 * plusDMs.slice(-period).reduce((a, b) => a + b, 0) / period / (atr || 1);
  const minusDI = 100 * minusDMs.slice(-period).reduce((a, b) => a + b, 0) / period / (atr || 1);
  const dx = 100 * Math.abs(plusDI - minusDI) / (plusDI + minusDI || 1);
  return { adx: dx, diPlus: plusDI, diMinus: minusDI };
}

function calcBollinger(closes, period = 20) {
  if (closes.length < period) return null;
  const slice = closes.slice(-period);
  const mean = slice.reduce((a, b) => a + b, 0) / period;
  const std = Math.sqrt(slice.reduce((a, b) => a + (b - mean) ** 2, 0) / period);
  return { upper: mean + 2 * std, lower: mean - 2 * std, basis: mean };
}

function calcRelVol(volumes) {
  if (volumes.length < 2) return null;
  const avg = volumes.slice(0, -1).reduce((a, b) => a + b, 0) / (volumes.length - 1);
  return avg > 0 ? volumes[volumes.length - 1] / avg : null;
}

function calcATR(bars, period = 14) {
  if (bars.length < period + 1) return null;
  const trs = [];
  for (let i = 1; i < bars.length; i++) {
    trs.push(Math.max(
      bars[i].h - bars[i].l,
      Math.abs(bars[i].h - bars[i-1].c),
      Math.abs(bars[i].l - bars[i-1].c)
    ));
  }
  return trs.slice(-period).reduce((a, b) => a + b, 0) / period;
}

function calcPearsonR(closes, lookback = 20) {
  const slice = closes.slice(-lookback);
  const n = slice.length;
  const x = Array.from({length: n}, (_, i) => i);
  const xMean = (n - 1) / 2;
  const yMean = slice.reduce((a, b) => a + b, 0) / n;
  const num = x.reduce((s, xi, i) => s + (xi - xMean) * (slice[i] - yMean), 0);
  const den = Math.sqrt(x.reduce((s, xi) => s + (xi - xMean) ** 2, 0) * slice.reduce((s, y) => s + (y - yMean) ** 2, 0));
  return den > 0 ? num / den : 0;
}

function buildIndicators(bars) {
  const closes = bars.map(b => b.c);
  const volumes = bars.map(b => b.v);
  const latest = bars[bars.length - 1];

  const ema10 = calcEMA(closes, 10);
  const ema20 = calcEMA(closes, 20);
  const ema50 = calcEMA(closes, 50);
  const ema200 = calcEMA(closes, 200);
  const rsi = calcRSI(closes);
  const adxData = calcADX(bars);
  const bb = calcBollinger(closes);
  const relVol = calcRelVol(volumes);
  const atr = calcATR(bars);
  const pearsonR = calcPearsonR(closes);

  // RS5 vs SPY (approximation — saknar SPY-data här, används i Claude-analysen)
  const change5d = bars.length >= 5
    ? (latest.c - bars[bars.length - 5].c) / bars[bars.length - 5].c * 100
    : null;

  return {
    close: latest.c,
    open: latest.o,
    high: latest.h,
    low: latest.l,
    volume: latest.v,
    ema10: ema10?.toFixed(2),
    ema20: ema20?.toFixed(2),
    ema50: ema50?.toFixed(2),
    ema200: ema200?.toFixed(2),
    rsi: rsi?.toFixed(1),
    adx: adxData?.adx?.toFixed(1),
    diPlus: adxData?.diPlus?.toFixed(1),
    diMinus: adxData?.diMinus?.toFixed(1),
    bollingerUpper: bb?.upper?.toFixed(2),
    bollingerLower: bb?.lower?.toFixed(2),
    bollingerBasis: bb?.basis?.toFixed(2),
    relVol: relVol?.toFixed(2),
    atr: atr?.toFixed(2),
    pearsonR: pearsonR?.toFixed(3),
    change5d: change5d?.toFixed(1),
    todayChange: ((latest.c - latest.o) / latest.o * 100).toFixed(1),
  };
}

// ENTRY-score: körs på 1, 2, 3, 5 dagar INNAN move-dagen
function scoreEntryAtDayN(allBars, daysBeforeMove) {
  const barsToUse = allBars.slice(0, allBars.length - daysBeforeMove);
  if (barsToUse.length < 15) return null;

  const ind = buildIndicators(barsToUse);
  let score = 0;
  const reasons = [];

  const c = parseFloat(ind.close);
  const ema10 = parseFloat(ind.ema10);
  const ema20 = parseFloat(ind.ema20);
  const rsi = parseFloat(ind.rsi);
  const relVol = parseFloat(ind.relVol);
  const diPlus = parseFloat(ind.diPlus);
  const diMinus = parseFloat(ind.diMinus);
  const adx = parseFloat(ind.adx);
  const pearsonR = parseFloat(ind.pearsonR);

  // EMA-stack
  if (ema10 && ema20 && c > ema10 && ema10 > ema20) { score++; reasons.push('+1 EMA bullish'); }
  else if (ema10 && c < ema10) { score--; reasons.push('-1 under EMA10'); }

  // DI/ADX
  if (diPlus && diMinus && adx) {
    if (diPlus > diMinus && adx > 20) { score++; reasons.push('+1 DI+ > DI-, ADX stark'); }
    else if (diMinus > diPlus) { score--; reasons.push('-1 DI- dominerar'); }
  }

  // RSI
  if (rsi >= 35 && rsi <= 60) { score++; reasons.push(`+1 RSI ${rsi} pullback-zon`); }
  else if (rsi > 70) { score--; reasons.push(`-1 RSI ${rsi} överköpt`); }
  else if (rsi < 28) { score--; reasons.push(`-1 RSI ${rsi} översåld`); }

  // Pearson R
  if (pearsonR > 0.8) { score++; reasons.push(`+1 Pearson R ${pearsonR} stark trend`); }
  else if (pearsonR < -0.5) { score--; reasons.push(`-1 Pearson R ${pearsonR} negativ trend`); }

  // RelVol
  if (relVol > 1.5) { score++; reasons.push(`+1 RelVol ${relVol}x`); }
  else if (relVol < 0.5) { score--; reasons.push(`-1 RelVol ${relVol}x låg`); }

  return { score, reasons, indicators: ind, daysBeforeMove };
}

// ——— GITHUB HELPERS ———

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
  if (!res.ok) throw new Error(`writeFile failed: ${await res.text()}`);
}

// ——— CLAUDE ———

async function callClaude(prompt, maxTokens = 2000) {
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
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || '';
}

// ——— WATCHLIST EXTRACTION ———

function extractWatchlist(content) {
  if (!content) return new Set();
  // Matcha explicita ticker-format: ACM, NVDA, etc. Filtrerar ut vanliga ord
  const stopWords = new Set(['THE', 'AND', 'FOR', 'VIA', 'API', 'ETF', 'USD', 'CET', 'UTC',
    'SPY', 'VIX', 'HYG', 'SPX', 'IWM', 'QQQ', 'ATR', 'EMA', 'RSI', 'ADX', 'REL', 'VOL',
    'BUY', 'SELL', 'WAIT', 'HOLD', 'HIGH', 'LOW', 'MAX', 'MIN', 'AVG', 'FPS', 'EMS', 'STS']);
  const matches = content.matchAll(/\b([A-Z]{2,5})\b/g);
  const tickers = new Set();
  for (const m of matches) {
    if (!stopWords.has(m[1])) tickers.add(m[1]);
  }
  return tickers;
}

// ——— MAIN ———

async function main() {
  console.log('Top Gainers Agent v2 starting...');
  const timestamp = new Date().toISOString();
  const dateStr = timestamp.split('T')[0];

  // Hämta watchlist och marknadsregim
  const [tradesysHandoff, tradesysWorkqueue] = await Promise.all([
    fetchFile('gustavkall', 'tradesys1337', 'state/session_handoff.md'),
    fetchFile('gustavkall', 'tradesys1337', 'state/work_queue.md'),
  ]);
  const watchlist = new Set([
    ...extractWatchlist(tradesysHandoff),
    ...extractWatchlist(tradesysWorkqueue),
  ]);
  console.log(`Watchlist size: ${watchlist.size}`);

  // Hämta macro-data för regimkontext
  const macroBars = await fetchMacroBars(25);
  const todayRegime = getRegimeForDate(macroBars, dateStr);
  const macroToday = macroBars[dateStr] || {};
  console.log(`Today regime: ${todayRegime} | SPY: ${macroToday.spy} | VIXY: ${macroToday.vixy} | HYG: ${macroToday.hyg}`);

  // Hämta top gainers
  await sleep(RATE_LIMIT_DELAY);
  let gainers = [];
  try {
    gainers = await fetchTopGainers();
    console.log(`Gainers: ${gainers.length}`);
  } catch (err) {
    console.error('Gainers fetch failed:', err.message);
  }

  const significant = gainers
    .filter(g => (g.todaysChangePerc || 0) >= 3)
    .slice(0, 8); // Max 8 för rate limits

  const analyses = [];

  for (const gainer of significant) {
    const ticker = gainer.ticker;
    const todayChangePct = (gainer.todaysChangePerc || 0).toFixed(1);
    const onWatchlist = watchlist.has(ticker);

    console.log(`\nAnalysing ${ticker} +${todayChangePct}%...`);

    // Hämta 25 dagars bars
    await sleep(RATE_LIMIT_DELAY);
    const bars = await fetchBars(ticker, 25);
    if (bars.length < 10) {
      console.log(`${ticker}: insufficient data, skipping`);
      continue;
    }

    // Bygg indikatorer för move-dagen
    const moveDay = buildIndicators(bars);

    // Kör ENTRY-score 1, 3, 5 dagar INNAN move
    const preScores = [1, 3, 5].map(d => scoreEntryAtDayN(bars, d)).filter(Boolean);

    // Hämta nyheter
    await sleep(RATE_LIMIT_DELAY);
    const news = await fetchNews(ticker);

    // Hämta fundamentals (Alpha Vantage — rate limit, bara för top picks)
    let fundamentals = null;
    if (onWatchlist || preScores.some(s => s.score >= 2)) {
      await sleep(15000); // AV: 5 req/min
      fundamentals = await fetchFundamentals(ticker);
    }

    // Makro för dagen innan move (dag -1)
    const barsBeforeMove = bars.slice(0, -1);
    const dayBeforeDate = barsBeforeMove.length > 0
      ? new Date(barsBeforeMove[barsBeforeMove.length - 1].t).toISOString().split('T')[0]
      : null;
    const regimeBeforeMove = dayBeforeDate ? getRegimeForDate(macroBars, dayBeforeDate) : 'UNKNOWN';
    const macroBeforeMove = dayBeforeDate ? macroBars[dayBeforeDate] : {};

    analyses.push({
      ticker,
      todayChangePct,
      onWatchlist,
      moveDay,
      preScores,
      news: news.slice(0, 5),
      fundamentals,
      todayRegime,
      regimeBeforeMove,
      macroToday,
      macroBeforeMove,
    });

    console.log(`${ticker}: pre-scores ${preScores.map(s => `${s.daysBeforeMove}d: ${s.score}`).join(', ')}`);
  }

  // Claude-analys av alla missar
  const missed = analyses.filter(a => a.preScores.some(s => s.score >= 2) || a.onWatchlist);
  let claudeAnalysis = '';

  if (missed.length > 0) {
    const prompt = `Du är TRADESYS:s trading-analytiker. Analysera dessa missade möjligheter:

${JSON.stringify(missed.map(a => ({
  ticker: a.ticker,
  gain: `+${a.todayChangePct}%`,
  onWatchlist: a.onWatchlist,
  regimeBeforeMove: a.regimeBeforeMove,
  macro: { spy: a.macroBeforeMove?.spy, vixy: a.macroBeforeMove?.vixy, hyg: a.macroBeforeMove?.hyg },
  entryScores: a.preScores.map(s => ({ daysBeforeMove: s.daysBeforeMove, score: s.score, reasons: s.reasons })),
  indicatorsDayBefore: a.preScores[0]?.indicators,
  topNews: a.news?.slice(0, 3),
  sector: a.fundamentals?.sector,
  industry: a.fundamentals?.industry,
  eps: a.fundamentals?.eps,
})), null, 2)}

För varje ticker:
1. Hade ENTRY-modellen kunnat identifiera detta 1-3 dagar före? Varför/varför inte?
2. Vilka indikatorer visade förvarning?
3. Spelade regime (VIX/SPY/HYG) någon roll?
4. Fanns katalysator i nyheterna?
5. Vad borde läggas till i modellen eller på watchlist?

Max 400 ord. Svenska. Strukturerat per ticker.`;

    claudeAnalysis = await callClaude(prompt, 3000);
  }

  // Spara case-filer för modell-träning
  const caseDir = 'project_memory/score_cases';
  for (const a of analyses) {
    if (a.preScores.length === 0) continue;
    const caseContent = [
      `# Case: ${a.ticker} ${dateStr} (Auto-generated)`,
      `**Gain:** +${a.todayChangePct}%`,
      `**På watchlist:** ${a.onWatchlist}`,
      `**Regime dagen innan:** ${a.regimeBeforeMove} | SPY: ${a.macroBeforeMove?.spy} | VIXY: ${a.macroBeforeMove?.vixy} | HYG: ${a.macroBeforeMove?.hyg}`,
      '',
      '## Pre-move scores',
      ...a.preScores.map(s => `- **${s.daysBeforeMove} dag(ar) före:** Score ${s.score}/8 | ${s.reasons.join(', ')}`),
      '',
      '## Indikatorer dagen innan move',
      `| Ind | Värde |`,
      `|-----|-------|`,
      ...Object.entries(a.preScores[0]?.indicators || {}).map(([k, v]) => `| ${k} | ${v} |`),
      '',
      '## Nyheter',
      ...a.news.map(n => `- ${n.date}: ${n.title}`),
      '',
      '## Fundamentals',
      a.fundamentals ? Object.entries(a.fundamentals).map(([k, v]) => `- ${k}: ${v}`).join('\n') : '(ej hämtad)',
      '',
      `*Auto-genererad av top-gainers-agent ${timestamp}*`,
    ].join('\n');

    try {
      await writeFileToGitHub('gustavkall', 'tradesys1337',
        `${caseDir}/${a.ticker}_${dateStr}_auto.md`,
        caseContent,
        `agent: auto case ${a.ticker} ${dateStr}`);
    } catch (err) {
      console.error(`Failed to write case for ${a.ticker}:`, err.message);
    }
    await sleep(1000);
  }

  // Bygg daglig rapport
  const onWL = analyses.filter(a => a.onWatchlist);
  const notOnWL = analyses.filter(a => !a.onWatchlist);
  const highPreScore = analyses.filter(a => a.preScores.some(s => s.score >= 3));

  const lines = [
    `# Top Gainers Rapport — ${dateStr}`,
    `*${timestamp}*`,
    '',
    `## Marknadsregim idag`,
    `**${todayRegime}** | SPY: $${macroToday.spy?.toFixed(2) || 'n/a'} | VIXY: $${macroToday.vixy?.toFixed(2) || 'n/a'} | HYG: $${macroToday.hyg?.toFixed(2) || 'n/a'}`,
    '',
    `## Sammanfattning`,
    `- ${significant.length} gainers >3% analyserade`,
    `- ${onWL.length} på watchlist`,
    `- ${highPreScore.length} hade hög pre-score (modellen borde sett det)`,
    `- ${notOnWL.length} ej på watchlist`,
    '',
  ];

  for (const a of analyses) {
    const bestPreScore = a.preScores.reduce((best, s) => s.score > (best?.score || -99) ? s : best, null);
    lines.push(`## ${a.ticker} +${a.todayChangePct}% ${a.onWatchlist ? '(på watchlist)' : ''}`);
    lines.push(`**Regime före:** ${a.regimeBeforeMove} | **Pre-score bästa:** ${bestPreScore?.score || 'n/a'} (${bestPreScore?.daysBeforeMove || '?'}d före)`);
    lines.push(`**Indikatorer dagen innan:** RSI ${a.preScores[0]?.indicators?.rsi} | RelVol ${a.preScores[0]?.indicators?.relVol}x | ADX ${a.preScores[0]?.indicators?.adx}`);
    if (a.news.length > 0) lines.push(`**Nyhet:** ${a.news[0]?.title}`);
    if (a.fundamentals?.sector) lines.push(`**Sektor:** ${a.fundamentals.sector}`);
    lines.push('');
  }

  if (claudeAnalysis) {
    lines.push('## Claude-analys: vad försvånn modellen?');
    lines.push(claudeAnalysis);
    lines.push('');
  }

  lines.push('## Case-filer sparade');
  lines.push(`${analyses.length} case-filer skrivna till tradesys1337/project_memory/score_cases/ för modell-träning.`);

  const report = lines.join('\n');
  await writeFileToGitHub('gustavkall', 'tradesys1337', 'state/top_gainers_report.md',
    report, `agent: top gainers ${dateStr}`);

  await writeFileToGitHub('gustavkall', 'styr-ai', 'state/top_gainers_latest.md',
    `# Top Gainers Summary\n*${timestamp}*\n\nRegime: ${todayRegime} | ${significant.length} gainers | ${highPreScore.length} hade hög pre-score | ${analyses.length} cases sparade`,
    `agent: top gainers summary ${dateStr}`);

  console.log('Top Gainers Agent v2 complete.');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
