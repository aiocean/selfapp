-- Categories for organizing notes (multi-entity relationship example)
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6b7280',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Add category_id foreign key to notes
ALTER TABLE notes ADD COLUMN category_id TEXT REFERENCES categories(id) ON DELETE SET NULL;

CREATE INDEX idx_notes_category ON notes(category_id);
