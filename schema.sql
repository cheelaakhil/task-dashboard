-- Run this in your Supabase SQL Editor to set up the tasks table

CREATE TABLE IF NOT EXISTS tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       VARCHAR(200)  NOT NULL,
  description TEXT          DEFAULT '',
  status      VARCHAR(20)   NOT NULL DEFAULT 'todo'
                            CHECK (status IN ('todo', 'in_progress', 'completed')),
  due_date    DATE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Index for faster filtering by status
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- Index for sorting by due_date
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- Index for full text search on title and description
CREATE INDEX IF NOT EXISTS idx_tasks_title ON tasks USING gin(to_tsvector('english', title));

-- Optional: Row Level Security (disable for simplicity, enable for production)
-- ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
