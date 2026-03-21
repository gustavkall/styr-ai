-- {{PROJECT_NAME}} — Persistent Memory Tables
-- Run in Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- 1. Sessions — stores session handoff data for cross-session continuity
CREATE TABLE IF NOT EXISTS sessions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_date DATE NOT NULL,
  summary TEXT,
  changes JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  decisions JSONB DEFAULT '[]',
  next_steps JSONB DEFAULT '[]',
  system_version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(session_date DESC);

-- 2. Decisions — project decisions with reasoning and outcomes
CREATE TABLE IF NOT EXISTS decisions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  decision_date DATE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- architecture, design, strategy, bug, feature
  context TEXT,
  decision TEXT NOT NULL,
  reasoning TEXT,
  outcome TEXT,
  status TEXT DEFAULT 'ACTIVE', -- ACTIVE, CLOSED, SUPERSEDED
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_decisions_category ON decisions(category);
CREATE INDEX IF NOT EXISTS idx_decisions_status ON decisions(status);
CREATE INDEX IF NOT EXISTS idx_decisions_date ON decisions(decision_date DESC);

-- 3. Learnings — insights and calibrations from sessions
CREATE TABLE IF NOT EXISTS learnings (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category TEXT NOT NULL, -- pattern, mistake, insight, calibration
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  source TEXT, -- session, experiment, user-feedback
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_learnings_category ON learnings(category);
CREATE INDEX IF NOT EXISTS idx_learnings_tags ON learnings USING GIN(tags);

-- Enable Row Level Security (public read/write via anon key)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for anon" ON sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON decisions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON learnings FOR ALL USING (true) WITH CHECK (true);
