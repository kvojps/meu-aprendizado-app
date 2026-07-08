import type Database from 'better-sqlite3';
import type { BackupData } from '@shared/types/backup';
import { getAllAprendizadosPlain } from './aprendizadosRepository';
import { getAllNos } from './nosAprendizadoRepository';

export const BACKUP_VERSION = 1;

export function exportData(db: Database.Database): BackupData {
  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    aprendizados: getAllAprendizadosPlain(db),
    nos: getAllNos(db),
  };
}

export function importData(db: Database.Database, data: BackupData): void {
  const insertAprendizado = db.prepare(
    `INSERT INTO aprendizados (id, titulo, descricao, created_at, updated_at)
     VALUES (@id, @titulo, @descricao, @createdAt, @updatedAt)`,
  );
  const insertNo = db.prepare(
    `INSERT INTO nos_aprendizado
     (id, aprendizado_id, parent_id, titulo, status, anotacoes, pos_x, pos_y, created_at, updated_at)
     VALUES (@id, @aprendizadoId, @parentId, @titulo, @status, @anotacoes, @posX, @posY, @createdAt, @updatedAt)`,
  );

  const importTransaction = db.transaction(() => {
    db.prepare('DELETE FROM nos_aprendizado').run();
    db.prepare('DELETE FROM aprendizados').run();

    for (const aprendizado of data.aprendizados) {
      insertAprendizado.run(aprendizado);
    }
    for (const no of data.nos) {
      insertNo.run(no);
    }
  });

  importTransaction();
}
