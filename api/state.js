import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  try {
    const [sessionRes, decisionsRes, learningsRes] = await Promise.all([
      sb.from('sessions').select('*').order('session_date', { ascending: false }).limit(1).single(),
      sb.from('decisions').select('*').order('decision_date', { ascending: false }),
      sb.from('learnings').select('*').order('created_at', { ascending: false }),
    ]);

    const session = sessionRes.data || null;
    const decisions = decisionsRes.data || [];
    const learnings = learningsRes.data || [];

    const activeDecisions = decisions.filter(d => d.status === 'ACTIVE');
    const closedDecisions = decisions.filter(d => d.status === 'CLOSED');

    res.status(200).json({
      ok: true,
      generated: new Date().toISOString(),
      lastSession: session ? {
        date: session.session_date,
        summary: session.summary,
        changes: session.changes,
        metadata: session.metadata,
        decisions: session.decisions,
        nextSteps: session.next_steps,
        version: session.system_version,
      } : null,
      decisions: {
        active: activeDecisions,
        closed: closedDecisions,
        total: decisions.length,
      },
      learnings: {
        items: learnings,
        total: learnings.length,
        byCategory: learnings.reduce((acc, l) => {
          acc[l.category] = (acc[l.category] || 0) + 1;
          return acc;
        }, {}),
      },
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
