import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type BetterSqlite3 from 'better-sqlite3';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize database
const dbPath = join(__dirname, '..', 'estimates.db');
const db: BetterSqlite3.Database = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS estimates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unit_number TEXT NOT NULL,
    model_number TEXT NOT NULL,
    location TEXT NOT NULL,
    issue TEXT NOT NULL,
    labor_cost REAL DEFAULT 0,
    parts_cost REAL DEFAULT 0,
    service_fee REAL DEFAULT 0,
    total_cost REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_unit_number ON estimates(unit_number);
  CREATE INDEX IF NOT EXISTS idx_created_at ON estimates(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_total_cost ON estimates(total_cost);
`);

console.log('✅ Database initialized at:', dbPath);

export { db };
export type { BetterSqlite3 };
