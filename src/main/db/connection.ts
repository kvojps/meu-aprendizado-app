import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'node:path';

let db: Database.Database | null = null;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS aprendizados (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS nos_aprendizado (
  id TEXT PRIMARY KEY,
  aprendizado_id TEXT NOT NULL REFERENCES aprendizados(id) ON DELETE CASCADE,
  parent_id TEXT REFERENCES nos_aprendizado(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'nao_iniciado',
  anotacoes TEXT NOT NULL DEFAULT '',
  pos_x REAL,
  pos_y REAL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_nos_aprendizado_aprendizado_id ON nos_aprendizado(aprendizado_id);
CREATE INDEX IF NOT EXISTS idx_nos_aprendizado_parent_id ON nos_aprendizado(parent_id);
`;

export function getDb(): Database.Database {
  if (!db) {
    throw new Error('Database has not been initialized yet');
  }
  return db;
}

export function initDb(): Database.Database {
  const dbPath = path.join(app.getPath('userData'), 'meu-aprendizado.db');
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(SCHEMA);
  migrate(db);
  return db;
}

// Migrações incrementais: o SCHEMA acima cobre instalações novas; bancos já
// existentes (criados antes da coluna existir) recebem o ALTER TABLE aqui,
// de forma idempotente.
function migrate(db: Database.Database): void {
  const hasPosX = db
    .prepare("SELECT 1 FROM pragma_table_info('nos_aprendizado') WHERE name = 'pos_x'")
    .get();
  if (!hasPosX) {
    db.exec('ALTER TABLE nos_aprendizado ADD COLUMN pos_x REAL');
    db.exec('ALTER TABLE nos_aprendizado ADD COLUMN pos_y REAL');
  }
}
