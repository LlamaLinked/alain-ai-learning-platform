-- Add version columns and change history tables for tutorials and steps

ALTER TABLE tutorials
  ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;

ALTER TABLE tutorial_steps
  ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;

CREATE TABLE IF NOT EXISTS tutorial_versions (
  id BIGSERIAL PRIMARY KEY,
  tutorial_id BIGINT NOT NULL REFERENCES tutorials(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  changed_by TEXT,
  change_type TEXT NOT NULL CHECK (change_type IN ('create','update','delete')),
  title TEXT,
  description TEXT,
  model TEXT,
  provider TEXT,
  difficulty TEXT,
  tags TEXT[]
);

CREATE INDEX IF NOT EXISTS idx_tutorial_versions_tut ON tutorial_versions(tutorial_id, version);

CREATE TABLE IF NOT EXISTS tutorial_step_versions (
  id BIGSERIAL PRIMARY KEY,
  step_id BIGINT,
  tutorial_id BIGINT NOT NULL REFERENCES tutorials(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  changed_by TEXT,
  change_type TEXT NOT NULL CHECK (change_type IN ('create','update','delete','reorder')),
  step_order INTEGER,
  title TEXT,
  content TEXT,
  code_template TEXT,
  expected_output TEXT,
  model_params JSONB
);

CREATE INDEX IF NOT EXISTS idx_tutorial_step_versions_tut ON tutorial_step_versions(tutorial_id, version);

