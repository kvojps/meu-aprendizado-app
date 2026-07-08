import type Database from 'better-sqlite3';
import { randomUUID } from 'node:crypto';
import type { NoAprendizado } from '@shared/types/noAprendizado';
import { AppError } from '../errors/AppError';

interface NoAprendizadoRow {
  id: string;
  aprendizado_id: string;
  parent_id: string | null;
  titulo: string;
  status: string;
  anotacoes: string;
  pos_x: number | null;
  pos_y: number | null;
  created_at: string;
  updated_at: string;
}

function rowToNo(row: NoAprendizadoRow): NoAprendizado {
  return {
    id: row.id,
    aprendizadoId: row.aprendizado_id,
    parentId: row.parent_id,
    titulo: row.titulo,
    status: row.status as NoAprendizado['status'],
    anotacoes: row.anotacoes,
    posX: row.pos_x,
    posY: row.pos_y,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getNosByAprendizadoId(
  db: Database.Database,
  aprendizadoId: string,
): NoAprendizado[] {
  const rows = db
    .prepare('SELECT * FROM nos_aprendizado WHERE aprendizado_id = ? ORDER BY created_at ASC')
    .all(aprendizadoId) as NoAprendizadoRow[];
  return rows.map(rowToNo);
}

export function getAllNos(db: Database.Database): NoAprendizado[] {
  const rows = db
    .prepare('SELECT * FROM nos_aprendizado ORDER BY created_at ASC')
    .all() as NoAprendizadoRow[];
  return rows.map(rowToNo);
}

function getNoById(db: Database.Database, id: string): NoAprendizado | undefined {
  const row = db.prepare('SELECT * FROM nos_aprendizado WHERE id = ?').get(id) as
    NoAprendizadoRow | undefined;
  return row ? rowToNo(row) : undefined;
}

export function addNo(
  db: Database.Database,
  data: { aprendizadoId: string; parentId: string | null; titulo: string; anotacoes: string },
): NoAprendizado {
  const now = new Date().toISOString();
  const no: NoAprendizado = {
    id: randomUUID(),
    aprendizadoId: data.aprendizadoId,
    parentId: data.parentId,
    titulo: data.titulo,
    status: 'nao_iniciado',
    anotacoes: data.anotacoes,
    posX: null,
    posY: null,
    createdAt: now,
    updatedAt: now,
  };

  db.prepare(
    `INSERT INTO nos_aprendizado
     (id, aprendizado_id, parent_id, titulo, status, anotacoes, pos_x, pos_y, created_at, updated_at)
     VALUES (@id, @aprendizadoId, @parentId, @titulo, @status, @anotacoes, @posX, @posY, @createdAt, @updatedAt)`,
  ).run(no);

  return no;
}

export function updateNo(
  db: Database.Database,
  id: string,
  data: Partial<Pick<NoAprendizado, 'titulo' | 'status' | 'anotacoes' | 'posX' | 'posY'>>,
): NoAprendizado {
  const existing = getNoById(db, id);
  if (!existing) {
    throw new AppError(404, `Tópico não encontrado: ${id}`);
  }

  const updated: NoAprendizado = {
    ...existing,
    ...data,
    id: existing.id,
    updatedAt: new Date().toISOString(),
  };

  db.prepare(
    `UPDATE nos_aprendizado SET titulo = @titulo, status = @status, anotacoes = @anotacoes,
     pos_x = @posX, pos_y = @posY, updated_at = @updatedAt WHERE id = @id`,
  ).run(updated);

  return updated;
}

export function deleteNo(db: Database.Database, id: string): void {
  db.prepare('DELETE FROM nos_aprendizado WHERE id = ?').run(id);
}
