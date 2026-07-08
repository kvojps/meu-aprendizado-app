import { z } from 'zod';
import { BACKUP_VERSION } from '../db/backupRepository';

const backupAprendizadoSchema = z.object({
  id: z.string(),
  titulo: z.string(),
  descricao: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const backupNoSchema = z.object({
  id: z.string(),
  aprendizadoId: z.string(),
  parentId: z.string().nullable(),
  titulo: z.string(),
  status: z.enum(['nao_iniciado', 'em_andamento', 'concluido']),
  anotacoes: z.string(),
  posX: z.number().nullable(),
  posY: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const backupSchema = z.object({
  version: z.literal(BACKUP_VERSION),
  exportedAt: z.string(),
  aprendizados: z.array(backupAprendizadoSchema),
  nos: z.array(backupNoSchema),
});
