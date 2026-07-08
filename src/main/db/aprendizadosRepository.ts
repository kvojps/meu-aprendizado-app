import type Database from 'better-sqlite3';
import { randomUUID } from 'node:crypto';
import type { Aprendizado, AprendizadoComProgresso } from '@shared/types/aprendizado';
import { AppError } from '../errors/AppError';

interface AprendizadoRow {
  id: string;
  titulo: string;
  descricao: string;
  created_at: string;
  updated_at: string;
}

interface AprendizadoComProgressoRow extends AprendizadoRow {
  total_nos: number;
  nos_concluidos: number;
}

function rowToAprendizado(row: AprendizadoRow): Aprendizado {
  return {
    id: row.id,
    titulo: row.titulo,
    descricao: row.descricao,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToAprendizadoComProgresso(row: AprendizadoComProgressoRow): AprendizadoComProgresso {
  return {
    ...rowToAprendizado(row),
    totalNos: row.total_nos,
    nosConcluidos: row.nos_concluidos,
  };
}

const PROGRESS_QUERY = `
  SELECT a.*,
    COUNT(n.id) AS total_nos,
    SUM(CASE WHEN n.status = 'concluido' THEN 1 ELSE 0 END) AS nos_concluidos
  FROM aprendizados a
  LEFT JOIN nos_aprendizado n ON n.aprendizado_id = a.id
`;

export function getAllAprendizados(db: Database.Database): AprendizadoComProgresso[] {
  const rows = db
    .prepare(`${PROGRESS_QUERY} GROUP BY a.id ORDER BY a.created_at ASC`)
    .all() as AprendizadoComProgressoRow[];
  return rows.map(rowToAprendizadoComProgresso);
}

export function getAllAprendizadosPlain(db: Database.Database): Aprendizado[] {
  const rows = db
    .prepare('SELECT * FROM aprendizados ORDER BY created_at ASC')
    .all() as AprendizadoRow[];
  return rows.map(rowToAprendizado);
}

export function getAprendizadoComProgressoById(
  db: Database.Database,
  id: string,
): AprendizadoComProgresso | undefined {
  const row = db.prepare(`${PROGRESS_QUERY} WHERE a.id = ? GROUP BY a.id`).get(id) as
    AprendizadoComProgressoRow | undefined;
  return row ? rowToAprendizadoComProgresso(row) : undefined;
}

function getAprendizadoById(db: Database.Database, id: string): Aprendizado | undefined {
  const row = db.prepare('SELECT * FROM aprendizados WHERE id = ?').get(id) as
    AprendizadoRow | undefined;
  return row ? rowToAprendizado(row) : undefined;
}

export function addAprendizado(
  db: Database.Database,
  data: { titulo: string; descricao: string },
): AprendizadoComProgresso {
  const now = new Date().toISOString();
  const aprendizado: Aprendizado = {
    id: randomUUID(),
    titulo: data.titulo,
    descricao: data.descricao,
    createdAt: now,
    updatedAt: now,
  };

  db.prepare(
    `INSERT INTO aprendizados (id, titulo, descricao, created_at, updated_at)
     VALUES (@id, @titulo, @descricao, @createdAt, @updatedAt)`,
  ).run(aprendizado);

  return { ...aprendizado, totalNos: 0, nosConcluidos: 0 };
}

export function updateAprendizado(
  db: Database.Database,
  id: string,
  data: Partial<{ titulo: string; descricao: string }>,
): AprendizadoComProgresso {
  const existing = getAprendizadoById(db, id);
  if (!existing) {
    throw new AppError(404, `Aprendizado não encontrado: ${id}`);
  }

  const updated: Aprendizado = {
    ...existing,
    ...data,
    id: existing.id,
    updatedAt: new Date().toISOString(),
  };

  db.prepare(
    `UPDATE aprendizados SET titulo = @titulo, descricao = @descricao, updated_at = @updatedAt
     WHERE id = @id`,
  ).run(updated);

  return getAprendizadoComProgressoById(db, id) as AprendizadoComProgresso;
}

export function deleteAprendizado(db: Database.Database, id: string): void {
  db.prepare('DELETE FROM aprendizados WHERE id = ?').run(id);
}
