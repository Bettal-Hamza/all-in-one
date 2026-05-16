import Database from 'better-sqlite3'
import { mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR  = join(__dirname, '..', 'data')

mkdirSync(DATA_DIR, { recursive: true })

const db = new Database(join(DATA_DIR, 'suggestions.db'))

// WAL mode: faster writes, allows concurrent reads during a write
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS suggestions (
    id            INTEGER  PRIMARY KEY AUTOINCREMENT,
    user_name     TEXT     NOT NULL,
    user_email    TEXT,
    tool_category TEXT     NOT NULL,
    message       TEXT     NOT NULL,
    ip_address    TEXT     NOT NULL,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_suggestions_ip_time
    ON suggestions (ip_address, created_at);
`)

export default db
