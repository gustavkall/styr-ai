#!/usr/bin/env node
/**
 * Seed Supabase memory tables with initial data.
 * Run once after creating tables: source .env && node scripts/seed.js
 */
const { createClient } = require('@supabase/supabase-js');

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_ANON_KEY;
if (!SB_URL || !SB_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment');
  console.error('Run: source .env && node scripts/seed.js');
  process.exit(1);
}

const sb = createClient(SB_URL, SB_KEY);

async function seed() {
  console.log('Seeding Supabase memory tables...\n');

  // 1. Initial session
  const { data: s1, error: e1 } = await sb.from('sessions').insert({
    session_date: new Date().toISOString().split('T')[0],
    summary: 'Project initialized with persistent memory scaffold.',
    changes: JSON.stringify(['Initial scaffold setup', 'Supabase tables created', 'Seed data inserted']),
    metadata: JSON.stringify({}),
    decisions: JSON.stringify([
      { what: 'Persistent memory scaffold', why: 'Proven pattern from TRADESYS — 95% session continuity' }
    ]),
    next_steps: JSON.stringify(['Build core features', 'Add project-specific decisions/learnings']),
    system_version: 'v1'
  }).select().single();
  console.log(e1 ? '✗ Session: ' + e1.message : '✓ Session seeded: ' + s1.session_date);

  // 2. Initial learning
  const { error: e2 } = await sb.from('learnings').insert({
    category: 'pattern',
    title: 'Persistent memory architecture',
    content: 'Supabase (sessions + decisions + learnings) + Vercel API (/api/state) + GitHub state files + Claude auto-memory = ~95% cross-session continuity.',
    tags: ['memory', 'architecture', 'infrastructure'],
    source: 'session',
    verified: true
  });
  console.log(e2 ? '✗ Learning: ' + e2.message : '✓ Learning: Persistent memory architecture');

  console.log('\n✅ Seed complete. Test with: curl {{VERCEL_URL}}/api/state');
}

seed().catch(e => { console.error('Seed failed:', e.message); process.exit(1); });
